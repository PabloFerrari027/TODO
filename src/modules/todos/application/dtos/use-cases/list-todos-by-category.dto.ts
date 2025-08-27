import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min, IsUUID } from 'class-validator';
import { OrderEnum } from '../../enums/order.enum';

export enum SortByEnum {
  id = 'id',
  name = 'name',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export class ListTodosByCategoryDto {
  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsEnum(OrderEnum)
  order?: OrderEnum = OrderEnum.desc;

  @IsOptional()
  @IsEnum(SortByEnum)
  sortBy?: SortByEnum = SortByEnum.createdAt;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;
}
