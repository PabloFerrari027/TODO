import { UsersRepository } from 'src/modules/users/domain/repositories/users.repository';
import { NodeEnv } from 'src/shared/config/env.dto';
import { InMemoryUsersRepository } from 'src/shared/infra/implementations/repositories/in-memory/in-memory-users-repository.implementation';
import { PrismaUsersRepository } from '../../implementations/repositories/prisma/prisma-users-repository.implementation';
import { Inject, Injectable } from '@nestjs/common';
import { Env } from 'src/shared/config/env';
import { Prisma } from '../../orm/prisma';

@Injectable()
export class MakeUsersRepositoryFactory {
  constructor(
    @Inject('Env')
    private readonly env: Env,
    @Inject('Prisma')
    private readonly prisma: Prisma,
  ) {}

  execute(): UsersRepository {
    if (this.env.variables.NODE_ENV === NodeEnv.TEST) {
      return new InMemoryUsersRepository();
    } else {
      return new PrismaUsersRepository(this.prisma);
    }
  }
}
