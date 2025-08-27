import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient, User as PrismaUser } from '@prisma/client';
import {
  Props,
  SnakeCaseJSON,
  User,
} from 'src/modules/users/domain/entities/user.entity';
import {
  Order,
  SortBy,
  UsersRepository,
} from 'src/modules/users/domain/repositories/users.repository';
import { Prisma } from 'src/shared/infra/orm/prisma';
import { ListingMetadata } from 'src/shared/types/listing-metadata.type';
import { ListingOutput } from 'src/shared/types/listing-output.type';
import { Email } from 'src/shared/value-objects/email.value-object';
import { Id } from 'src/shared/value-objects/id.value-object';
import { Name } from 'src/shared/value-objects/name.value-object';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  private readonly postgreSQl: PrismaClient;
  private readonly defaultTake = 100;
  private readonly defaultSortBy = 'createdAt';
  private readonly defaultOrder = 'desc';
  private readonly sortOptions: Record<keyof Props, keyof SnakeCaseJSON> = {
    id: 'id',
    name: 'name',
    email: 'email',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  constructor(
    @Inject('Prisma')
    private readonly prisma: Prisma,
  ) {
    this.postgreSQl = this.prisma.postgreSQl();
  }

  private handleItem(item: PrismaUser): User {
    const user = User.create({
      id: Id.from(item.id),
      name: Name.create(item.name),
      email: Email.create(item.email),
      updatedAt: item.updated_at,
      createdAt: item.created_at,
    });

    return user;
  }

  async create(user: User): Promise<User> {
    await this.postgreSQl.user.create({
      data: {
        id: user.id.value,
        name: user.name.value,
        email: user.email.value,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      },
    });

    return user;
  }

  async save(user: User): Promise<User> {
    await this.postgreSQl.user.update({
      where: { id: user.id.value },
      data: {
        name: user.name.value,
        email: user.email.value,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      },
    });

    return user;
  }

  async findById(id: Id): Promise<User | null> {
    const item = await this.postgreSQl.user.findUnique({
      where: { id: id.value },
    });

    if (!item) return null;
    else return this.handleItem(item);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const item = await this.postgreSQl.user.findFirst({
      where: { email: email.value },
    });

    if (!item) return null;
    else return this.handleItem(item);
  }

  async list(metadata?: ListingMetadata<Order, SortBy>): ListingOutput<User> {
    const skip = metadata?.skip ?? 0;
    const take = metadata?.take ?? this.defaultTake;
    const sortBy = this.sortOptions[metadata?.sortBy ?? this.defaultSortBy];
    const order = metadata?.order ?? this.defaultOrder;

    const items = await this.postgreSQl.user.findMany({
      take,
      skip,
      orderBy: { [sortBy]: order },
    });

    const users = items.map((item) => this.handleItem(item));

    const total = await this.postgreSQl.user.count();

    const pages = Math.ceil(total / take);

    return {
      pages,
      data: users,
    };
  }

  async delete(id: Id): Promise<void> {
    await this.postgreSQl.user.delete({
      where: { id: id.value },
    });
  }
}
