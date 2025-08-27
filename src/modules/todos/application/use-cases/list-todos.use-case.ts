import { Inject, Injectable } from '@nestjs/common';
import { Todo } from '../../domain/entities/todo.entity';
import type { TodosRepository } from '../../domain/repositories/todos.repository';
import type { CategoriesRepository } from 'src/modules/categories/domain/repositories/categories.repository';
import { ListTodosDto } from '../dtos/use-cases/list-todos.dto';
import { Category } from 'src/modules/categories/domain/entities/category.entity';
import { ValueType } from 'src/shared/value-objects/id.value-object';

type Output = Promise<{
  todos: Array<{ todo: Todo; category: Category }>;
  pages: number;
}>;

@Injectable()
export class ListTodosUseCase {
  private readonly take = 100;

  constructor(
    @Inject('TodosRepository')
    private readonly todosRepository: TodosRepository,
    @Inject('CategoriesRepository')
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async execute(input: ListTodosDto): Output {
    const page = input.page as number;
    const skip = (page - 1) * this.take;

    const { data, pages } = await this.todosRepository.list({
      order: input.order,
      skip,
      sortBy: input.sortBy,
      take: this.take,
    });

    const categoryIds = Array.from(
      new Set(data.map((todo) => todo.categoryId)),
    );

    const categories = await this.categoriesRepository.findByIds(categoryIds);

    const categoriesObj = categories.reduce<Record<ValueType, Category>>(
      (acc, category) => {
        acc[category.id.value] = category;
        return acc;
      },
      {},
    );

    const todos = data.map((todo) => ({
      todo,
      category: categoriesObj[todo.categoryId.value],
    }));

    return { todos, pages };
  }
}
