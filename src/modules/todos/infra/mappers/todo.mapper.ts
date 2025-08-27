import { Injectable } from '@nestjs/common';
import { Todo } from '../../domain/entities/todo.entity';

@Injectable()
export class TodoMapper {
  static toController(todo: Todo) {
    return todo.toJSON('SNAKE_CASE');
  }
}
