import { ValidationError } from 'class-validator';

export class FormatValidationErrors {
  static execute(errors: ValidationError[]): Array<{ message: string }> {
    const messages: Array<{ message: string }> = [];

    errors.forEach((err) => {
      if (!err.constraints) return;
      Object.values(err.constraints).forEach((msg) => {
        const spledMsg = msg.split('');
        const message = spledMsg[0].toUpperCase() + spledMsg.slice(1).join('');
        messages.push({ message });
      });
    });

    return messages;
  }
}
