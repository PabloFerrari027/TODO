import { Id } from 'src/shared/value-objects/id.value-object';

export interface Props {
  value: string;
  sessionId: Id;
  expiresAt?: Date;
}

export class Token {
  private props: Props;

  private constructor(props: Props) {
    this.props = props;
  }

  get value(): string {
    return this.props.value;
  }

  get sessionId(): Id {
    return this.props.sessionId;
  }

  get expiresAt(): Date | undefined {
    return this.props.expiresAt;
  }

  isExpired(): boolean {
    if (!this.props.expiresAt) return false;
    return this.props.expiresAt < new Date();
  }

  static create(props: Props): Token {
    return new Token(props);
  }
}
