export class CategoryAlreadyExistsError extends Error {
  private _errors: Array<{ message: string }>;

  constructor(name: string) {
    super(`Category already exists`);
    this.name = 'CategoryAlreadyExistsError';
    this._errors = [{ message: `The name ${name} is already in use` }];
  }

  get errors() {
    return this._errors;
  }
}
