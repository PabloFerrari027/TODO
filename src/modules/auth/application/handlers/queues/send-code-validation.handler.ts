import type { UsersRepository } from 'src/modules/users/domain/repositories/users.repository';
import type { NotificationStrategy } from 'src/shared/infra/ports/strategies/notification.strategy';
import { Inject, Injectable } from '@nestjs/common';
import { UserNotFoundError } from 'src/modules/users/domain/errors/user-not-found.error';
import { Id } from 'src/shared/value-objects/id.value-object';
import { Handler } from 'src/shared/handlers/handler';
import type { SessionsRepository } from 'src/modules/auth/domain/repositories/sessions.repository';
import type { CodeValidationRepository } from 'src/modules/auth/domain/repositories/code-validation.repository';
import type { VerificationCodeTemplate } from 'src/modules/auth/templates/verification-code.template';
import { SessionNotFoundError } from 'src/modules/auth/domain/erros/session-not-found.error';
import { CodeValidation } from 'src/modules/auth/domain/entities/code-validation.entity';
import { SendCodeValidationDto } from '../../dtos/handlers/send-code-validation.dto';
import { Env } from 'src/shared/config/env';

@Injectable()
export class SendCodeValidationHandler extends Handler {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
    @Inject('SessionsRepository')
    private readonly sessionsRepository: SessionsRepository,
    @Inject('CodeValidationRepository')
    private readonly codeValidationRepository: CodeValidationRepository,
    @Inject('NotificationStrategy')
    private readonly notificationStrategy: NotificationStrategy,
    @Inject('VerificationCodeTemplate')
    private readonly verificationCodeTemplate: VerificationCodeTemplate,
    @Inject('Env')
    private readonly env: Env,
  ) {
    super();
  }

  async execute(input: SendCodeValidationDto) {
    const session = await this.sessionsRepository.findById(
      Id.from(input.sessionId),
    );

    if (!session) {
      throw new SessionNotFoundError(input.sessionId);
    }

    const user = await this.usersRepository.findById(session.userId);

    if (!user) throw new UserNotFoundError({ id: session.userId.value });

    const codeValidation = CodeValidation.create({
      id: Id.create(),
      sessionId: session.id,
      value: CodeValidation.generate(),
      createdAt: new Date(),
    });

    await this.codeValidationRepository.create(codeValidation);

    const { body, head } = this.verificationCodeTemplate.generate({
      code: codeValidation.value,
      language: this.env.variables.TEMPLATE_LANGUAGE,
      userName: user.name.value,
    });

    await this.notificationStrategy.send(user.email.value, head, body);
  }
}
