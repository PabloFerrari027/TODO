import { Inject, Injectable } from '@nestjs/common';
import type { SessionsRepository } from '../../domain/repositories/sessions.repository';
import type { EncodingStrategy } from '../../../../shared/infra/ports/strategies/encoding.strategy';
import { Token } from '../../domain/value-objects/token';
import { RefreshTokenDto } from '../dtos/use-cases/refresh-token.dto';
import { UnauthorizedError } from '../../domain/erros/unauthorized.error';
import { Id } from 'src/shared/value-objects/id.value-object';
import { TokenPayloadDto } from '../dtos/use-cases/token-payload.dto';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

type Output = Promise<{
  accessToken: Token;
  refreshToken: Token;
}>;

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('SessionsRepository')
    private readonly sessionsRepository: SessionsRepository,
    @Inject('EncodingStrategy')
    private readonly encodingStrategy: EncodingStrategy,
  ) {}

  async execute(input: RefreshTokenDto): Output {
    const decodeAccessToken = await this.encodingStrategy.dencode(
      input.accessToken,
    );

    const decodeRefreshToken = await this.encodingStrategy.dencode(
      input.refreshToken,
    );

    const accessTokenDto = plainToInstance(
      TokenPayloadDto,
      JSON.parse(decodeAccessToken),
    );

    const refreshTokenDto = plainToInstance(
      TokenPayloadDto,
      JSON.parse(decodeRefreshToken),
    );

    let hasErros = false;

    if (validateSync(refreshTokenDto).length > 0) hasErros = true;
    if (validateSync(accessTokenDto).length > 0) hasErros = true;

    if (hasErros) throw new UnauthorizedError();

    const currentAccessToken = Token.create({
      value: input.accessToken,
      sessionId: Id.from(accessTokenDto.sessionId),
      expiresAt: accessTokenDto.expiresAt,
    });

    const currentRefreshToken = Token.create({
      value: input.refreshToken,
      sessionId: Id.from(refreshTokenDto.sessionId),
      expiresAt: refreshTokenDto.expiresAt,
    });

    if (currentAccessToken.isExpired() || currentRefreshToken.isExpired()) {
      throw new UnauthorizedError();
    }

    if (!currentAccessToken.sessionId.equals(currentRefreshToken.sessionId)) {
      throw new UnauthorizedError();
    }

    const session = await this.sessionsRepository.findById(
      currentAccessToken.sessionId,
    );

    if (!session) throw new UnauthorizedError();

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const newAccessTokenPayload = JSON.stringify({
      sessionId: session.id.value,
      expiresAt,
    });

    const newRefreshTokenPayload = JSON.stringify({
      sessionId: session.id.value,
    });

    const encodeNewAccessToken = await this.encodingStrategy.encode(
      newAccessTokenPayload,
    );

    const encodeNewRefreshToken = await this.encodingStrategy.encode(
      newRefreshTokenPayload,
    );

    const newAccessToken = Token.create({
      value: encodeNewAccessToken,
      sessionId: session.id,
      expiresAt,
    });

    const newRefreshToken = Token.create({
      value: encodeNewRefreshToken,
      sessionId: session.id,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
