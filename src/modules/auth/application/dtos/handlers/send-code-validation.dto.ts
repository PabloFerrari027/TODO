import { IsUUID } from 'class-validator';

export class SendCodeValidationDto {
  @IsUUID()
  sessionId: string;
}
