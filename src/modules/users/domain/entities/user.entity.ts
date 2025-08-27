import { Id, ValueType } from 'src/shared/value-objects/id.value-object';
import { Name } from 'src/shared/value-objects/name.value-object';
import { Email } from 'src/shared/value-objects/email.value-object';
import { InvalidJSONFormatError } from 'src/shared/errors/invalid-json-format';

export interface Props {
  id: Id;
  name: Name;
  email: Email;
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
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface CamelCaseJSON {
  id: ValueType;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type SerializedUser<F extends JSONFormat> =
  F extends typeof JSONFormats.SNAKE_CASE ? SnakeCaseJSON : CamelCaseJSON;

export class User {
  private readonly props: Props;

  private constructor(props: Props) {
    this.props = props;
  }

  get id(): Id {
    return this.props.id;
  }

  get name(): Name {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  set name(name: Name) {
    this.props.name = name;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  toJSON<F extends JSONFormat>(format: F): SerializedUser<F> {
    switch (format) {
      case JSONFormats.SNAKE_CASE:
        return {
          id: this.id.value,
          name: this.name.value,
          email: this.email.value,
          created_at: this.createdAt.toJSON(),
          updated_at: this.updatedAt.toJSON(),
        } as SerializedUser<F>;

      case JSONFormats.CAMEL_CASE:
        return {
          id: this.id.value,
          name: this.name.value,
          email: this.email.value,
          createdAt: this.createdAt.toJSON(),
          updatedAt: this.updatedAt.toJSON(),
        } as SerializedUser<F>;

      default:
        throw new InvalidJSONFormatError(format);
    }
  }

  equals(other: User): boolean {
    return (
      JSON.stringify(this.toJSON('CAMEL_CASE')) ===
      JSON.stringify(other.toJSON('CAMEL_CASE'))
    );
  }

  static compare(a: User, b: User): boolean {
    return a.equals(b);
  }

  static fromJSON<F extends JSONFormat>(
    format: F,
    json: SerializedUser<F>,
  ): User {
    switch (format) {
      case JSONFormats.SNAKE_CASE: {
        return User.create({
          id: Id.from((json as SnakeCaseJSON).id),
          name: Name.create((json as SnakeCaseJSON).name),
          email: Email.create((json as SnakeCaseJSON).email),
          createdAt: new Date((json as SnakeCaseJSON).created_at),
          updatedAt: new Date((json as SnakeCaseJSON).updated_at),
        });
      }

      case JSONFormats.CAMEL_CASE: {
        return User.create({
          id: Id.from((json as CamelCaseJSON).id),
          name: Name.create((json as CamelCaseJSON).name),
          email: Email.create((json as CamelCaseJSON).email),
          createdAt: new Date((json as CamelCaseJSON).createdAt),
          updatedAt: new Date((json as CamelCaseJSON).updatedAt),
        });
      }

      default:
        throw new InvalidJSONFormatError(format);
    }
  }

  static create(props: Props): User {
    return new User(props);
  }
}
