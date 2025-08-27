export class TooManyRequestsError extends Error {
  private _errors: Array<{ message: string }>;

  constructor() {
    super(`Rate limit exceeded. Try again later.`);
    this.name = 'TooManyRequestsError';
    this._errors = [];
  }

  get errors() {
    return this._errors;
  }
}
