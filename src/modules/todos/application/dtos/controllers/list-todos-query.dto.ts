import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { OrderEnum } from '../../enums/order.enum';
import { FieldsEnum } from '../../enums/fields.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum SortByEnum {
  id = 'id',
  name = 'name',
  created_at = 'created_at',
  updated_at = 'updated_at',
}

export class ListTodosQueryDto {
  @ApiPropertyOptional({
    description:
      'Page number for pagination. Must be an integer greater than or equal to 1.',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description:
      'Order of the results. "asc" for ascending or "desc" for descending.',
    enum: OrderEnum,
    example: OrderEnum.desc,
  })
  @IsOptional()
  @IsEnum(OrderEnum)
  order?: OrderEnum = OrderEnum.desc;

  @ApiPropertyOptional({
    description: 'Field to sort the results by.',
    enum: SortByEnum,
    example: SortByEnum.created_at,
  })
  @IsOptional()
  @IsEnum(SortByEnum)
  sort_by?: SortByEnum = SortByEnum.created_at;

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
