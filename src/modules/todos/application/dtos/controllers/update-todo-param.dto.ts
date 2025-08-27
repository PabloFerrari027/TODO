import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UpdateTodoParamsDto {
  @ApiProperty({
    description: 'Unique identifier of the todo (UUID format).',
    example: 'b7f9d2a3-4567-8901-abcd-ef2345678901',
    required: true,
  })
  @IsUUID()
  id: string;
}
