import { Module } from '@nestjs/common';
import { ValidateSessionUseCase } from './application/use-cases/validate-session.use-case';
import { LoginUseCase } from '../auth/application/use-cases/login.use-case';
import { LogoutUseCase } from '../auth/application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '../auth/application/use-cases/refresh-token.use-case';
import { RegisterUseCase } from '../auth/application/use-cases/register.use-case';
import { AuthController } from './application/controllers/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: 'ValidateSessionUseCase',
      useClass: ValidateSessionUseCase,
    },
    {
      provide: 'LoginUseCase',
      useClass: LoginUseCase,
    },
    {
      provide: 'LogoutUseCase',
      useClass: LogoutUseCase,
    },
    {
      provide: 'RefreshTokenUseCase',
      useClass: RefreshTokenUseCase,
    },
    {
      provide: 'RegisterUseCase',
      useClass: RegisterUseCase,
    },
  ],
})
export class AuthModule {}
