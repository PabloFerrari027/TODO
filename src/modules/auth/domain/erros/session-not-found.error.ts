export class SessionNotFoundError extends Error {
  private _errors: Array<{ message: string }>;

  constructor(id: string) {
    super(`Session not found error`);
    this.name = 'SessionNotFoundError';
    this._errors = [{ message: `Session with id ${id} was not found` }];
  }

  get errors() {
    return this._errors;
  }
}
