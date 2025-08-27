import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class ValidateSessionBodyDto {
  @ApiProperty({
    description: 'Code generated to validate the session',
    example: '123456',
    required: true,
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Unique identifier of the session (UUID format).',
    example: 'b7f9d2a3-4567-8901-abcd-ef2345678901',
    required: true,
  })
  @IsUUID()
  session_id: string;
}
