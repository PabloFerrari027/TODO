import { NodeEnv } from 'src/shared/config/env.dto';
import { InMemorySessionsRepository } from 'src/shared/infra/implementations/repositories/in-memory/in-memory-sessions-repository.implementation';
import { PrismaSessionsRepository } from '../../implementations/repositories/prisma/prisma-sessions-repository.implementation';
import { SessionsRepository } from 'src/modules/auth/domain/repositories/sessions.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Env } from 'src/shared/config/env';
import { Prisma } from '../../orm/prisma';

@Injectable()
export class MakeSessionsRepositoryFactory {
  constructor(
    @Inject('Env')
    private readonly env: Env,
    @Inject('Prisma')
    private readonly prisma: Prisma,
  ) {}

  execute(): SessionsRepository {
    if (this.env.variables.NODE_ENV === NodeEnv.TEST) {
      return new InMemorySessionsRepository();
    } else {
      return new PrismaSessionsRepository(this.prisma);
    }
  }
}
