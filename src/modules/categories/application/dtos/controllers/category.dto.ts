import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({
    example: 'b7f9d2a3-4567-8901-abcd-ef2345678901',
    required: false,
  })
  id: string;

  @ApiProperty({ example: 'Category', required: false })
  name: string;

  @ApiProperty({ example: '2025-08-26T19:43:50.342Z', required: false })
  created_at: string;

  @ApiProperty({ example: '2025-08-26T19:43:50.342Z', required: false })
  updated_at: string;
}
