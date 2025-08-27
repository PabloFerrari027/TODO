import { IsString, IsUUID } from 'class-validator';

export class ValidateSessionDto {
  @IsString()
  code: string;

  @IsUUID()
  sessionId: string;
}
