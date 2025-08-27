import { ListingMetadata } from 'src/shared/types/listing-metadata.type';
import { Todo, Props } from '../entities/todo.entity';
import { Id } from 'src/shared/value-objects/id.value-object';
import { ListingOutput } from 'src/shared/types/listing-output.type';

export type Order = 'asc' | 'desc';
export type SortBy = keyof Props;

export interface TodosRepository {
  create(todo: Todo): Promise<Todo>;
  save(todo: Todo): Promise<Todo>;
  findById(id: Id): Promise<Todo | null>;
  list(metadata?: ListingMetadata<Order, SortBy>): ListingOutput<Todo>;
  listByCategoryId(
    categoryId: Id,
    metadata?: ListingMetadata<Order, SortBy>,
  ): ListingOutput<Todo>;
  searchByName(name: string): ListingOutput<Todo>;
  delete(id: Id): Promise<void>;
}
