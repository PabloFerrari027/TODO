import { Inject, Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import type { CategoriesRepository } from '../../domain/repositories/categories.repository';
import { Id } from 'src/shared/value-objects/id.value-object';
import { FindCategoryByIdDto } from '../dtos/use-cases/find-category-by-id.dto';

type Output = Promise<{
  category: Category | null;
}>;

@Injectable()
export class FindCategoryByIdUseCase {
  constructor(
    @Inject('CategoriesRepository')
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async execute(input: FindCategoryByIdDto): Output {
    const id = Id.from(input.id);

    const category = await this.categoriesRepository.findById(id);

    return { category };
  }
}
