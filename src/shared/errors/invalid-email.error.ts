export class InvalidEmailError extends Error {
  private _errors: Array<{ message: string }>;

  constructor(email: string) {
    super(`Invalid email`);
    this.name = 'InvalidEmailError';
    this._errors = [{ message: `The ${email} email is invalid` }];
  }

  get errors() {
    return this._errors;
  }
}
