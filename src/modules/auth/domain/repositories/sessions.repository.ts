import { Session } from '../entities/session.entity';
import { Id } from 'src/shared/value-objects/id.value-object';

export interface SessionsRepository {
  create(session: Session): Promise<Session>;
  save(session: Session): Promise<Session>;
  findById(id: Id): Promise<Session | null>;
  delete(id: Id): Promise<void>;
}
