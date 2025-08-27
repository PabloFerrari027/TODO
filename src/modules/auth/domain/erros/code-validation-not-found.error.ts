export class CodeValidationNotFoundError extends Error {
  private _errors: Array<{ message: string }>;

  constructor(code: string) {
    super(`Code validation not found error`);
    this.name = 'CodeValidationNotFoundError';
    this._errors = [{ message: `Validation code ${code} not found` }];
  }

  get errors() {
    return this._errors;
  }
}
