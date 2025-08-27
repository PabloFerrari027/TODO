import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class UpdateTodoBodyDto {
  @ApiProperty({
    example: 'Todo',
    description: 'Todo name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiProperty({
    description: 'Unique identifier of the category (UUID format).',
    example: 'b7f9d2a3-4567-8901-abcd-ef2345678901',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @ApiProperty({
    description: 'Todo status',
    required: false,
    enum: ['DONE', 'PENDING'],
    example: 'DONE',
  })
  @IsOptional()
  @IsEnum(['DONE', 'PENDING'])
  status?: string;

  @ApiProperty({
    description: 'Todo description',
    example: 'Additional details about the todo',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
