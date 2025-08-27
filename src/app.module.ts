import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  ThrottlerGuard,
  ThrottlerModule,
  ThrottlerModuleOptions,
} from '@nestjs/throttler';
import { MakeQueueProviderFactory } from './shared/infra/factories/providers/make-queue-provider.factory';
import { MakeEncodingStrategyFactory } from './shared/infra/factories/strategies/make-encoding-strategy.factory';
import { MakeNotificationStrategyFactory } from './shared/infra/factories/strategies/make-notification-strategy.factory';
import { MakeCategoriesRepositoryFactory } from './shared/infra/factories/repositories/make-categories-repository.factory';
import { MakeCodeValidationRepositoryFactory } from './shared/infra/factories/repositories/make-code-validation-repository.factory';
import { MakeSessionsRepositoryFactory } from './shared/infra/factories/repositories/make-sessions-repository.factory';
import { MakeTodosRepositoryFactory } from './shared/infra/factories/repositories/make-todos-repository.factory';
import { MakeUsersRepositoryFactory } from './shared/infra/factories/repositories/make-users-repository.factory';
import { SessionCreatedHandler } from './modules/auth/application/handlers/events/session-created.handler';
import { SendCodeValidationHandler } from './modules/auth/application/handlers/queues/send-code-validation.handler';
import { VerificationCodeTemplate } from './modules/auth/templates/verification-code.template';
import { DomainEventsManager } from './shared/infra/managers/domain-events.manager';
import { QueueManager } from './shared/infra/managers/queue.manager';
import { CategoriesModule } from './modules/categories/categories.module';
import { Env } from './shared/config/env';
import { EnvDTO } from './shared/config/env.dto';
import { APP_GUARD } from '@nestjs/core';
import { Prisma } from './shared/infra/orm/prisma';
import { AuthModule } from './modules/auth/auth.modules';
import { TodosModule } from './modules/todos/todos.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: ['Env'],
      useFactory: (env: Env): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: env.variables.RATE_LIMIT_TTL,
            limit: env.variables.RATE_LIMIT_LIMIT,
          },
        ],
      }),
    }),
    AuthModule,
    CategoriesModule,
    TodosModule,
  ],
  providers: [
    {
      provide: 'Prisma',
      useClass: Prisma,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: 'Env',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      useFactory: () => new Env(process.env as any),
    },
    {
      provide: 'MakeQueueProviderFactory',
      useClass: MakeQueueProviderFactory,
    },
    {
      provide: 'MakeEncodingStrategyFactory',
      useClass: MakeEncodingStrategyFactory,
    },
    {
      provide: 'MakeNotificationStrategyFactory',
      useClass: MakeNotificationStrategyFactory,
    },
    {
      provide: 'MakeCategoriesRepositoryFactory',
      useClass: MakeCategoriesRepositoryFactory,
    },
    {
      provide: 'MakeCodeValidationRepositoryFactory',
      useClass: MakeCodeValidationRepositoryFactory,
    },
    {
      provide: 'MakeSessionsRepositoryFactory',
      useClass: MakeSessionsRepositoryFactory,
    },
    {
      provide: 'MakeTodosRepositoryFactory',
      useClass: MakeTodosRepositoryFactory,
    },
    {
      provide: 'MakeUsersRepositoryFactory',
      useClass: MakeUsersRepositoryFactory,
    },
    {
      provide: 'QueueProvider',
      useFactory: (factory: MakeQueueProviderFactory) => factory.execute(),
      inject: ['MakeQueueProviderFactory'],
    },
    {
      provide: 'EncodingStrategy',
      useFactory: (factory: MakeEncodingStrategyFactory) => factory.execute(),
      inject: ['MakeEncodingStrategyFactory'],
    },
    {
      provide: 'NotificationStrategy',
      useFactory: (factory: MakeNotificationStrategyFactory) =>
        factory.execute(),
      inject: ['MakeNotificationStrategyFactory'],
    },
    {
      provide: 'CategoriesRepository',
      useFactory: (factory: MakeCategoriesRepositoryFactory) =>
        factory.execute(),
      inject: ['MakeCategoriesRepositoryFactory'],
    },
    {
      provide: 'CodeValidationRepository',
      useFactory: (factory: MakeCodeValidationRepositoryFactory) =>
        factory.execute(),
      inject: ['MakeCodeValidationRepositoryFactory'],
    },
    {
      provide: 'SessionsRepository',
      useFactory: (factory: MakeSessionsRepositoryFactory) => factory.execute(),
      inject: ['MakeSessionsRepositoryFactory'],
    },
    {
      provide: 'TodosRepository',
      useFactory: (factory: MakeTodosRepositoryFactory) => factory.execute(),
      inject: ['MakeTodosRepositoryFactory'],
    },
    {
      provide: 'UsersRepository',
      useFactory: (factory: MakeUsersRepositoryFactory) => factory.execute(),
      inject: ['MakeUsersRepositoryFactory'],
    },
    {
      provide: 'SessionCreatedHandler',
      useClass: SessionCreatedHandler,
    },
    {
      provide: 'SendCodeValidationHandler',
      useClass: SendCodeValidationHandler,
    },
    {
      provide: 'VerificationCodeTemplate',
      useClass: VerificationCodeTemplate,
    },
    {
      provide: 'DomainEventsManager',
      useClass: DomainEventsManager,
    },
    {
      provide: 'QueueManager',
      useClass: QueueManager,
    },
    EnvDTO,
  ],
  exports: [
    'Env',
    'QueueProvider',
    'EncodingStrategy',
    'NotificationStrategy',
    'CategoriesRepository',
    'CodeValidationRepository',
    'SessionsRepository',
    'TodosRepository',
    'UsersRepository',
  ],
})
export class AppModule {}
