import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteCategoryParamDto {
  @ApiProperty({
    description: 'Unique identifier of the category (UUID format).',
    example: 'b7f9d2a3-4567-8901-abcd-ef2345678901',
    required: true,
  })
  @IsUUID()
  id: string;
}
