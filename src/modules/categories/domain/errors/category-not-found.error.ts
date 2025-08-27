export class CategoryNotFoundError extends Error {
  private _errors: Array<{ message: string }>;

  constructor(id: string) {
    super(`Category not found error`);
    this.name = 'CategoryNotFoundError';
    this._errors = [{ message: `Category with id ${id} not found` }];
  }

  get errors() {
    return this._errors;
  }
}
