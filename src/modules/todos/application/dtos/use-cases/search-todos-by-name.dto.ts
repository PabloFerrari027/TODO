import { IsString, MinLength } from 'class-validator';

export class SearchTodosByNameDto {
  @IsString()
  @MinLength(1)
  name: string;
}
