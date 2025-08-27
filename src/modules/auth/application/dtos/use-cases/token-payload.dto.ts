import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsUUID } from 'class-validator';

export class TokenPayloadDto {
  @IsUUID()
  sessionId: string;

  @IsOptional()
  @IsDate()
  @Transform((value: { value: unknown }) =>
    typeof value === 'string' ? new Date(value) : undefined,
  )
  expiresAt?: Date;
}
