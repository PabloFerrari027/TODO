import { Inject, Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import type { CategoriesRepository } from '../../domain/repositories/categories.repository';
import { Id } from 'src/shared/value-objects/id.value-object';
import { UpdateCategoryDto } from '../dtos/use-cases/update-category.dto';
import { CategoryNotFoundError } from '../../domain/errors/category-not-found.error';
import { Name } from 'src/shared/value-objects/name.value-object';
import { CategoryAlreadyExistsError } from '../../domain/errors/category-already-exists.error';

type Output = Promise<{
  category: Category;
}>;

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject('CategoriesRepository')
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async execute(input: UpdateCategoryDto): Output {
    const category = await this.categoriesRepository.findById(
      Id.from(input.id),
    );

    if (!category) throw new CategoryNotFoundError(input.id);

    if (input.name && !category.name.equals(input.name)) {
      const alreadyExists = await this.categoriesRepository.findByName(
        Name.create(input.name),
      );

      if (alreadyExists) throw new CategoryAlreadyExistsError(input.name);

      category.name = Name.create(input.name);
    }

    await this.categoriesRepository.save(category);

    return { category };
  }
}
