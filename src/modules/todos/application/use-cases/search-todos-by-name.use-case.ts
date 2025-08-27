import { Inject, Injectable } from '@nestjs/common';
import { Todo } from '../../domain/entities/todo.entity';
import type { TodosRepository } from '../../domain/repositories/todos.repository';
import { SearchTodosByNameDto } from '../dtos/use-cases/search-todos-by-name.dto';

type Output = Promise<{
  todos: Array<Todo>;
  pages: number;
}>;

@Injectable()
export class SearchTodosByNameUseCase {
  private readonly take = 100;

  constructor(
    @Inject('TodosRepository')
    private readonly todosRepository: TodosRepository,
  ) {}

  async execute(input: SearchTodosByNameDto): Output {
    const { data, pages } = await this.todosRepository.searchByName(input.name);

    return { todos: data, pages };
  }
}
