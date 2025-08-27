import { CategoriesRepository } from 'src/modules/categories/domain/repositories/categories.repository';
import { NodeEnv } from 'src/shared/config/env.dto';
import { InMemoryCategoriesRepository } from 'src/shared/infra/implementations/repositories/in-memory/in-memory-categories-repository.implementation';
import { PrismaCategoriesRepository } from '../../implementations/repositories/prisma/prisma-categories-repository.implementation';
import { Inject, Injectable } from '@nestjs/common';
import { Env } from 'src/shared/config/env';
import { Prisma } from '../../orm/prisma';

@Injectable()
export class MakeCategoriesRepositoryFactory {
  constructor(
    @Inject('Env')
    private readonly env: Env,
    @Inject('Prisma')
    private readonly prisma: Prisma,
  ) {}

  execute(): CategoriesRepository {
    if (this.env.variables.NODE_ENV === NodeEnv.TEST) {
      return new InMemoryCategoriesRepository();
    } else {
      return new PrismaCategoriesRepository(this.prisma);
    }
  }
}
