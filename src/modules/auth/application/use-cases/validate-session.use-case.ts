import { Inject, Injectable } from '@nestjs/common';
import type { CodeValidationRepository } from '../../domain/repositories/code-validation.repository';
import type { SessionsRepository } from '../../domain/repositories/sessions.repository';
import type { EncodingStrategy } from '../../../../shared/infra/ports/strategies/encoding.strategy';
import { ValidateSessionDto } from '../dtos/use-cases/validate-session.dto';
import { CodeValidationNotFoundError } from '../../domain/erros/code-validation-not-found.error';
import { SessionNotFoundError } from '../../domain/erros/session-not-found.error';
import { CodeValidationExpiredError } from '../../domain/erros/code-validation-expired.error';
import { SessionAlreadyValidatedError } from '../../domain/erros/session-alredy-validated.error';
import { Token } from '../../domain/value-objects/token';
import { Id } from 'src/shared/value-objects/id.value-object';
import { NotAcceptableError } from 'src/shared/errors/not-acceptable.error';

type Output = Promise<{
  accessToken: Token;
  refreshToken: Token;
}>;

@Injectable()
export class ValidateSessionUseCase {
  constructor(
    @Inject('SessionsRepository')
    private readonly sessionsRepository: SessionsRepository,
    @Inject('CodeValidationRepository')
    private readonly codeValidationRepository: CodeValidationRepository,
    @Inject('EncodingStrategy')
    private readonly encodingStrategy: EncodingStrategy,
  ) {}

  async execute(input: ValidateSessionDto): Output {
    const codeValidation = await this.codeValidationRepository.findByValue(
      input.code,
    );

    if (!codeValidation) throw new CodeValidationNotFoundError(input.code);
    if (codeValidation.isExpired()) {
      throw new CodeValidationExpiredError(input.code);
    }

    const session = await this.sessionsRepository.findById(
      Id.from(input.sessionId),
    );

    if (!session) {
      throw new SessionNotFoundError(input.sessionId);
    }

    if (session.validatedAt) {
      throw new SessionAlreadyValidatedError(input.sessionId);
    }

    if (!session.id.equals(codeValidation.sessionId)) {
      throw new NotAcceptableError([
        { message: `The code does not belong to the session` },
      ]);
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const accessTokenPayload = JSON.stringify({
      sessionId: session.id.value,
      expiresAt,
    });

    const refreshTokenPayload = JSON.stringify({ sessionId: session.id.value });

    const encodeAccessToken =
      await this.encodingStrategy.encode(accessTokenPayload);

    const encodeRefreshToken =
      await this.encodingStrategy.encode(refreshTokenPayload);

    const accessToken = Token.create({
      value: encodeAccessToken,
      sessionId: session.id,
      expiresAt,
    });

    const refreshToken = Token.create({
      value: encodeRefreshToken,
      sessionId: session.id,
    });

    session.validate();
    await this.sessionsRepository.save(session);

    return { accessToken, refreshToken };
  }
}
