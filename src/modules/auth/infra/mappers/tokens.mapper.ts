import { Injectable } from '@nestjs/common';
import { Id, ValueType } from 'src/shared/value-objects/id.value-object';

@Injectable()
export class SessionMapper {
  static toController(sessionId: Id): { session_id: ValueType } {
    return { session_id: sessionId.value };
  }
}
