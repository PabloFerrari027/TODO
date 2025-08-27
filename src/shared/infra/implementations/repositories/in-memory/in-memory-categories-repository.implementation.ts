import { Injectable } from '@nestjs/common';
import {
  Category,
  SerializedCategory,
} from 'src/modules/categories/domain/entities/category.entity';
import {
  CategoriesRepository,
  Order,
  SortBy,
} from 'src/modules/categories/domain/repositories/categories.repository';
import { ListingMetadata } from 'src/shared/types/listing-metadata.type';
import { ListingOutput } from 'src/shared/types/listing-output.type';
import { Sort } from 'src/shared/utils/sort.util';
import { Id, ValueType } from 'src/shared/value-objects/id.value-object';
import { Name } from 'src/shared/value-objects/name.value-object';

@Injectable()
export class InMemoryCategoriesRepository implements CategoriesRepository {
  private items: Record<ValueType, Category>;
  private readonly take = 100;

  constructor() {
    this.items = {};
  }

  async create(category: Category): Promise<Category> {
    this.items[category.id.value] = category;
    return category;
  }

  async save(category: Category): Promise<Category> {
    this.items[category.id.value] = category;
    return category;
  }

  async findById(id: Id): Promise<Category | null> {
    return this.items[id.value] || null;
  }

  async findByName(name: Name): Promise<Category | null> {
    const category = Object.values(this.items).find((item) =>
      item.name.equals(name),
    );
    return category || null;
  }

  async findByIds(ids: Array<Id>): Promise<Array<Category>> {
    return ids.map((id) => this.items[id.value]).filter(Boolean);
  }

  async list(
    metadata?: ListingMetadata<Order, SortBy>,
  ): ListingOutput<Category> {
    const take = metadata?.take ?? this.take;
    const skip = metadata?.skip ?? 0;
    const allCategories = Object.values(this.items);
    const mappedCategories = allCategories.map((c) => c.toJSON('CAMEL_CASE'));
    const sortedCategories = Sort.execute(
      mappedCategories,
      metadata?.order ?? 'desc',
      metadata?.sortBy ?? 'createdAt',
    );
    const paginatedCategories = sortedCategories.slice(skip, skip + take);
    const categories = paginatedCategories.map((c) =>
      Category.fromJSON('CAMEL_CASE', c),
    );
    const pages = Math.ceil(allCategories.length / take);
    return { pages, data: categories };
  }

  async searchByName(name: string): ListingOutput<Category> {
    const allCategories = Object.values(this.items);
    const mappedCategories = allCategories.reduce((acc, c) => {
      if (c.name.value.includes(name)) {
        acc.push(c.toJSON('CAMEL_CASE'));
      }
      return acc;
    }, [] as SerializedCategory<'CAMEL_CASE'>[]);
    const sortedCategories = Sort.execute(
      mappedCategories,
      'desc',
      'createdAt',
    );
    const paginatedCategories = sortedCategories.slice(0, this.take);
    const categories = paginatedCategories.map((c) =>
      Category.fromJSON('CAMEL_CASE', c),
    );
    const pages = Math.ceil(allCategories.length / this.take);
    return { pages, data: categories };
  }

  async delete(id: Id): Promise<void> {
    delete this.items[id.value];
  }
}
