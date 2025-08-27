import { Bus } from 'src/shared/domain-events/bus';
import { SessionCreatedHandler } from 'src/modules/auth/application/handlers/events/session-created.handler';
import { CreatedSessionEvent } from 'src/modules/auth/domain/events/created-session.event';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class DomainEventsManager implements OnApplicationBootstrap {
  constructor(
    @Inject('SessionCreatedHandler')
    private readonly sessionCreatedHandler: SessionCreatedHandler,
  ) {}

  onApplicationBootstrap() {
    this.execute();
  }

  execute() {
    Bus.register(CreatedSessionEvent.name, this.sessionCreatedHandler);
  }
}
