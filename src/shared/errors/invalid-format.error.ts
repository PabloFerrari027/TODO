export class InvalidFormatError extends Error {
  private _errors: Array<{ message: string }>;

  constructor(errors: Array<{ message: string }>) {
    super(`Invalid format`);
    this.name = 'InvalidFormatError';
    this._errors = errors;
  }

  get errors() {
    return this._errors;
  }
}
