import { Module } from '@nestjs/common';
import { CreateTodoUseCase } from './application/use-cases/create-todo.use-case';
import { DeleteTodoUseCase } from './application/use-cases/delete-todo.use-case';
import { FindTodoByIdUseCase } from './application/use-cases/find-todo-by-id.use-case';
import { ListTodosByCategoryUseCase } from './application/use-cases/list-todos-by-category.use-case';
import { ListTodosUseCase } from './application/use-cases/list-todos.use-case';
import { TodosController } from './application/controllers/todos.controller';
import { UpdateTodoUseCase } from './application/use-cases/update-todo.use-case';
import { SearchTodosByNameUseCase } from './application/use-cases/search-todos-by-name.use-case';

@Module({
  controllers: [TodosController],
  providers: [
    {
      provide: 'CreateTodoUseCase',
      useClass: CreateTodoUseCase,
    },
    {
      provide: 'DeleteTodoUseCase',
      useClass: DeleteTodoUseCase,
    },
    {
      provide: 'FindTodoByIdUseCase',
      useClass: FindTodoByIdUseCase,
    },
    {
      provide: 'ListTodosByCategoryUseCase',
      useClass: ListTodosByCategoryUseCase,
    },
    {
      provide: 'ListTodosUseCase',
      useClass: ListTodosUseCase,
    },
    {
      provide: 'SearchTodosByNameUseCase',
      useClass: SearchTodosByNameUseCase,
    },
    {
      provide: 'UpdateTodoUseCase',
      useClass: UpdateTodoUseCase,
    },
  ],
})
export class TodosModule {}
