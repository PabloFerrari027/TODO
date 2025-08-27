import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoBodyDto {
  @ApiProperty({
    example: 'Todo',
    description: 'Todo name',
    required: true,
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'Unique identifier of the category (UUID format).',
    example: 'b7f9d2a3-4567-8901-abcd-ef2345678901',
    required: true,
  })
  @IsUUID()
  category_id: string;

  @ApiProperty({
    description: 'Todo description',
    example: 'Additional details about the todo',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
