import { ListingMetadata } from 'src/shared/types/listing-metadata.type';
import { Category, Props } from '../entities/category.entity';
import { Id } from 'src/shared/value-objects/id.value-object';
import { ListingOutput } from 'src/shared/types/listing-output.type';
import { Name } from 'src/shared/value-objects/name.value-object';

export type Order = 'asc' | 'desc';

export type SortBy = keyof Props;

export interface CategoriesRepository {
  create(category: Category): Promise<Category>;
  save(category: Category): Promise<Category>;
  findById(id: Id): Promise<Category | null>;
  findByName(name: Name): Promise<Category | null>;
  findByIds(ids: Array<Id>): Promise<Array<Category>>;
  list(metadata?: ListingMetadata<Order, SortBy>): ListingOutput<Category>;
  searchByName(name: string): ListingOutput<Category>;
  delete(id: Id): Promise<void>;
}
