import { Injectable } from '@nestjs/common';
import { Token } from '../../domain/value-objects/token';

type ToControllerInput = {
  accessToken: Token;
  refreshToken: Token;
};

type ToControllerOutput = {
  access_token: string;
  refresh_token: string;
};

@Injectable()
export class TokensMapper {
  static toController(input: ToControllerInput): ToControllerOutput {
    return {
      access_token: input.accessToken.value,
      refresh_token: input.refreshToken.value,
    };
  }
}
