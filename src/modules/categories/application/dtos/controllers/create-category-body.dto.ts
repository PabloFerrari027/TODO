import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryBodyDto {
  @ApiProperty({
    example: 'Category',
    description: 'Category name',
    required: true,
  })
  @IsString()
  @MinLength(1)
  name: string;
}
