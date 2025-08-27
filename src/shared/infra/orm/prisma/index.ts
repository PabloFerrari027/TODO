import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Env } from '../../../config/env';

@Injectable()
export class Prisma {
  constructor(
    @Inject('Env')
    private readonly env: Env,
  ) {}

  postgreSQl(): PrismaClient {
    const cliet = new PrismaClient({
      datasources: {
        db: { url: this.env.variables.POSTGRESQL_DATABASE_URL },
      },
    });
    return cliet;
  }
}
