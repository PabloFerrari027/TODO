import { ListTodosUseCase } from '../use-cases/list-todos.use-case';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  Inject,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { TodoMapper } from '../../infra/mappers/todo.mapper';
import { BasePresenter } from 'src/shared/presenters/base.presenter';
import { FindTodoByIdUseCase } from '../use-cases/find-todo-by-id.use-case';
import { CreateTodoUseCase } from '../use-cases/create-todo.use-case';
import { DeleteTodoUseCase } from '../use-cases/delete-todo.use-case';
import { TodoNotFoundError } from '../../domain/errors/todo-not-found.error';
import { UpdateTodoUseCase } from '../use-cases/update-todo.use-case';
import { ListTodosByCategoryUseCase } from '../use-cases/list-todos-by-category.use-case';
import { SearchTodosByNameUseCase } from '../use-cases/search-todos-by-name.use-case';
import { AuthGuard } from 'src/modules/auth/infra/guards/auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateTodoQueryDto } from '../dtos/controllers/create-todo-query.dto';
import { CreateTodoBodyDto } from '../dtos/controllers/create-todo-body.dto';
import { UpdateTodoQueryDto } from '../dtos/controllers/update-todo-query.dto';
import { UpdateTodoParamsDto } from '../dtos/controllers/update-todo-param.dto';
import { UpdateTodoBodyDto } from '../dtos/controllers/update-todo-body.dto';
import { FindTodoByIdQueryDto } from '../dtos/controllers/find-todo-by-id-query.dto';
import { FindTodoByIdParamsDto } from '../dtos/controllers/find-todo-by-id-param.dto';
import { DeleteTodoParamDto } from '../dtos/controllers/delete-todo-param.dto';
import {
  ListTodosQueryDto,
  SortByEnum as SortByEnumController,
} from '../dtos/controllers/list-todos-query.dto';
import { SortByEnum as SortByEnumUseCase } from '../dtos/use-cases/list-todos.dto';
import { ListTodosByCategoryQueryDto } from '../dtos/controllers/list-todos-by-category-query.dto';
import { ListTodosByCategoryParamsDto } from '../dtos/controllers/list-todos-by-category-param.dto';
import { SearchTodosByNameQueryDto } from '../dtos/controllers/search-todos-by-name-query.dto';
import { CategoryMapper } from 'src/modules/categories/infra/mappers/category.mapper';
import { FieldsEnum } from '../enums/fields.enum';
import { TodoDto } from '../dtos/controllers/todo.dto';
import { TodoListDto } from '../dtos/controllers/todo-list.dto';
import { TodoCategoryListDto } from '../dtos/controllers/todo-category-list.dto';

