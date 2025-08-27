import { Injectable } from '@nestjs/common';
import { CodeValidation } from 'src/modules/auth/domain/entities/code-validation.entity';
import { CodeValidationRepository } from 'src/modules/auth/domain/repositories/code-validation.repository';
import { Id, ValueType } from 'src/shared/value-objects/id.value-object';

@Injectable()
export class InMemoryCodeValidationRepository
  implements CodeValidationRepository
{
  private items: Record<ValueType, CodeValidation>;
  private readonly take = 100;

  constructor() {
    this.items = {};
  }

  async create(codevalidation: CodeValidation): Promise<CodeValidation> {
    this.items[codevalidation.id.value] = codevalidation;
    return codevalidation;
  }

  async save(codevalidation: CodeValidation): Promise<CodeValidation> {
    this.items[codevalidation.id.value] = codevalidation;
    return codevalidation;
  }

  async findById(id: Id): Promise<CodeValidation | null> {
    return this.items[id.value] || null;
  }

  async findByValue(value: string): Promise<CodeValidation | null> {
    const codeValidation = Object.values(this.items).find(
      (item) => item.value === value,
    );
    return codeValidation || null;
  }
}
