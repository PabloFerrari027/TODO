export class InvalidCodeValidationError extends Error {
  private _errors: Array<{ message: string }>;

  constructor(codevalidation: string) {
    super(`Invalid code validation`);
    this.name = 'InvalidCodeValidationError';
    this._errors = [
      { message: `The ${codevalidation} code validation is invalid` },
    ];
  }

  get errors() {
    return this._errors;
  }
}
