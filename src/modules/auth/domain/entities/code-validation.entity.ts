import { InvalidJSONFormatError } from 'src/shared/errors/invalid-json-format';
import { Id, ValueType } from 'src/shared/value-objects/id.value-object';
import { InvalidCodeValidationError } from '../erros/invalid-code-validation.error';

export interface Props {
  id: Id;
  sessionId: Id;
  value: string;
  usedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
}

export const JSONFormats = {
  SNAKE_CASE: 'SNAKE_CASE',
  CAMEL_CASE: 'CAMEL_CASE',
} as const;

export type JSONFormat = (typeof JSONFormats)[keyof typeof JSONFormats];

export interface SnakeCaseJSON {
  id: ValueType;
  session_id: ValueType;
  value: string;
  used_at: string | undefined;
  expires_at: string;
  created_at: string;
}

export interface CamelCaseJSON {
  id: ValueType;
  sessionId: ValueType;
  value: string;
  usedAt: string | undefined;
  expiresAt: string;
  createdAt: string;
}

export type SerializedCodeValidation<F extends JSONFormat> =
  F extends typeof JSONFormats.SNAKE_CASE ? SnakeCaseJSON : CamelCaseJSON;

export class CodeValidation {
  private readonly props: Props;

  private constructor(props: Props) {
    this.props = props;
  }

  get id(): Id {
    return this.props.id;
  }

  get sessionId(): Id {
    return this.props.sessionId;
  }

  get value(): string {
    return this.props.value;
  }

  get usedAt(): Date | undefined {
    return this.props.usedAt;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  set usedAt(value: Date) {
    this.props.usedAt = value;
  }

  toJSON<F extends JSONFormat>(format: F): SerializedCodeValidation<F> {
    switch (format) {
      case JSONFormats.SNAKE_CASE:
        return {
          id: this.id.value,
          value: this.value,
          session_id: this.sessionId.value,
          used_at: this.usedAt?.toJSON(),
          expires_at: this.expiresAt.toJSON(),
          created_at: this.createdAt.toJSON(),
        } as SerializedCodeValidation<F>;

      case JSONFormats.CAMEL_CASE:
        return {
          id: this.id.value,
          value: this.value,
          sessionId: this.sessionId.value,
          usedAt: this.usedAt?.toJSON(),
          expiresAt: this.expiresAt.toJSON(),
          createdAt: this.createdAt.toJSON(),
        } as SerializedCodeValidation<F>;

      default:
        throw new InvalidJSONFormatError(format);
    }
  }

  equals(other: CodeValidation): boolean {
    return (
      JSON.stringify(this.toJSON('CAMEL_CASE')) ===
      JSON.stringify(other.toJSON('CAMEL_CASE'))
    );
  }

  isUsed(): boolean {
    return !!this.usedAt;
  }

  isExpired(): boolean {
    return this.expiresAt.getTime() < new Date().getTime();
  }

  static compare(a: CodeValidation, b: CodeValidation): boolean {
    return a.equals(b);
  }

  static fromJSON<F extends JSONFormat>(
    format: F,
    json: SerializedCodeValidation<F>,
  ): CodeValidation {
    switch (format) {
      case JSONFormats.SNAKE_CASE: {
        return CodeValidation.create({
          id: Id.from((json as SnakeCaseJSON).id),
          sessionId: Id.from((json as SnakeCaseJSON).session_id),
          value: (json as SnakeCaseJSON).value,
          usedAt: (json as SnakeCaseJSON)?.used_at
            ? new Date((json as SnakeCaseJSON).used_at as string)
            : undefined,
          expiresAt: new Date((json as SnakeCaseJSON).expires_at),
          createdAt: new Date((json as SnakeCaseJSON).created_at),
        });
      }

      case JSONFormats.CAMEL_CASE: {
        return CodeValidation.create({
          id: Id.from((json as CamelCaseJSON).id),
          sessionId: Id.from((json as CamelCaseJSON).sessionId),
          value: (json as CamelCaseJSON).value,
          usedAt: (json as CamelCaseJSON)?.usedAt
            ? new Date((json as CamelCaseJSON).usedAt as string)
            : undefined,
          expiresAt: new Date((json as CamelCaseJSON).expiresAt),
          createdAt: new Date((json as CamelCaseJSON).createdAt),
        });
      }

      default:
        throw new InvalidJSONFormatError(format);
    }
  }

  static generate(): string {
    return String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
  }

  static isValid(value: string): boolean {
    return /^[0-9]{6}$/.test(value);
  }

  static create(
    props: Omit<Props, 'expiresAt'> & Partial<Pick<Props, 'expiresAt'>>,
  ): CodeValidation {
    if (!this.isValid(props.value)) {
      throw new InvalidCodeValidationError(props.value);
    }

    const expiresAt = props.expiresAt ?? new Date();
    if (!props.expiresAt) expiresAt.setHours(expiresAt.getHours() + 1);

    return new CodeValidation({ ...props, expiresAt });
  }
}
