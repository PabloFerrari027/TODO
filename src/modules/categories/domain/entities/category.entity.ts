import { InvalidJSONFormatError } from 'src/shared/errors/invalid-json-format';
import { Id, ValueType } from 'src/shared/value-objects/id.value-object';
import { Name } from 'src/shared/value-objects/name.value-object';

export interface Props {
  id: Id;
  name: Name;
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
  created_at: string;
  updated_at: string;
}

export interface CamelCaseJSON {
  id: ValueType;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type SerializedCategory<F extends JSONFormat> =
  F extends typeof JSONFormats.SNAKE_CASE ? SnakeCaseJSON : CamelCaseJSON;

export class Category {
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

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set name(name: Name) {
    this.props.name = name;
    this.touch();
  }

  toJSON<F extends JSONFormat>(format: F): SerializedCategory<F> {
    switch (format) {
      case JSONFormats.SNAKE_CASE:
        return {
          id: this.id.value,
          name: this.name.value,
          created_at: this.createdAt.toJSON(),
          updated_at: this.updatedAt.toJSON(),
        } as SerializedCategory<F>;

      case JSONFormats.CAMEL_CASE:
        return {
          id: this.id.value,
          name: this.name.value,
          createdAt: this.createdAt.toJSON(),
          updatedAt: this.updatedAt.toJSON(),
        } as SerializedCategory<F>;

      default:
        throw new InvalidJSONFormatError(format);
    }
  }

  equals(other: Category): boolean {
    return (
      JSON.stringify(this.toJSON('CAMEL_CASE')) ===
      JSON.stringify(other.toJSON('CAMEL_CASE'))
    );
  }

  static compare(a: Category, b: Category): boolean {
    return a.equals(b);
  }

  static fromJSON<F extends JSONFormat>(
    format: F,
    json: SerializedCategory<F>,
  ): Category {
    switch (format) {
      case JSONFormats.SNAKE_CASE: {
        return Category.create({
          id: Id.from((json as SnakeCaseJSON).id),
          name: Name.create((json as SnakeCaseJSON).name),
          createdAt: new Date((json as SnakeCaseJSON).created_at),
          updatedAt: new Date((json as SnakeCaseJSON).updated_at),
        });
      }

      case JSONFormats.CAMEL_CASE: {
        return Category.create({
          id: Id.from((json as CamelCaseJSON).id),
          name: Name.create((json as CamelCaseJSON).name),
          createdAt: new Date((json as CamelCaseJSON).createdAt),
          updatedAt: new Date((json as CamelCaseJSON).updatedAt),
        });
      }

      default:
        throw new InvalidJSONFormatError(format);
    }
  }

  static create(props: Props): Category {
    return new Category(props);
  }
}
