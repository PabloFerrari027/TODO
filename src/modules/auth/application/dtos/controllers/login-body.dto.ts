import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LoginBodyDto {
  @ApiProperty({
    example: 'user@email.com',
    description: 'Email of the user',
    required: true,
  })
  @IsEmail()
  email: string;
}
