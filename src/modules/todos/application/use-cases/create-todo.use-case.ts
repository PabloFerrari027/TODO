import type { TodosRepository } from '../../domain/repositories/todos.repository';
import type { CategoriesRepository } from 'src/modules/categories/domain/repositories/categories.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Todo } from '../../domain/entities/todo.entity';
import { Id } from 'src/shared/value-objects/id.value-object';
import { Name } from 'src/shared/value-objects/name.value-object';
import { CreateTodoDto } from '../dtos/use-cases/create-todo.dto';
import { CategoryNotFoundError } from 'src/modules/categories/domain/errors/category-not-found.error';

type Output = Promise<{
  todo: Todo;
}>;

@Injectable()
export class CreateTodoUseCase {
  constructor(
    @Inject('TodosRepository')
    private readonly todosRepository: TodosRepository,
    @Inject('CategoriesRepository')
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async execute(input: CreateTodoDto): Output {
    const category = await this.categoriesRepository.findById(
      Id.from(input.categoryId),
    );

    if (!category) throw new CategoryNotFoundError(input.categoryId);

    const todo = Todo.create({
      id: Id.create(),
      name: Name.create(input.name),
      status: 'PENDING',
      categoryId: category.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: input.notes ?? '',
    });

    await this.todosRepository.create(todo);

    return { todo };
  }
}
