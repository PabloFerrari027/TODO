import { IsString, MinLength } from 'class-validator';

export class SearchCategoriesByNameDto {
  @IsString()
  @MinLength(1)
  name: string;
}
