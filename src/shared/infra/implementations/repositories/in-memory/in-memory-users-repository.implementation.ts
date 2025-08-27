import { Injectable } from '@nestjs/common';
import {
  User,
  SerializedUser,
} from 'src/modules/users/domain/entities/user.entity';
import {
  UsersRepository,
  Order,
  SortBy,
} from 'src/modules/users/domain/repositories/users.repository';
import { ListingMetadata } from 'src/shared/types/listing-metadata.type';
import { ListingOutput } from 'src/shared/types/listing-output.type';
import { Sort } from 'src/shared/utils/sort.util';
import { Email } from 'src/shared/value-objects/email.value-object';
import { Id, ValueType } from 'src/shared/value-objects/id.value-object';

@Injectable()
export class InMemoryUsersRepository implements UsersRepository {
  private items: Record<ValueType, User>;
  private readonly take = 100;

  constructor() {
    this.items = {};
  }

  async create(user: User): Promise<User> {
    this.items[user.id.value] = user;
    return user;
  }

  async save(user: User): Promise<User> {
    this.items[user.id.value] = user;
    return user;
  }

  async findById(id: Id): Promise<User | null> {
    return this.items[id.value] || null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = Object.values(this.items).find((item) =>
      item.email.equals(email),
    );
    return user || null;
  }

  async list(metadata?: ListingMetadata<Order, SortBy>): ListingOutput<User> {
    const take = metadata?.take ?? this.take;
    const skip = metadata?.skip ?? 0;
    const allUsers = Object.values(this.items);
    const mappedUsers = allUsers.map((c) => c.toJSON('CAMEL_CASE'));
    const sortedUsers = Sort.execute(
      mappedUsers,
      metadata?.order ?? 'desc',
      metadata?.sortBy ?? 'createdAt',
    );
    const paginatedUsers = sortedUsers.slice(skip, skip + take);
    const users = paginatedUsers.map((c) => User.fromJSON('CAMEL_CASE', c));
    const pages = Math.ceil(allUsers.length / take);
    return { pages, data: users };
  }

  async searchByName(name: string): ListingOutput<User> {
    const allUsers = Object.values(this.items);
    const mappedUsers = allUsers.reduce((acc, c) => {
      if (c.name.value.includes(name)) {
        acc.push(c.toJSON('CAMEL_CASE'));
      }
      return acc;
    }, [] as SerializedUser<'CAMEL_CASE'>[]);
    const sortedUsers = Sort.execute(mappedUsers, 'desc', 'createdAt');
    const paginatedUsers = sortedUsers.slice(0, this.take);
    const users = paginatedUsers.map((c) => User.fromJSON('CAMEL_CASE', c));
    const pages = Math.ceil(allUsers.length / this.take);
    return { pages, data: users };
  }

  async delete(id: Id): Promise<void> {
    delete this.items[id.value];
  }
}
