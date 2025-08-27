import { Handler } from 'src/shared/handlers/handler';

export abstract class Queue {
  abstract get key(): string;
  abstract subscribe(handler: Handler): void;
  abstract publish(data: any): Promise<void>;
  abstract process(): Promise<void>;
}

export interface QueueProvider {
  create(key: string): Promise<Queue>;
  get(key: string): Promise<Queue | null>;
}
