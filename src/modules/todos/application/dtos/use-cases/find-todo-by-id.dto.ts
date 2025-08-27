import { IsUUID } from 'class-validator';

export class FindTodoByIdDto {
  @IsUUID()
  id: string;
}
