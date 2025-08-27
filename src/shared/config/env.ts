import { Injectable } from '@nestjs/common';
import { EnvDTO } from './env.dto';

@Injectable()
export class Env {
  public readonly variables: EnvDTO;

  constructor(variables: EnvDTO) {
    this.variables = variables;
  }
}
