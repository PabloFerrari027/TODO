import { Injectable } from '@nestjs/common';
import { Session } from 'src/modules/auth/domain/entities/session.entity';
import { SessionsRepository } from 'src/modules/auth/domain/repositories/sessions.repository';
import { Id, ValueType } from 'src/shared/value-objects/id.value-object';

@Injectable()
export class InMemorySessionsRepository implements SessionsRepository {
  private items: Record<ValueType, Session>;
  private readonly take = 100;

  constructor() {
    this.items = {};
  }

  async create(session: Session): Promise<Session> {
    this.items[session.id.value] = session;
    return session;
  }

  async save(session: Session): Promise<Session> {
    this.items[session.id.value] = session;
    return session;
  }

  async findById(id: Id): Promise<Session | null> {
    return this.items[id.value] || null;
  }

  async delete(id: Id): Promise<void> {
    delete this.items[id.value];
  }
}
