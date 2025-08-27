import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { OrderEnum } from '../../enums/order.unum';

export enum SortByEnum {
  id = 'id',
  name = 'name',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export class ListCategoriesDto {
  @IsOptional()
  @IsEnum(OrderEnum)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  order?: OrderEnum = OrderEnum.desc;

  @IsOptional()
  @IsEnum(SortByEnum)
  sortBy?: SortByEnum = SortByEnum.createdAt;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;
}
