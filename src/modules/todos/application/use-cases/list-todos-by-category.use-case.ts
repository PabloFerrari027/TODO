import { Inject, Injectable } from '@nestjs/common';
import { Todo } from '../../domain/entities/todo.entity';
import type { TodosRepository } from '../../domain/repositories/todos.repository';
import { ListTodosByCategoryDto } from '../dtos/use-cases/list-todos-by-category.dto';
import { Id } from 'src/shared/value-objects/id.value-object';

type Output = Promise<{
  todos: Array<Todo>;
  pages: number;
}>;

@Injectable()
export class ListTodosByCategoryUseCase {
  private readonly take = 100;

  constructor(
    @Inject('TodosRepository')
    private readonly todosRepository: TodosRepository,
  ) {}

  async execute(input: ListTodosByCategoryDto): Output {
    const page = input.page as number;
    const skip = (page - 1) * this.take;

    const { data, pages } = await this.todosRepository.listByCategoryId(
      Id.from(input.categoryId),
      { order: input.order, skip, sortBy: input.sortBy, take: this.take },
    );

    return { todos: data, pages };
  }
}
