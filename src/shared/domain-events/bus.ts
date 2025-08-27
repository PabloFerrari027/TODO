import { Event } from 'src/shared/domain-events/event';
import { Handler } from 'src/shared/handlers/handler';

export class Bus {
  private static handlers = new Map<string, Handler[]>();

  static register(eventName: string, handler: Handler) {
    const existing = this.handlers.get(eventName) ?? [];
    existing.push(handler);
    this.handlers.set(eventName, existing);
  }

  static async dispatch(events: Event[]) {
    for (const event of events) {
      const handlers = this.handlers.get(event.constructor.name) ?? [];
      await Promise.all(
        handlers.map(async (handler) => await handler.execute(event)),
      );
    }
  }

  static clearHandlers(): void {
    Bus.handlers.clear();
  }
}
