import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './shared/infra/http/filters/global-exeption.filter';
import { TimeoutInterceptor } from './shared/interceptors/timeout.interceptor';
import { Env } from './shared/config/env';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvDTO } from './shared/config/env.dto';

async function bootstrap() {
  const dto = plainToInstance(EnvDTO, process.env);
  const errors = validateSync(dto);
  if (errors.length > 0) throw new Error('Invalid environment variables');

  const env = new Env(dto);
  const timeout = env.variables.RESPONSE_TIMEOUT;
  const config = new DocumentBuilder()
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: [env.variables.CORS_ORIGINS] });
  app.useGlobalInterceptors(new TimeoutInterceptor(timeout));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: -1,
    },
  });

  await app.listen(3000);
}

bootstrap();
