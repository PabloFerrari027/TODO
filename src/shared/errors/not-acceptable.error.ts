export class NotAcceptableError extends Error {
  private _errors: Array<{ message: string }>;

  constructor(errors: Array<{ message: string }>) {
    super();
    this.name = 'NotAcceptableError';
    this._errors = errors;
  }

  get errors() {
    return this._errors;
  }
}
