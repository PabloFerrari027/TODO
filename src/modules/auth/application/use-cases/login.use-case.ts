import { Inject, Injectable } from '@nestjs/common';
import type { UsersRepository } from 'src/modules/users/domain/repositories/users.repository';
import type { SessionsRepository } from '../../domain/repositories/sessions.repository';
import { Email } from 'src/shared/value-objects/email.value-object';
import { Id } from 'src/shared/value-objects/id.value-object';
import { Bus } from 'src/shared/domain-events/bus';
import { CreatedSessionEvent } from '../../domain/events/created-session.event';
import { Session } from '../../domain/entities/session.entity';
import { LoginDto } from '../dtos/use-cases/login.dto';
import { UserNotFoundError } from 'src/modules/users/domain/errors/user-not-found.error';

type Output = Promise<{
  sessionId: Id;
}>;

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
    @Inject('SessionsRepository')
    private readonly sessionsRepository: SessionsRepository,
  ) {}

  async execute(input: LoginDto): Output {
    const user = await this.usersRepository.findByEmail(
      Email.create(input.email),
    );

    if (!user) throw new UserNotFoundError({ email: input.email });

    const session = Session.create({
      id: Id.create(),
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.sessionsRepository.create(session);

    await Bus.dispatch([new CreatedSessionEvent(session.id)]);

    return { sessionId: session.id };
  }
}
