export class UnimplementedLanguageError extends Error {
  private _errors: Array<{ message: string }>;

  constructor(language: string) {
    super(`Unimplemented language error`);
    this.name = 'UnimplementedLanguageError';
    this._errors = [
      { message: `The ${language} language was not implemented` },
    ];
  }

  get errors() {
    return this._errors;
  }
}
