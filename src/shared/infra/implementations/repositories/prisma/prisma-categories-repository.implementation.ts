import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient, Category as PrismaCategory } from '@prisma/client';
import {
  Category,
  Props,
  SnakeCaseJSON,
} from 'src/modules/categories/domain/entities/category.entity';
import {
  CategoriesRepository,
  Order,
  SortBy,
} from 'src/modules/categories/domain/repositories/categories.repository';
import { Prisma } from 'src/shared/infra/orm/prisma';
import { ListingMetadata } from 'src/shared/types/listing-metadata.type';
import { ListingOutput } from 'src/shared/types/listing-output.type';
import { Id } from 'src/shared/value-objects/id.value-object';
import { Name } from 'src/shared/value-objects/name.value-object';

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
  private readonly postgreSQl: PrismaClient;
  private readonly defaultTake = 100;
  private readonly defaultSortBy = 'createdAt';
  private readonly defaultOrder = 'desc';
  private readonly sortOptions: Record<keyof Props, keyof SnakeCaseJSON> = {
    id: 'id',
    name: 'name',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  constructor(
    @Inject('Prisma')
    private readonly prisma: Prisma,
  ) {
    this.postgreSQl = this.prisma.postgreSQl();
  }

  private handleItem(item: PrismaCategory): Category {
    const category = Category.create({
      id: Id.from(item.id),
      name: Name.create(item.name),
      updatedAt: item.updated_at,
      createdAt: item.created_at,
    });

    return category;
  }

  async create(category: Category): Promise<Category> {
    await this.postgreSQl.category.create({
      data: {
        id: category.id.value,
        name: category.name.value,
        created_at: category.createdAt,
        updated_at: category.updatedAt,
      },
    });

    return category;
  }

  async save(category: Category): Promise<Category> {
    await this.postgreSQl.category.update({
      where: { id: category.id.value },
      data: {
        name: category.name.value,
        created_at: category.createdAt,
        updated_at: category.updatedAt,
      },
    });

    return category;
  }

  async findById(id: Id): Promise<Category | null> {
    const item = await this.postgreSQl.category.findUnique({
      where: { id: id.value },
    });

    if (!item) return null;
    else return this.handleItem(item);
  }

  async findByName(name: Name): Promise<Category | null> {
    const item = await this.postgreSQl.category.findFirst({
      where: { name: name.value, AND: { name: { mode: 'insensitive' } } },
    });

    if (!item) return null;
    else return this.handleItem(item);
  }

  async findByIds(ids: Array<Id>): Promise<Array<Category>> {
    const items = await this.postgreSQl.category.findMany({
      where: { id: { in: ids.map((id) => id.value) } },
    });

    const categories = items.map((item) => this.handleItem(item));

    return categories;
  }

  async list(
    metadata?: ListingMetadata<Order, SortBy>,
  ): ListingOutput<Category> {
    const skip = metadata?.skip ?? 0;
    const take = metadata?.take ?? this.defaultTake;
    const sortBy = this.sortOptions[metadata?.sortBy ?? this.defaultSortBy];
    const order = metadata?.order ?? this.defaultOrder;

    const items = await this.postgreSQl.category.findMany({
      take,
      skip,
      orderBy: { [sortBy]: order },
    });

    const categories = items.map((item) => this.handleItem(item));

    const total = await this.postgreSQl.category.count();

    const pages = Math.ceil(total / take);

    return {
      pages,
      data: categories,
    };
  }

  async searchByName(
    name: string,
    metadata?: ListingMetadata<Order, SortBy>,
  ): ListingOutput<Category> {
    const take = metadata?.take ?? this.defaultTake;
    const sortBy = this.sortOptions[metadata?.sortBy ?? this.defaultSortBy];
    const order = metadata?.order ?? this.defaultOrder;

    const items = await this.postgreSQl.category.findMany({
      take,
      orderBy: { [sortBy]: order },
      where: { name: { contains: name, mode: 'insensitive' } },
    });

    const categories = items.map((item) => this.handleItem(item));

    const total = await this.postgreSQl.category.count({
      where: { name: { contains: name, mode: 'insensitive' } },
    });

    const pages = Math.ceil(total / this.defaultTake);

    return {
      pages,
      data: categories,
    };
  }

  async delete(id: Id): Promise<void> {
    await this.postgreSQl.category.delete({
      where: { id: id.value },
    });
  }
}
