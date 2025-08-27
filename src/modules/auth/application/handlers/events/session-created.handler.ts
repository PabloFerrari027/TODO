import type {
  Queue,
  QueueProvider,
} from 'src/shared/infra/ports/providers/queue.provider';
import { Inject, Injectable } from '@nestjs/common';
import { QueueKeys } from 'src/shared/utils/queue.keys.util';
import { Handler } from 'src/shared/handlers/handler';
import { CreatedSessionEvent } from '../../../domain/events/created-session.event';

@Injectable()
export class SessionCreatedHandler extends Handler {
  private queue: Queue | null;

  constructor(
    @Inject('QueueProvider')
    private readonly queueProvider: QueueProvider,
  ) {
    super();
    this.queue = null;
  }

  async execute(event: CreatedSessionEvent) {
    this.queue = await this.queueProvider.get(QueueKeys.sendCodeValidation());

    if (!this.queue) {
      this.queue = await this.queueProvider.create(
        QueueKeys.sendCodeValidation(),
      );
    }

    await this.queue.publish({
      sessionId: event.sessionId.value,
    });
  }
}
