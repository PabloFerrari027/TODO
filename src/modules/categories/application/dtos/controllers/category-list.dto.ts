import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';

export class CategoryListDto {
  @ApiProperty({ example: 1 })
  pages: number;

  @ApiProperty({ type: [CategoryDto] })
  categories: CategoryDto[];
}
