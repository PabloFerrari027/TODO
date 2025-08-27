import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(1, { message: 'Name cannot be empty' })
  name: string;

  @IsEmail()
  email: string;
}
