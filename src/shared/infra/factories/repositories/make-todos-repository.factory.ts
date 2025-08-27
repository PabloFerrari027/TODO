import { TodosRepository } from 'src/modules/todos/domain/repositories/todos.repository';
import { NodeEnv } from 'src/shared/config/env.dto';
import { InMemoryTodosRepository } from 'src/shared/infra/implementations/repositories/in-memory/in-memory-todos-repository.implementation';
import { PrismaTodosRepository } from '../../implementations/repositories/prisma/prisma-todos-repository.implementation';
import { Inject, Injectable } from '@nestjs/common';
import { Env } from 'src/shared/config/env';
import { Prisma } from '../../orm/prisma';

@Injectable()
export class MakeTodosRepositoryFactory {
  constructor(
    @Inject('Env')
    private readonly env: Env,
    @Inject('Prisma')
    private readonly prisma: Prisma,
  ) {}

  execute(): TodosRepository {
    if (this.env.variables.NODE_ENV === NodeEnv.TEST) {
      return new InMemoryTodosRepository();
    } else {
      return new PrismaTodosRepository(this.prisma);
    }
  }
}
