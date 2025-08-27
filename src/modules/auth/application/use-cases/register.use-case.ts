import { Inject, Injectable } from '@nestjs/common';
import type { UsersRepository } from 'src/modules/users/domain/repositories/users.repository';
import type { SessionsRepository } from '../../domain/repositories/sessions.repository';
import { RegisterDto } from '../dtos/use-cases/register.dto';
import { Email } from 'src/shared/value-objects/email.value-object';
import { UserAlreadyExistsError } from '../../../users/domain/errors/user-already-exists.error';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { Name } from 'src/shared/value-objects/name.value-object';
import { Id } from 'src/shared/value-objects/id.value-object';
import { Bus } from 'src/shared/domain-events/bus';
import { CreatedSessionEvent } from '../../domain/events/created-session.event';
import { Session } from '../../domain/entities/session.entity';

type Output = Promise<{
  sessionId: Id;
}>;

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
    @Inject('SessionsRepository')
    private readonly sessionsRepository: SessionsRepository,
  ) {}

  async execute(input: RegisterDto): Output {
    const userAlreadyExists = await this.usersRepository.findByEmail(
      Email.create(input.email),
    );

    if (userAlreadyExists) throw new UserAlreadyExistsError(input.email);

    const user = User.create({
      id: Id.create(),
      name: Name.create(input.name),
      email: Email.create(input.email),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const session = Session.create({
      id: Id.create(),
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.usersRepository.create(user);
    await this.sessionsRepository.create(session);

    await Bus.dispatch([new CreatedSessionEvent(session.id)]);

    return { sessionId: session.id };
  }
}
