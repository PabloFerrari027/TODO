import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { FieldsEnum } from '../../enums/fields.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchTodosByNameQueryDto {
  @ApiProperty({
    example: 'Todo',
    description: 'Todo name',
    required: true,
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'List of fields to be returned in the response.',
    enum: FieldsEnum,
    isArray: true,
    example: [FieldsEnum.id, FieldsEnum.name],
  })
  @IsOptional()
  @IsEnum(FieldsEnum, { each: true })
  @IsArray()
  @Transform(({ value }: { value: unknown }) => {
    if (!value) return [];
    if (typeof value === 'string') return value.split(',');
    return [];
  })
  fields?: FieldsEnum[];
}
