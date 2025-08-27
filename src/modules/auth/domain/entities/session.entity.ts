import { InvalidJSONFormatError } from 'src/shared/errors/invalid-json-format';
import { Id, ValueType } from 'src/shared/value-objects/id.value-object';
export interface Props {
  id: Id;
  userId: Id;
  validatedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const JSONFormats = {
  SNAKE_CASE: 'SNAKE_CASE',
  CAMEL_CASE: 'CAMEL_CASE',
} as const;

export type JSONFormat = (typeof JSONFormats)[keyof typeof JSONFormats];

export interface SnakeCaseJSON {
  id: ValueType;
  user_id: ValueType;
  validated_at?: string;
  closed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CamelCaseJSON {
  id: ValueType;
  userId: ValueType;
  validatedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type SerializedSession<F extends JSONFormat> =
  F extends typeof JSONFormats.SNAKE_CASE ? SnakeCaseJSON : CamelCaseJSON;

export class Session {
  private readonly props: Props;

  private constructor(props: Props) {
    this.props = props;
  }

  get id(): Id {
    return this.props.id;
  }

  get userId(): Id {
    return this.props.userId;
  }

  get validatedAt(): Date | undefined {
    return this.props.validatedAt;
  }

  get closedAt(): Date | undefined {
    return this.props.closedAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  validate() {
    this.props.validatedAt = new Date();
    this.touch();
  }

  close() {
    this.props.closedAt = new Date();
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  toJSON<F extends JSONFormat>(format: F): SerializedSession<F> {
    switch (format) {
      case JSONFormats.SNAKE_CASE:
        return {
          id: this.id.value,
          user_id: this.userId.value,
          validated_at: this.validatedAt?.toJSON(),
          closed_at: this.closedAt?.toJSON(),
          updated_at: this.updatedAt.toJSON(),
          created_at: this.createdAt.toJSON(),
        } as SerializedSession<F>;

      case JSONFormats.CAMEL_CASE:
        return {
          id: this.id.value,
          userId: this.userId.value,
          validatedAt: this.validatedAt?.toJSON(),
          closedAt: this.closedAt?.toJSON(),
          updatedAt: this.updatedAt.toJSON(),
          createdAt: this.createdAt.toJSON(),
        } as SerializedSession<F>;

      default:
        throw new InvalidJSONFormatError(format);
    }
  }

  equals(other: Session): boolean {
    return (
      JSON.stringify(this.toJSON('CAMEL_CASE')) ===
      JSON.stringify(other.toJSON('CAMEL_CASE'))
    );
  }

  static compare(a: Session, b: Session): boolean {
    return a.equals(b);
  }

  static fromJSON<F extends JSONFormat>(
    format: F,
    json: SerializedSession<F>,
  ): Session {
    switch (format) {
      case JSONFormats.SNAKE_CASE: {
        return Session.create({
          id: Id.from((json as SnakeCaseJSON).id),
          userId: Id.from((json as SnakeCaseJSON).user_id),
          validatedAt: (json as SnakeCaseJSON)?.validated_at
            ? new Date((json as SnakeCaseJSON).validated_at as string)
            : undefined,
          closedAt: (json as SnakeCaseJSON)?.closed_at
            ? new Date((json as SnakeCaseJSON).closed_at as string)
            : undefined,
          updatedAt: new Date((json as SnakeCaseJSON).updated_at),
          createdAt: new Date((json as SnakeCaseJSON).created_at),
        });
      }

      case JSONFormats.CAMEL_CASE: {
        return Session.create({
          id: Id.from((json as CamelCaseJSON).id),
          userId: Id.from((json as CamelCaseJSON).userId),
          validatedAt: (json as CamelCaseJSON)?.validatedAt
            ? new Date((json as CamelCaseJSON).validatedAt as string)
            : undefined,
          closedAt: (json as CamelCaseJSON)?.closedAt
            ? new Date((json as CamelCaseJSON).closedAt as string)
            : undefined,
          updatedAt: new Date((json as CamelCaseJSON).updatedAt),
          createdAt: new Date((json as CamelCaseJSON).createdAt),
        });
      }

      default:
        throw new InvalidJSONFormatError(format);
    }
  }

  static create(props: Props): Session {
    return new Session(props);
  }
}
