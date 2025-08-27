import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FieldsEnum } from '../../enums/fields.enum';

export class FindCategoryByIdQueryDto {
  @ApiPropertyOptional({
    description:
      'Specific fields to be included in the response. Accepts multiple values.',
    enum: FieldsEnum,
    isArray: true,
    example: ['id', 'name', 'created_at'],
  })
  @IsOptional()
  @IsEnum(FieldsEnum, { each: true })
  @Transform(({ value }: { value: unknown }) => {
    if (!value) return [];
    if (typeof value === 'string') return value.split(',');
    return [];
  })
  fields?: FieldsEnum[];
}
