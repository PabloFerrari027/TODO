import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterBodyDto {
  @ApiProperty({
    example: 'Pablo',
    description: 'Name of the user',
    required: true,
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    example: 'user@email.com',
    description: 'Email of the user',
    required: true,
  })
  @IsEmail()
  email: string;
}
