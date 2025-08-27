import { Inject, Injectable } from '@nestjs/common';
import { EncodingStrategy } from './../../ports/strategies/encoding.strategy';
import jwt from 'jsonwebtoken';
import { Env } from 'src/shared/config/env';

@Injectable()
export class JWTEncodingStrategy implements EncodingStrategy {
  constructor(
    @Inject('Env')
    private readonly env: Env,
  ) {}

  async encode(value: string): Promise<string> {
    const result = jwt.sign(value, this.env.variables.JWT_SECRET);
    return result;
  }

  async dencode(value: string): Promise<string> {
    const result = JSON.stringify(
      jwt.verify(value, this.env.variables.JWT_SECRET, {
        ignoreExpiration: true,
      }),
    );

    return result;
  }
}
