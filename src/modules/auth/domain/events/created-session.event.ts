import { Event } from 'src/shared/domain-events/event';
import { Id } from 'src/shared/value-objects/id.value-object';

export class CreatedSessionEvent extends Event {
  public occurredOn: Date;

  constructor(public readonly sessionId: Id) {
    super();
    this.occurredOn = new Date();
  }
}
