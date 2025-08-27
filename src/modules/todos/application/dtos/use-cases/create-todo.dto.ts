import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
