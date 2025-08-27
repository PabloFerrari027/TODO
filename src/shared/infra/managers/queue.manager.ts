import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SendCodeValidationHandler } from 'src/modules/auth/application/handlers/queues/send-code-validation.handler';
import type { QueueProvider } from 'src/shared/infra/ports/providers/queue.provider';
import { QueueKeys } from 'src/shared/utils/queue.keys.util';

@Injectable()
export class QueueManager implements OnApplicationBootstrap {
  constructor(
    @Inject('QueueProvider')
    private readonly queueProvider: QueueProvider,
    @Inject('SendCodeValidationHandler')
    private readonly sendCodeValidationHandler: SendCodeValidationHandler,
  ) {}

  async onApplicationBootstrap() {
    this.execute();
  }

  public async execute() {
    const [sendCodeValidationQueue] = await Promise.all([
      this.queueProvider.create(QueueKeys.sendCodeValidation()),
    ]);

    sendCodeValidationQueue.subscribe(this.sendCodeValidationHandler);
    await Promise.all([sendCodeValidationQueue.process()]);
  }
}
