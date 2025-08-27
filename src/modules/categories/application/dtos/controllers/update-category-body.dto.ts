import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCategoryBodyDto {
  @ApiPropertyOptional({
    description: 'The name of the category. Must be at least 1 character long.',
    example: 'Category Name',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
}
