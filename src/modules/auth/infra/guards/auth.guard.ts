// src/infrastructure/auth/guards/auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import type { EncodingStrategy } from 'src/shared/infra/ports/strategies/encoding.strategy';
import type { SessionsRepository } from '../../domain/repositories/sessions.repository';
import { Id, ValueType } from 'src/shared/value-objects/id.value-object';
import { Token } from '../../domain/value-objects/token';
import { UnauthorizedError } from '../../domain/erros/unauthorized.error';

interface Payload {
  sessionId?: ValueType;
  expiresAt?: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('EncodingStrategy')
    private readonly encodingStrategy: EncodingStrategy,
    @Inject('SessionsRepository')
    private readonly sessionsRepository: SessionsRepository,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const rawToken = this.extractTokenFromHeader(request);

      if (!rawToken) throw new UnauthorizedError();

      const decodedToken = await this.encodingStrategy.dencode(rawToken);
      const payload: Payload = JSON.parse(decodedToken);

      if (!payload.sessionId || !payload.expiresAt) {
        throw new UnauthorizedError();
      }

      const token = Token.create({
        value: rawToken,
        sessionId: Id.from(payload.sessionId),
        expiresAt: new Date(payload.expiresAt),
      });

      if (token.isExpired()) throw new UnauthorizedError();

      const session = await this.sessionsRepository.findById(token.sessionId);

      if (!session) throw new UnauthorizedError();

      if (session.closedAt || !session.validatedAt) {
        throw new UnauthorizedError();
      }

      return true;
    } catch {
      throw new UnauthorizedError();
    }
  }
}
