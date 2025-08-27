import { EncodingStrategy } from '../../ports/strategies/encoding.strategy';
import { JWTEncodingStrategy } from '../../implementations/strategies/jwt-encoding-strategy.implementation';
import { Inject, Injectable } from '@nestjs/common';
import { Env } from 'src/shared/config/env';

@Injectable()
export class MakeEncodingStrategyFactory {
  constructor(
    @Inject('Env')
    private readonly env: Env,
  ) {}

  execute(): EncodingStrategy {
    return new JWTEncodingStrategy(this.env);
  }
}
