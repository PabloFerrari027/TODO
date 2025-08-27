import { Injectable } from '@nestjs/common';
import { InMemoryNotificationStrategy } from '../../implementations/strategies/in-memory-notification-strategy.implementation';
import { NotificationStrategy } from '../../ports/strategies/notification.strategy';

@Injectable()
export class MakeNotificationStrategyFactory {
  execute(): NotificationStrategy {
    return new InMemoryNotificationStrategy();
  }
}
