import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient, Session as PrismaSession } from '@prisma/client';
import { Session } from 'src/modules/auth/domain/entities/session.entity';
import { SessionsRepository } from 'src/modules/auth/domain/repositories/sessions.repository';
import { Prisma } from 'src/shared/infra/orm/prisma';
import { Id } from 'src/shared/value-objects/id.value-object';

@Injectable()
export class PrismaSessionsRepository implements SessionsRepository {
  private readonly postgreSQl: PrismaClient;

  constructor(
    @Inject('Prisma')
    private readonly prisma: Prisma,
  ) {
    this.postgreSQl = this.prisma.postgreSQl();
  }

  private handleItem(item: PrismaSession): Session {
    const session = Session.create({
      id: Id.from(item.id),
      userId: Id.from(item.user_id),
      closedAt: item.closed_at ?? undefined,
      validatedAt: item.validated_at ?? undefined,
      updatedAt: item.updated_at,
      createdAt: item.created_at,
    });

    return session;
  }

  async create(session: Session): Promise<Session> {
    await this.postgreSQl.session.create({
      data: {
        id: session.id.value,
        user_id: session.userId.value,
        closed_at: session.closedAt,
        validated_at: session.validatedAt,
        created_at: session.createdAt,
        updated_at: session.updatedAt,
      },
    });

    return session;
  }

  async save(session: Session): Promise<Session> {
    await this.postgreSQl.session.update({
      where: { id: session.id.value },
      data: {
        user_id: session.userId.value,
        closed_at: session.closedAt,
        validated_at: session.validatedAt,
        created_at: session.createdAt,
        updated_at: session.updatedAt,
      },
    });

    return session;
  }

  async findById(id: Id): Promise<Session | null> {
    const item = await this.postgreSQl.session.findUnique({
      where: { id: id.value },
    });

    if (!item) return null;
    else return this.handleItem(item);
  }

  async delete(id: Id): Promise<void> {
    await this.postgreSQl.session.delete({
      where: { id: id.value },
    });
  }
}
