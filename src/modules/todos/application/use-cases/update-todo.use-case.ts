import { Inject, Injectable } from '@nestjs/common';
import { Status, Todo } from '../../domain/entities/todo.entity';
import type { TodosRepository } from '../../domain/repositories/todos.repository';
import type { CategoriesRepository } from 'src/modules/categories/domain/repositories/categories.repository';
import { Id } from 'src/shared/value-objects/id.value-object';
import { UpdateTodoDto } from '../dtos/use-cases/update-todo.dto';
import { TodoNotFoundError } from '../../domain/errors/todo-not-found.error';
import { Name } from 'src/shared/value-objects/name.value-object';
import { CategoryNotFoundError } from 'src/modules/categories/domain/errors/category-not-found.error';

type Output = Promise<{
  todo: Todo;
}>;

@Injectable()
export class UpdateTodoUseCase {
  constructor(
    @Inject('TodosRepository')
    private readonly todosRepository: TodosRepository,
    @Inject('CategoriesRepository')
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async execute(input: UpdateTodoDto): Output {
    const todo = await this.todosRepository.findById(Id.from(input.id));

    if (!todo) throw new TodoNotFoundError(input.id);

    if (input.name && !todo.name.equals(input.name)) {
      todo.name = Name.create(input.name);
    }

    if (input.status && todo.status !== input.status) {
      todo.status = input.status as Status;
    }

    if (input.notes && todo.notes !== input.notes) {
      todo.notes = input.notes;
    }

    if (input.categoryId && !todo.categoryId.equals(input.categoryId)) {
      const category = await this.categoriesRepository.findById(
        Id.from(input.categoryId),
      );

      if (!category) throw new CategoryNotFoundError(input.categoryId);

      todo.categoryId = category.id;
    }

    await this.todosRepository.save(todo);

    return { todo };
  }
}
