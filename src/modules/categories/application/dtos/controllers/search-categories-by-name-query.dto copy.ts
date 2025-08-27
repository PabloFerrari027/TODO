import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { FieldsEnum } from '../../enums/fields.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchCategoriesByNameQueryDto {
  @ApiProperty({
    example: 'Category',
    description: 'Category Name',
    required: true,
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({
    description: 'List of fields to be returned in the response.',
    enum: FieldsEnum,
    isArray: true,
    example: [FieldsEnum.id, FieldsEnum.name],
  })
  @IsOptional()
  @IsEnum(FieldsEnum)
  @IsArray()
  @Transform(({ value }: { value: unknown }) => {
    if (!value) return [];
    if (typeof value === 'string') return value.split(',');
    return [];
  })
  fields?: FieldsEnum[];
}
