import { ListingMetadata } from 'src/shared/types/listing-metadata.type';
import { Id } from 'src/shared/value-objects/id.value-object';
import { ListingOutput } from 'src/shared/types/listing-output.type';
import { Props, User } from '../entities/user.entity';
import { Email } from 'src/shared/value-objects/email.value-object';

export type Order = 'asc' | 'desc';
export type SortBy = keyof Props;

export interface UsersRepository {
  create(user: User): Promise<User>;
  save(user: User): Promise<User>;
  findById(id: Id): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  list(metadata?: ListingMetadata<Order, SortBy>): ListingOutput<User>;
  delete(id: Id): Promise<void>;
}
