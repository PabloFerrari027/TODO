import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsUUID()
  id: string;
}
