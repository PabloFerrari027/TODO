import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class UpdateTodoDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsEnum(['DONE', 'PENDING'])
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : undefined,
  )
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
