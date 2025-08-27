export class CodeValidationExpiredError extends Error {
  private _errors: Array<{ message: string }>;

  constructor(code: string) {
    super(`Code validation expired error`);
    this.name = 'CodeValidationExpiredError';
    this._errors = [{ message: `Code ${code} has already been validated` }];
  }

  get errors() {
    return this._errors;
  }
}
