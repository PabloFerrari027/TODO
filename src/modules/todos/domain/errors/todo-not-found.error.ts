export class TodoNotFoundError extends Error {
  private _errors: Array<{ message: string }>;

  constructor(id: string) {
    super(`Todo not found error`);
    this.name = 'TodoNotFoundError';
    this._errors = [{ message: `Todo with id ${id} not found` }];
  }

  get errors() {
    return this._errors;
  }
}
