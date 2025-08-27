import { IsUUID } from 'class-validator';

export class DeleteTodoDto {
  @IsUUID()
  id: string;
}
