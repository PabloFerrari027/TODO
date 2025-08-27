import { Inject, Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import type { CategoriesRepository } from '../../domain/repositories/categories.repository';
import { SearchCategoriesByNameDto } from '../dtos/use-cases/search-categories-by-name.dto';

type Output = Promise<{
  categories: Array<Category>;
  pages: number;
}>;

@Injectable()
export class SearchCategoriesByNameUseCase {
  constructor(
    @Inject('CategoriesRepository')
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async execute(input: SearchCategoriesByNameDto): Output {
    const { data, pages } = await this.categoriesRepository.searchByName(
      input.name,
    );

    return { categories: data, pages };
  }
}
