import { ListCategoriesUseCase } from '../use-cases/list-categories.use-case';
import {
  Controller,
  Query,
  Inject,
  Injectable,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { FindCategoryByIdUseCase } from '../use-cases/find-category-by-id.use-case';
import { UpdateCategoryUseCase } from '../use-cases/update-category.use-case';
import { CreateCategoryUseCase } from '../use-cases/create-category.use-case';
import { DeleteCategoryUseCase } from '../use-cases/delete-category.use-case';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ListCategoriesQueryDto } from '../dtos/controllers/list-categories-query.dto';
import { BasePresenter } from 'src/shared/presenters/base.presenter';
import { CategoryMapper } from '../../infra/mappers/category.mapper';
import { CreateCategoryQueryDto } from '../dtos/controllers/create-category-query.dto';
import { CreateCategoryBodyDto } from '../dtos/controllers/create-category-body.dto';
import { UpdateCategoryQueryDto } from '../dtos/controllers/update-category-query.dto';
import { FindCategoryByIdQueryDto } from '../dtos/controllers/find-category-by-id-query.dto';
import { UpdateCategoryParamDto } from '../dtos/controllers/update-category-param.dto';
import { UpdateCategoryBodyDto } from '../dtos/controllers/update-category-body.dto';
import { FindCategoryByIdParamDto } from '../dtos/controllers/find-category-by-id-param.dto';
import { CategoryNotFoundError } from '../../domain/errors/category-not-found.error';
import { DeleteCategoryParamDto } from '../dtos/controllers/delete-category-param.dto';
import { AuthGuard } from 'src/modules/auth/infra/guards/auth.guard';
import { SortByEnum as SortByEnumController } from '../dtos/controllers/list-categories-query.dto';
import { SortByEnum as SortByEnumUseCase } from '../dtos/use-cases/list-categories.dto';
import { SearchCategoriesByNameUseCase } from '../use-cases/search-categories-by-name.use-case';
import { SearchCategoriesByNameQueryDto } from '../dtos/controllers/search-categories-by-name-query.dto copy';
import { CategoryDto } from '../dtos/controllers/category.dto';
import { CategoryListDto } from '../dtos/controllers/category-list.dto';

@Controller('categories')
@Injectable()
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: `
  The request was not authorized. This can occur if:
  
  - The **access token** is missing, invalid, or expired.
  - The user does not have permission to access the requested resource.
  Ensure that a valid access token is provided in the \`Authorization: Bearer <token>\` header.
  `,
})
@ApiBadRequestResponse({
  description: 'The request could not be processed due to invalid input.',
  schema: {
    type: 'object',
    properties: {
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
      },
    },
  },
})
@ApiInternalServerErrorResponse({
  description: 'An internal server error occurred.',
  schema: {
    type: 'object',
    properties: {
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
      },
    },
  },
})
@ApiNotFoundResponse({
  description: 'Some requested resource was not found',
  schema: {
    type: 'object',
    properties: {
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
      },
    },
  },
})
export class CategoriesController {
  constructor(
    @Inject('ListCategoriesUseCase')
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
    @Inject('FindCategoryByIdUseCase')
    private readonly findCategoryByIdUseCase: FindCategoryByIdUseCase,
    @Inject('CreateCategoryUseCase')
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    @Inject('UpdateCategoryUseCase')
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    @Inject('DeleteCategoryUseCase')
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    @Inject('SearchCategoriesByNameUseCase')
    private readonly searchCategoriesByNameUseCase: SearchCategoriesByNameUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a category' })
  @ApiOkResponse({
    description: 'Category created successfully',
    type: CategoryDto,
  })
  async create(
    @Query() query: CreateCategoryQueryDto,
    @Body() body: CreateCategoryBodyDto,
  ) {
    const response = await this.createCategoryUseCase.execute({
      name: body.name,
    });

    return BasePresenter.execute(
      CategoryMapper.toController(response.category),
      query.fields,
    );
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a category' })
  @ApiOkResponse({
    description: 'Category successfully updated',
    type: CategoryDto,
  })
  async update(
    @Query() query: UpdateCategoryQueryDto,
    @Param() params: UpdateCategoryParamDto,
    @Body() body: UpdateCategoryBodyDto,
  ) {
    const response = await this.updateCategoryUseCase.execute({
      id: params.id,
      name: body.name,
    });

    return BasePresenter.execute(
      CategoryMapper.toController(response.category),
      query.fields,
    );
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Find a category by ID' })
  @ApiOkResponse({
    description: 'Category found successfully',
    type: CategoryDto,
  })
  async findById(
    @Query() query: FindCategoryByIdQueryDto,
    @Param() params: FindCategoryByIdParamDto,
  ) {
    const response = await this.findCategoryByIdUseCase.execute({
      id: params.id,
    });

    if (!response.category) throw new CategoryNotFoundError(params.id);

    return BasePresenter.execute(
      CategoryMapper.toController(response.category),
      query.fields,
    );
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'List categories' })
  @ApiOkResponse({
    description: 'Categories successfully listed',
    type: CategoryListDto,
  })
  async list(@Query() query: ListCategoriesQueryDto) {
    const sortBy: Record<SortByEnumController, SortByEnumUseCase> = {
      id: SortByEnumUseCase.id,
      name: SortByEnumUseCase.name,
      created_at: SortByEnumUseCase.createdAt,
      updated_at: SortByEnumUseCase.updatedAt,
    };

    const response = await this.listCategoriesUseCase.execute({
      order: query.order,
      sortBy: sortBy[query.sort_by ?? SortByEnumUseCase.createdAt],
      page: query.page,
    });

    const mappedCategories = response.categories.map((c) =>
      BasePresenter.execute(CategoryMapper.toController(c), query.fields),
    );
    return { pages: response.pages, categories: mappedCategories };
  }

  @Get('/search/by/name')
  @HttpCode(200)
  @ApiOperation({ summary: 'List categories by name' })
  @ApiOkResponse({
    description: 'Categories successfully listed',
    type: CategoryListDto,
  })
  async searchByName(@Query() query: SearchCategoriesByNameQueryDto) {
    const response = await this.searchCategoriesByNameUseCase.execute({
      name: query.name,
    });

    const mappedCategories = response.categories.map((c) =>
      BasePresenter.execute(CategoryMapper.toController(c), query.fields),
    );

    return { pages: response.pages, categories: mappedCategories };
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a category' })
  @ApiOkResponse({
    description: 'Category removed successfully',
    type: CategoryDto,
  })
  async remove(@Param() params: DeleteCategoryParamDto) {
    await this.deleteCategoryUseCase.execute(params);
  }
}
