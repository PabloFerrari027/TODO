import { Inject, Injectable } from '@nestjs/common';
import { DeleteCategoryDto } from '../dtos/use-cases/delete-category.dto';
import { Id } from 'src/shared/value-objects/id.value-object';
import { CategoryNotFoundError } from '../../domain/errors/category-not-found.error';
import type { CategoriesRepository } from '../../domain/repositories/categories.repository';
import type { TodosRepository } from 'src/modules/todos/domain/repositories/todos.repository';
import { NotAcceptableError } from 'src/shared/errors/not-acceptable.error';

type Output = Promise<void>;

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject('CategoriesRepository')
    private readonly categoriesRepository: CategoriesRepository,
    @Inject('TodosRepository')
    private readonly todosRepository: TodosRepository,
  ) {}

  async execute(input: DeleteCategoryDto): Output {
    const category = await this.categoriesRepository.findById(
      Id.from(input.id),
    );

    if (!category) throw new CategoryNotFoundError(input.id);

    const todos = await this.todosRepository.listByCategoryId(category.id, {
      take: 1,
    });

    if (todos.data.length > 0) {
      throw new NotAcceptableError([
        {
          message: `The category cannot be removed. Remove your dependents and try again.`,
        },
      ]);
    }

    await this.categoriesRepository.delete(category.id);
  }
}
