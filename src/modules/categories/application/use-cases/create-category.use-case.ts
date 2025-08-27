import { Inject, Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import type { CategoriesRepository } from '../../domain/repositories/categories.repository';
import { Id } from 'src/shared/value-objects/id.value-object';
import { Name } from 'src/shared/value-objects/name.value-object';
import { CategoryAlreadyExistsError } from '../../domain/errors/category-already-exists.error';
import { CreateCategoryDto } from '../dtos/use-cases/create-category.dto';

type Output = Promise<{
  category: Category;
}>;

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject('CategoriesRepository')
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async execute(input: CreateCategoryDto): Output {
    const category = Category.create({
      id: Id.create(),
      name: Name.create(input.name),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const alreadyExists = await this.categoriesRepository.findByName(
      category.name,
    );

    if (alreadyExists) throw new CategoryAlreadyExistsError(input.name);

    await this.categoriesRepository.create(category);

    return { category };
  }
}
