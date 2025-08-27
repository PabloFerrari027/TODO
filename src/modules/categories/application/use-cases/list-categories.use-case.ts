import { Inject, Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import type { CategoriesRepository } from '../../domain/repositories/categories.repository';
import { ListCategoriesDto } from '../dtos/use-cases/list-categories.dto';

type Output = Promise<{
  categories: Array<Category>;
  pages: number;
}>;

@Injectable()
export class ListCategoriesUseCase {
  private readonly take = 100;

  constructor(
    @Inject('CategoriesRepository')
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async execute(input: ListCategoriesDto): Output {
    const page = input.page ?? 1;
    const skip = (page - 1) * this.take;

    const { data, pages } = await this.categoriesRepository.list({
      order: input.order,
      skip,
      sortBy: input.sortBy,
      take: this.take,
    });

    return { categories: data, pages };
  }
}
