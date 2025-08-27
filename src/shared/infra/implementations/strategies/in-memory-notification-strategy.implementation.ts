import { Injectable } from '@nestjs/common';
import { NotificationStrategy } from './../../ports/strategies/notification.strategy';

@Injectable()
export class InMemoryNotificationStrategy implements NotificationStrategy {
  async send(to: string, head: string, body: string): Promise<void> {
    console.log({ to, head, body });
  }
}
