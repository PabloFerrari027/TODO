import { CodeValidationRepository } from 'src/modules/auth/domain/repositories/code-validation.repository';
import { NodeEnv } from 'src/shared/config/env.dto';
import { InMemoryCodeValidationRepository } from '../../implementations/repositories/in-memory/in-memory-code-validation-repository.implementation';
import { PrismaCodeValidationRepository } from '../../implementations/repositories/prisma/prisma-code-validation-repository.implementation';
import { Inject, Injectable } from '@nestjs/common';
import { Env } from 'src/shared/config/env';
import { Prisma } from '../../orm/prisma';

@Injectable()
export class MakeCodeValidationRepositoryFactory {
  constructor(
    @Inject('Env')
    private readonly env: Env,
    @Inject('Prisma')
    private readonly prisma: Prisma,
  ) {}

  execute(): CodeValidationRepository {
    if (this.env.variables.NODE_ENV === NodeEnv.TEST) {
      return new InMemoryCodeValidationRepository();
    } else {
      return new PrismaCodeValidationRepository(this.prisma);
    }
  }
}
