type Input = { id?: string; email?: string };
export class UserNotFoundError extends Error {
  private _errors: Array<{ message: string }>;

  constructor(input: Input) {
    super(`User not found error`);
    this.name = 'UserNotFoundError';
    if (input.id) {
      this._errors = [{ message: `User with id ${input.id} was not found` }];
    }
    if (input.email) {
      this._errors = [
        { message: `User with email ${input.email} was not found` },
      ];
    }
  }

  get errors() {
    return this._errors;
  }
}
