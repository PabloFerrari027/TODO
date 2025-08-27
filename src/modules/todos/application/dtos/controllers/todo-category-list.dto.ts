import { ApiProperty } from '@nestjs/swagger';
import { TodoDto } from './todo.dto';
import { CategoryDto } from 'src/modules/categories/application/dtos/controllers/category.dto';

class TodoWithCategoryDto {
  @ApiProperty({ type: () => TodoDto })
  todo: TodoDto;

  @ApiProperty({ type: () => CategoryDto })
  category: CategoryDto;
}

export class TodoCategoryListDto {
  @ApiProperty({ example: 1 })
  pages: number;

  @ApiProperty({ type: () => [TodoWithCategoryDto] })
  todos: TodoWithCategoryDto[];
}
