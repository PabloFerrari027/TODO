import { Module } from '@nestjs/common';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { DeleteCategoryUseCase } from './application/use-cases/delete-category.use-case';
import { FindCategoryByIdUseCase } from './application/use-cases/find-category-by-id.use-case';
import { ListCategoriesUseCase } from './application/use-cases/list-categories.use-case';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case';
import { CategoriesController } from './application/controllers/categories.controller';
import { SearchCategoriesByNameUseCase } from './application/use-cases/search-categories-by-name.use-case';

@Module({
  controllers: [CategoriesController],
  providers: [
    {
      provide: 'CreateCategoryUseCase',
      useClass: CreateCategoryUseCase,
    },
    {
      provide: 'DeleteCategoryUseCase',
      useClass: DeleteCategoryUseCase,
    },
    {
      provide: 'FindCategoryByIdUseCase',
      useClass: FindCategoryByIdUseCase,
    },
    {
      provide: 'ListCategoriesUseCase',
      useClass: ListCategoriesUseCase,
    },
    {
      provide: 'SearchCategoriesByNameUseCase',
      useClass: SearchCategoriesByNameUseCase,
    },
    {
      provide: 'UpdateCategoryUseCase',
      useClass: UpdateCategoryUseCase,
    },
  ],
})
export class CategoriesModule {}
