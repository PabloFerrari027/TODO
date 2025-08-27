export class InvalidJSONFormatError extends Error {
  private _errors: Array<unknown>;

  constructor(errors: Array<unknown>) {
    super(`Invalid JSON format`);
    this.name = 'InvalidJSONFormat';
    this._errors = errors;
  }

  get errors() {
    return this._errors;
  }
}
