import { Inject, Injectable } from '@nestjs/common';
import { QueueProvider, Queue } from '../../ports/providers/queue.provider';
import { Handler } from 'src/shared/handlers/handler';
import Bull from 'bull';
import { Env } from 'src/shared/config/env';

@Injectable()
class CustomBullQueue extends Queue {
  private queue: Bull.Queue;
  private handlers: Handler[];
  private _key: string;
  private processingRegistered: boolean;

  constructor(
    @Inject('Env')
    private readonly env: Env,
    key: string,
  ) {
    super();
    this._key = key;
    this.handlers = [];
    this.processingRegistered = false;
    this.queue = new Bull(key, this.env.variables.REDIS_URL, {
      defaultJobOptions: { removeOnComplete: true, removeOnFail: false },
    });
  }

  get key(): string {
    return this._key;
  }

  async publish(data: any): Promise<void> {
    await this.queue.add(data);
  }

  subscribe(handler: Handler): void {
    this.handlers.push(handler);
  }

  async process(): Promise<void> {
    if (this.processingRegistered) return;
    this.processingRegistered = true;

    await this.queue.process(1, async ({ data }, done) => {
      try {
        for (const handler of this.handlers) {
          await handler.execute(data);
        }
        done();
      } catch (error) {
        done(error as Error);
      }
    });
  }
}

@Injectable()
export class BullQueueProvider implements QueueProvider {
  private queues: Record<string, Queue>;

  constructor(
    @Inject('Env')
    private readonly env: Env,
  ) {
    this.queues = {};
  }

  async create(key: string): Promise<Queue> {
    if (this.queues[key]) return this.queues[key];
    const queue = new CustomBullQueue(this.env, key);
    this.queues[key] = queue;
    return queue;
  }

  async get(key: string): Promise<Queue | null> {
    return this.queues[key] ?? null;
  }
}
