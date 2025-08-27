import { Inject, Injectable } from '@nestjs/common';
import { DeleteTodoDto } from '../dtos/use-cases/delete-todo.dto';
import { Id } from 'src/shared/value-objects/id.value-object';
import { TodoNotFoundError } from '../../domain/errors/todo-not-found.error';
import type { TodosRepository } from '../../domain/repositories/todos.repository';

type Output = Promise<void>;

@Injectable()
export class DeleteTodoUseCase {
  constructor(
    @Inject('TodosRepository')
    private readonly todosRepository: TodosRepository,
  ) {}

  async execute(input: DeleteTodoDto): Output {
    const todo = await this.todosRepository.findById(Id.from(input.id));

    if (!todo) throw new TodoNotFoundError(input.id);

    await this.todosRepository.delete(todo.id);
  }
}