@Controller('todos')
@Injectable()
@UseGuards(AuthGuard)
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
@ApiBearerAuth()
export class TodosController {
  constructor(
    @Inject('ListTodosUseCase')
    private readonly listTodosUseCase: ListTodosUseCase,
    @Inject('ListTodosByCategoryUseCase')
    private readonly listTodosByCategoryUseCase: ListTodosByCategoryUseCase,
    @Inject('FindTodoByIdUseCase')
    private readonly findTodoByIdUseCase: FindTodoByIdUseCase,
    @Inject('CreateTodoUseCase')
    private readonly createTodoUseCase: CreateTodoUseCase,
    @Inject('UpdateTodoUseCase')
    private readonly updateTodoUseCase: UpdateTodoUseCase,
    @Inject('DeleteTodoUseCase')
    private readonly deleteTodoUseCase: DeleteTodoUseCase,
    @Inject('SearchTodosByNameUseCase')
    private readonly searchTodosByNameUseCase: SearchTodosByNameUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a todo' })
  @ApiOkResponse({
    description: 'Todo created successfully',
    type: TodoDto,
  })
  async create(
    @Query() query: CreateTodoQueryDto,
    @Body() body: CreateTodoBodyDto,
  ) {
    const response = await this.createTodoUseCase.execute({
      categoryId: body.category_id,
      name: body.name,
      notes: body.notes,
    });

    return BasePresenter.execute(
      TodoMapper.toController(response.todo),
      query.fields,
    );
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a todo' })
  @ApiOkResponse({
    description: 'Todo successfully updated',
    type: TodoDto,
  })
  async update(
    @Query() query: UpdateTodoQueryDto,
    @Param() params: UpdateTodoParamsDto,
    @Body() body: UpdateTodoBodyDto,
  ) {
    const response = await this.updateTodoUseCase.execute({
      id: params.id,
      categoryId: body.category_id,
      name: body.name,
      status: body.status,
      notes: body.notes,
    });

    return BasePresenter.execute(
      TodoMapper.toController(response.todo),
      query.fields,
    );
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Find todo by id' })
  @ApiOkResponse({
    description: 'Todo found successfully',
    type: TodoDto,
  })
  async findById(
    @Query() query: FindTodoByIdQueryDto,
    @Param() params: FindTodoByIdParamsDto,
  ) {
    const response = await this.findTodoByIdUseCase.execute({
      id: params.id,
    });

    if (!response.todo) throw new TodoNotFoundError(params.id);

    return BasePresenter.execute(
      TodoMapper.toController(response.todo),
      query.fields,
    );
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'List todos' })
  @ApiOkResponse({
    description: 'Todos successfully listed',
    type: TodoCategoryListDto,
  })
  async list(@Query() query: ListTodosQueryDto) {
    const sortBy: Record<SortByEnumController, SortByEnumUseCase> = {
      id: SortByEnumUseCase.id,
      name: SortByEnumUseCase.name,
      created_at: SortByEnumUseCase.createdAt,
      updated_at: SortByEnumUseCase.updatedAt,
    };

    const response = await this.listTodosUseCase.execute({
      order: query.order,
      sortBy: sortBy[query.sort_by ?? SortByEnumUseCase.createdAt],
      page: query.page,
    });

    const categoryFields = query.fields?.filter(
      (i) =>
        i !== FieldsEnum.category_id &&
        i !== FieldsEnum.notes &&
        i !== FieldsEnum.status,
    );

    const mappedTodos = response.todos.map((item) => ({
      todo: BasePresenter.execute(
        TodoMapper.toController(item.todo),
        query.fields,
      ),
      category: BasePresenter.execute(
        CategoryMapper.toController(item.category),
        categoryFields,
      ),
    }));

    return { pages: response.pages, todos: mappedTodos };
  }

  @Get('/list/by/category/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'List todos by category' })
  @ApiOkResponse({
    description: 'Todos successfully listed',
    type: TodoListDto,
  })
  async listByCategory(
    @Query() query: ListTodosByCategoryQueryDto,
    @Param() params: ListTodosByCategoryParamsDto,
  ) {
    const sortBy: Record<SortByEnumController, SortByEnumUseCase> = {
      id: SortByEnumUseCase.id,
      name: SortByEnumUseCase.name,
      created_at: SortByEnumUseCase.createdAt,
      updated_at: SortByEnumUseCase.updatedAt,
    };

    const response = await this.listTodosByCategoryUseCase.execute({
      categoryId: params.id,
      order: query.order,
      sortBy: sortBy[query.sort_by ?? SortByEnumUseCase.createdAt],
      page: query.page,
    });

    const mappedTodos = response.todos.map((t) =>
      BasePresenter.execute(TodoMapper.toController(t), query.fields),
    );

    return { pages: response.pages, todos: mappedTodos };
  }

  @Get('/search/by/name')
  @HttpCode(200)
  @ApiOperation({ summary: 'Search todos by name' })
  @ApiOkResponse({
    description: 'Todos successfully listed',
    type: TodoListDto,
  })
  async searchByName(@Query() query: SearchTodosByNameQueryDto) {
    const response = await this.searchTodosByNameUseCase.execute({
      name: query.name,
    });

    const mappedTodos = response.todos.map((t) =>
      BasePresenter.execute(TodoMapper.toController(t), query.fields),
    );

    return { pages: response.pages, todos: mappedTodos };
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiOkResponse({ description: 'Todo removed successfully' })
  async remove(@Param() params: DeleteTodoParamDto) {
    await this.deleteTodoUseCase.execute(params);
    return;
  }
}
