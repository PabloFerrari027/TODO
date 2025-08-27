import { ApiProperty } from '@nestjs/swagger';
import { TodoDto } from './todo.dto';

export class TodoListDto {
  @ApiProperty({ example: 1 })
  pages: number;

  @ApiProperty({ type: [TodoDto] })
  todos: TodoDto[];
}
