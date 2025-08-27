import { ApiProperty } from '@nestjs/swagger';

export class TodoDto {
  @ApiProperty({
    example: 'b7f9d2a3-4567-8901-abcd-ef2345678901',
    required: false,
  })
  id: string;

  @ApiProperty({ example: 'Todo', required: false })
  name: string;

  @ApiProperty({
    example: 'PENDING',
    enum: ['PENDING', 'DONE'],
    required: false,
  })
  status: string;

  @ApiProperty({
    example: 'b7f9d2a3-4567-8901-abcd-ef2345678901',
    required: false,
  })
  category_id: string;

  @ApiProperty({
    example: 'Additional details about the todo',
    required: false,
  })
  notes?: string;

  @ApiProperty({ example: '2025-08-26T19:43:50.342Z', required: false })
  created_at: string;

  @ApiProperty({ example: '2025-08-26T19:43:50.342Z', required: false })
  updated_at: string;
}
