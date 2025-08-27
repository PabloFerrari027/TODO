export class InvalidIdError extends Error {
  private _errors: Array<{ message: string }>;

  constructor(id: string) {
    super(`Invalid Id format`);
    this.name = 'InvalidIdError';
    this._errors = [{ message: `The ${id} id is invalid` }];
  }

  get errors() {
    return this._errors;
  }
}
