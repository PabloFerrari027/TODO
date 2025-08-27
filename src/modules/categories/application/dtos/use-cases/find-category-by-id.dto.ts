import { IsUUID } from 'class-validator';

export class FindCategoryByIdDto {
  @IsUUID()
  id: string;
}
