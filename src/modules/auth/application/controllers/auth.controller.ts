import {
  Controller,
  Post,
  Param,
  Body,
  Inject,
  Injectable,
  HttpCode,
} from '@nestjs/common';
import { ValidateSessionUseCase } from '../use-cases/validate-session.use-case';
import { LoginUseCase } from '../use-cases/login.use-case';
import { LogoutUseCase } from '../use-cases/logout.use-case';
import { RefreshTokenUseCase } from '../use-cases/refresh-token.use-case';
import { RegisterUseCase } from '../use-cases/register.use-case';
import { SessionMapper } from '../../infra/mappers/tokens.mapper';
import { TokensMapper } from '../../infra/mappers/auth.mapper';
import { ValidateSessionBodyDto } from '../dtos/controllers/validate-session-body.dto';
import { LoginBodyDto } from '../dtos/controllers/login-body.dto';
import { LogoutParamDto } from '../dtos/controllers/logout-param.dto';
import { RefreshTokenBodyDto } from '../dtos/controllers/refresh-token-body.dto';
import { RegisterBodyDto } from '../dtos/controllers/register-body.dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('auth')
@Injectable()
@ApiBadRequestResponse({
  description: 'The request could not be processed due to invalid input.',
  schema: {
    type: 'object',
    properties: {
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
      },
    },
  },
})
@ApiInternalServerErrorResponse({
  description: 'An internal server error occurred.',
  schema: {
    type: 'object',
    properties: {
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
      },
    },
  },
})
@ApiNotFoundResponse({
  description: 'Some requested resource was not found',
  schema: {
    type: 'object',
    properties: {
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
      },
    },
  },
})
export class AuthController {
  constructor(
    @Inject('ValidateSessionUseCase')
    private readonly ValidateSessionUseCase: ValidateSessionUseCase,
    @Inject('LoginUseCase')
    private readonly loginUseCase: LoginUseCase,
    @Inject('LogoutUseCase')
    private readonly logoutUseCase: LogoutUseCase,
    @Inject('RefreshTokenUseCase')
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    @Inject('RegisterUseCase')
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('/register')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'User successfully created',
    schema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          example: 'b7f9d2a3-4567-8901-abcd-ef2345678901',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Register new user',
    description: `When registering a new user, a **validation session** will be generated and displayed in the terminal. You must provide this code to the **validation service** to confirm your session.`,
  })
  async register(@Body() body: RegisterBodyDto) {
    const response = await this.registerUseCase.execute(body);
    return SessionMapper.toController(response.sessionId);
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login',
    description: `When you log in, a **validation session** will be generated and displayed in the terminal. You must provide this code to the **validation service** to confirm your session.`,
  })
  @ApiOkResponse({
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          example: 'b7f9d2a3-4567-8901-abcd-ef2345678901',
        },
      },
    },
  })
  async login(@Body() body: LoginBodyDto) {
    const response = await this.loginUseCase.execute(body);
    return SessionMapper.toController(response.sessionId);
  }

  @Post('/validate/session')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Validate session',
    description: `
Upon successfully validating the session, you will receive two tokens: an **access token** and a **refresh token**.

- The **access token** is valid for **1 hour** and must be sent in the authentication header (\`Authorization: Bearer <token>\`) to access protected routes.
- The **refresh token** can be used to obtain a new access token once the current one expires, without requiring full re-authentication.
`,
  })
  @ApiOkResponse({
    description: 'Session successfully validated',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
      },
    },
  })
  async validateCode(@Body() body: ValidateSessionBodyDto) {
    const response = await this.ValidateSessionUseCase.execute({
      code: body.code,
      sessionId: body.session_id,
    });

    return TokensMapper.toController(response);
  }

  @Post('/refresh/token')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Refresh access token',
    description: `
After refreshing your access token, you will receive a **new access token** and a **new refresh token**.  

- The **access token** is valid for **1 hour** and should be included in the authentication header (\`Authorization: Bearer <token>\`) to access protected routes.  
- The **refresh token** can be used to obtain a new access token again without requiring a full login.
`,
  })
  @ApiOkResponse({
    description: 'Access token refresh completed successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
      },
    },
  })
  async refresh(@Body() body: RefreshTokenBodyDto) {
    const response = await this.refreshTokenUseCase.execute({
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
    });

    return TokensMapper.toController(response);
  }

  @Post('/logout')
  @HttpCode(200)
  @ApiOperation({
    summary: 'End session',
    description: `Once the session is terminated, you **will no longer be able to access protected routes** until you log in and validate your session again. Make sure to log in again to continue accessing the API's protected resources.`,
  })
  @ApiOkResponse({ description: 'Session ended successfully' })
  async logout(@Param() params: LogoutParamDto) {
    await this.logoutUseCase.execute(params);
  }
}
