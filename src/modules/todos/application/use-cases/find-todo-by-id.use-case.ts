import { Inject, Injectable } from '@nestjs/common';
import { Todo } from '../../domain/entities/todo.entity';
import type { TodosRepository } from '../../domain/repositories/todos.repository';
import { Id } from 'src/shared/value-objects/id.value-object';
import { FindTodoByIdDto } from '../dtos/use-cases/find-todo-by-id.dto';

type Output = Promise<{
  todo: Todo | null;
}>;

@Injectable()
export class FindTodoByIdUseCase {
  constructor(
    @Inject('TodosRepository')
    private readonly todosRepository: TodosRepository,
  ) {}

  async execute(input: FindTodoByIdDto): Output {
    const id = Id.from(input.id);

    const todo = await this.todosRepository.findById(id);

    if (!todo) return { todo: null };

    return { todo };
  }
}
