export class UserAlreadyExistsError extends Error {
  private _errors: Array<{ message: string }>;

  constructor(email: string) {
    super(`User already exists`);
    this.name = 'UserAlreadyExistsError';
    this._errors = [{ message: `The email ${email} is already in use` }];
  }

  get errors() {
    return this._errors;
  }
}
