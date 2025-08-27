import { NodeEnv } from 'src/shared/config/env.dto';
import { QueueProvider } from '../../ports/providers/queue.provider';
import { InMemoryQueueProvider } from '../../implementations/providers/in-memory-queue-provider.implementation';
import { BullQueueProvider } from '../../implementations/providers/bull-queue-provider.implementation';
import { Inject, Injectable } from '@nestjs/common';
import { Env } from 'src/shared/config/env';

@Injectable()
export class MakeQueueProviderFactory {
  constructor(
    @Inject('Env')
    private readonly env: Env,
  ) {}

  execute(): QueueProvider {
    if (this.env.variables.NODE_ENV === NodeEnv.TEST) {
      return new InMemoryQueueProvider();
    } else {
      return new BullQueueProvider(this.env);
    }
  }
}
