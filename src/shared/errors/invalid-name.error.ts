export class InvalidNameError extends Error {
  private _errors: Array<{ message: string }>;

  constructor(name: string) {
    super(`Invalid name`);
    this.name = 'InvalidNameError';
    this._errors = [{ message: `The ${name} name is invalid` }];
  }

  get errors() {
    return this._errors;
  }
}
