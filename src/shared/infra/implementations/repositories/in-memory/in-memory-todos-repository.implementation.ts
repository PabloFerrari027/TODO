import { Injectable } from '@nestjs/common';
import {
  Todo,
  SerializedTodo,
} from 'src/modules/todos/domain/entities/todo.entity';
import {
  TodosRepository,
  Order,
  SortBy,
} from 'src/modules/todos/domain/repositories/todos.repository';
import { ListingMetadata } from 'src/shared/types/listing-metadata.type';
import { ListingOutput } from 'src/shared/types/listing-output.type';
import { Sort } from 'src/shared/utils/sort.util';
import { Id, ValueType } from 'src/shared/value-objects/id.value-object';
import { Name } from 'src/shared/value-objects/name.value-object';

@Injectable()
export class InMemoryTodosRepository implements TodosRepository {
  private items: Record<ValueType, Todo>;
  private readonly take = 100;

  constructor() {
    this.items = {};
  }

  async create(todo: Todo): Promise<Todo> {
    this.items[todo.id.value] = todo;
    return todo;
  }

  async save(todo: Todo): Promise<Todo> {
    this.items[todo.id.value] = todo;
    return todo;
  }

  async findById(id: Id): Promise<Todo | null> {
    return this.items[id.value] || null;
  }

  async findByName(name: Name): Promise<Todo | null> {
    const todo = Object.values(this.items).find((item) =>
      item.name.equals(name),
    );
    return todo || null;
  }

  async list(metadata?: ListingMetadata<Order, SortBy>): ListingOutput<Todo> {
    const take = metadata?.take ?? this.take;
    const skip = metadata?.skip ?? 0;
    const allTodos = Object.values(this.items);
    const mappedTodos = allTodos.map((c) => c.toJSON('CAMEL_CASE'));
    const sortedTodos = Sort.execute(
      mappedTodos,
      metadata?.order ?? 'desc',
      metadata?.sortBy ?? 'createdAt',
    );
    const paginatedTodos = sortedTodos.slice(skip, skip + take);
    const todos = paginatedTodos.map((c) => Todo.fromJSON('CAMEL_CASE', c));
    const pages = Math.ceil(allTodos.length / take);
    return { pages, data: todos };
  }

  async listByCategoryId(
    categoryId: Id,
    metadata?: ListingMetadata<Order, SortBy>,
  ): ListingOutput<Todo> {
    const take = metadata?.take ?? this.take;
    const skip = metadata?.skip ?? 0;
    const allTodos = Object.values(this.items);
    const mappedTodos = allTodos.reduce((acc, c) => {
      if (c.categoryId.equals(categoryId)) {
        acc.push(c.toJSON('CAMEL_CASE'));
      }
      return acc;
    }, [] as SerializedTodo<'CAMEL_CASE'>[]);
    const sortedTodos = Sort.execute(
      mappedTodos,
      metadata?.order ?? 'desc',
      metadata?.sortBy ?? 'createdAt',
    );
    const paginatedTodos = sortedTodos.slice(skip, skip + take);
    const todos = paginatedTodos.map((c) => Todo.fromJSON('CAMEL_CASE', c));
    const pages = Math.ceil(allTodos.length / take);
    return { pages, data: todos };
  }

  async searchByName(name: string): ListingOutput<Todo> {
    const allTodos = Object.values(this.items);
    const mappedTodos = allTodos.reduce((acc, c) => {
      if (c.name.value.includes(name)) {
        acc.push(c.toJSON('CAMEL_CASE'));
      }
      return acc;
    }, [] as SerializedTodo<'CAMEL_CASE'>[]);
    const sortedTodos = Sort.execute(mappedTodos, 'desc', 'createdAt');
    const paginatedTodos = sortedTodos.slice(0, this.take);
    const todos = paginatedTodos.map((c) => Todo.fromJSON('CAMEL_CASE', c));
    const pages = Math.ceil(allTodos.length / this.take);
    return { pages, data: todos };
  }

  async delete(id: Id): Promise<void> {
    delete this.items[id.value];
  }
}
