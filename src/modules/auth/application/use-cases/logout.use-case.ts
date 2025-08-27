import { Inject, Injectable } from '@nestjs/common';
import type { SessionsRepository } from '../../domain/repositories/sessions.repository';
import { Id } from 'src/shared/value-objects/id.value-object';
import { LogoutDto } from '../dtos/use-cases/logout.dto';
import { SessionNotFoundError } from '../../domain/erros/session-not-found.error';

type Output = Promise<void>;

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject('SessionsRepository')
    private readonly sessionsRepository: SessionsRepository,
  ) {}

  async execute(input: LogoutDto): Output {
    const session = await this.sessionsRepository.findById(
      Id.from(input.sessionId),
    );

    if (!session) throw new SessionNotFoundError(input.sessionId);

    session.close();

    await this.sessionsRepository.save(session);
  }
}
