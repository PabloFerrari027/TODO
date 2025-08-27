export class SessionAlreadyValidatedError extends Error {
  private _errors: Array<{ message: string }>;

  constructor(sessionId: string) {
    super(`Session already validated error`);
    this.name = 'SessionAlreadyValidatedError';
    this._errors = [
      { message: `Session with id ${sessionId} has already been validated` },
    ];
  }

  get errors() {
    return this._errors;
  }
}
