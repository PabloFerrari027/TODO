import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { FieldsEnum } from '../../enums/fields.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTodoQueryDto {
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
