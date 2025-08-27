export class IdNotFoundError extends Error {
  private _errors: Array<unknown>;

  constructor(errors: Array<unknown>) {
    super(`IP not found`);
    this.name = 'IdNotFoundError';
    this._errors = errors;
  }

  get errors() {
    return this._errors;
  }
}
