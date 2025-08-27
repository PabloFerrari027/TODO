import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient, Todo as PrismaTodo } from '@prisma/client';
import {
  Todo,
  Status,
  Props,
  SnakeCaseJSON,
} from 'src/modules/todos/domain/entities/todo.entity';
import {
  Order,
  SortBy,
  TodosRepository,
} from 'src/modules/todos/domain/repositories/todos.repository';
import { Prisma } from 'src/shared/infra/orm/prisma';
import { ListingMetadata } from 'src/shared/types/listing-metadata.type';
import { ListingOutput } from 'src/shared/types/listing-output.type';
import { Id } from 'src/shared/value-objects/id.value-object';
import { Name } from 'src/shared/value-objects/name.value-object';

@Injectable()
export class PrismaTodosRepository implements TodosRepository {
  private readonly postgreSQl: PrismaClient;
  private readonly defaultTake = 100;
  private readonly defaultSortBy = 'createdAt';
  private readonly defaultOrder = 'desc';
  private readonly sortOptions: Record<keyof Props, keyof SnakeCaseJSON> = {
    id: 'id',
    name: 'name',
    categoryId: 'category_id',
    status: 'status',
    notes: 'notes',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  constructor(
    @Inject('Prisma')
    private readonly prisma: Prisma,
  ) {
    this.postgreSQl = this.prisma.postgreSQl();
  }

  private handleItem(item: PrismaTodo): Todo {
    const todo = Todo.create({
      id: Id.from(item.id),
      name: Name.create(item.name),
      categoryId: Id.from(item.category_id),
      status: item.status as Status,
      notes: item.notes,
      updatedAt: item.updated_at,
      createdAt: item.created_at,
    });

    return todo;
  }

  async create(todo: Todo): Promise<Todo> {
    await this.postgreSQl.todo.create({
      data: {
        id: todo.id.value,
        name: todo.name.value,
        category_id: todo.categoryId.value,
        status: todo.status,
        notes: todo.notes,
        created_at: todo.createdAt,
        updated_at: todo.updatedAt,
      },
    });

    return todo;
  }

  async save(todo: Todo): Promise<Todo> {
    await this.postgreSQl.todo.update({
      where: { id: todo.id.value },
      data: {
        name: todo.name.value,
        category_id: todo.categoryId.value,
        status: todo.status,
        notes: todo.notes,
        created_at: todo.createdAt,
        updated_at: todo.updatedAt,
      },
    });

    return todo;
  }

  async findById(id: Id): Promise<Todo | null> {
    const item = await this.postgreSQl.todo.findUnique({
      where: { id: id.value },
    });

    if (!item) return null;
    else return this.handleItem(item);
  }

  async list(metadata?: ListingMetadata<Order, SortBy>): ListingOutput<Todo> {
    const skip = metadata?.skip ?? 0;
    const take = metadata?.take ?? this.defaultTake;
    const sortBy = this.sortOptions[metadata?.sortBy ?? this.defaultSortBy];
    const order = metadata?.order ?? this.defaultOrder;

    const items = await this.postgreSQl.todo.findMany({
      take,
      skip,
      orderBy: { [sortBy]: order },
    });

    const todos = items.map((item) => this.handleItem(item));

    const total = await this.postgreSQl.todo.count();

    const pages = Math.ceil(total / take);

    return {
      pages,
      data: todos,
    };
  }

  async listByCategoryId(
    categoryId: Id,
    metadata?: ListingMetadata<Order, SortBy>,
  ): ListingOutput<Todo> {
    const skip = metadata?.skip ?? 0;
    const take = metadata?.take ?? this.defaultTake;
    const sortBy = this.sortOptions[metadata?.sortBy ?? this.defaultSortBy];
    const order = metadata?.order ?? this.defaultOrder;

    const items = await this.postgreSQl.todo.findMany({
      take,
      skip,
      where: { category_id: categoryId.value },
      orderBy: { [sortBy]: order },
    });

    const todos = items.map((item) => this.handleItem(item));

    const total = await this.postgreSQl.todo.count({
      where: { category_id: categoryId.value },
    });

    const pages = Math.ceil(total / take);

    return {
      pages,
      data: todos,
    };
  }

  async searchByName(name: string): ListingOutput<Todo> {
    const take = this.defaultTake;
    const sortBy = this.sortOptions[this.defaultSortBy];
    const order = this.defaultOrder;

    const items = await this.postgreSQl.todo.findMany({
      take,
      orderBy: { [sortBy]: order },
      where: { name: { contains: name, mode: 'insensitive' } },
    });

    const todos = items.map((item) => this.handleItem(item));

    const total = await this.postgreSQl.todo.count({
      where: { name: { contains: name, mode: 'insensitive' } },
    });

    const pages = Math.ceil(total / take);

    return {
      pages,
      data: todos,
    };
  }

  async delete(id: Id): Promise<void> {
    await this.postgreSQl.todo.delete({
      where: { id: id.value },
    });
  }
}
