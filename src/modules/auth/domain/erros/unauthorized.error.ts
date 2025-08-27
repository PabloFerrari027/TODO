export class UnauthorizedError extends Error {
  private _errors: Array<{ message: string }>;

  constructor() {
    super(`Unauthorized`);
    this.name = 'UnauthorizedError';
    this._errors = [];
  }

  get errors() {
    return this._errors;
  }
}
