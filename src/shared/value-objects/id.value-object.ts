import { isUUID } from 'class-validator';
import { randomUUID } from 'crypto';
import { InvalidIdError } from '../errors/invalid-id.error';

export type ValueType = string;

export class Id {
  private readonly _value: ValueType;

  private constructor(value: ValueType) {
    this._value = value;
  }

  get value(): ValueType {
    return this._value;
  }

  equals(other: Id | string): boolean {
    if (typeof other === 'string') return this._value === other;
    return this._value === other._value;
  }

  static compare(a: Id, b: Id): boolean {
    return a.equals(b);
  }

  static isValidValue(value: ValueType): boolean {
    return isUUID(value, 4);
  }

  static from(value: ValueType): Id {
    if (!Id.isValidValue(value)) throw new InvalidIdError(value);
    return new Id(value);
  }

  static create(): Id {
    return new Id(randomUUID());
  }
}
