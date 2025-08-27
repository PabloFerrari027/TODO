import { Inject, Injectable } from '@nestjs/common';
import {
  PrismaClient,
  CodeValidation as PrismaCodeValidation,
} from '@prisma/client';
import { CodeValidation } from 'src/modules/auth/domain/entities/code-validation.entity';
import { CodeValidationRepository } from 'src/modules/auth/domain/repositories/code-validation.repository';
import { Prisma } from 'src/shared/infra/orm/prisma';
import { Id } from 'src/shared/value-objects/id.value-object';

@Injectable()
export class PrismaCodeValidationRepository
  implements CodeValidationRepository
{
  private readonly postgreSQl: PrismaClient;

  constructor(
    @Inject('Prisma')
    private readonly prisma: Prisma,
  ) {
    this.postgreSQl = this.prisma.postgreSQl();
  }

  private handleItem(item: PrismaCodeValidation): CodeValidation {
    const codeValidation = CodeValidation.create({
      id: Id.from(item.id),
      value: item.value,
      sessionId: Id.from(item.session_id),
      usedAt: item.used_at ?? undefined,
      createdAt: item.created_at,
    });

    return codeValidation;
  }

  async create(codevalidation: CodeValidation): Promise<CodeValidation> {
    await this.postgreSQl.codeValidation.create({
      data: {
        id: codevalidation.id.value,
        value: codevalidation.value,
        session_id: codevalidation.sessionId.value,
        used_at: codevalidation.usedAt,
        created_at: codevalidation.createdAt,
      },
    });

    return codevalidation;
  }

  async save(codevalidation: CodeValidation): Promise<CodeValidation> {
    await this.postgreSQl.codeValidation.update({
      where: { id: codevalidation.id.value },
      data: {
        value: codevalidation.value,
        session_id: codevalidation.sessionId.value,
        used_at: codevalidation.usedAt,
        created_at: codevalidation.createdAt,
      },
    });

    return codevalidation;
  }

  async findByValue(value: string): Promise<CodeValidation | null> {
    const item = await this.postgreSQl.codeValidation.findFirst({
      where: { value },
    });

    if (!item) return null;
    else return this.handleItem(item);
  }
}
