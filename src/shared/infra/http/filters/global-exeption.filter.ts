import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CodeValidationExpiredError } from 'src/modules/auth/domain/erros/code-validation-expired.error';
import { CodeValidationNotFoundError } from 'src/modules/auth/domain/erros/code-validation-not-found.error';
import { SessionAlreadyValidatedError } from 'src/modules/auth/domain/erros/session-alredy-validated.error';
import { SessionNotFoundError } from 'src/modules/auth/domain/erros/session-not-found.error';
import { UnimplementedLanguageError } from 'src/modules/auth/domain/erros/unimplemented-language-error';
import { CategoryAlreadyExistsError } from 'src/modules/categories/domain/errors/category-already-exists.error';
import { CategoryNotFoundError } from 'src/modules/categories/domain/errors/category-not-found.error';
import { TodoNotFoundError } from 'src/modules/todos/domain/errors/todo-not-found.error';
import { UserAlreadyExistsError } from 'src/modules/users/domain/errors/user-already-exists.error';
import { UserNotFoundError } from 'src/modules/users/domain/errors/user-not-found.error';
import { InvalidFormatError } from 'src/shared/errors/invalid-format.error';
import { InvalidEmailError } from 'src/shared/errors/invalid-email.error';
import { InvalidJSONFormatError } from 'src/shared/errors/invalid-json-format';
import { IdNotFoundError } from 'src/shared/errors/ip-not-found-error';
import { NotAcceptableError } from 'src/shared/errors/not-acceptable.error';
import { TooManyRequestsError } from 'src/shared/errors/too-many-requests.error';
import { InvalidCodeValidationError } from 'src/modules/auth/domain/erros/invalid-code-validation.error';
import { UnauthorizedError } from 'src/modules/auth/domain/erros/unauthorized.error';
import { JsonWebTokenError } from '@nestjs/jwt';

const errorStatusMap: Record<string, number> = {
  [CategoryNotFoundError.name]: HttpStatus.NOT_FOUND,
  [SessionNotFoundError.name]: HttpStatus.NOT_FOUND,
  [UserNotFoundError.name]: HttpStatus.NOT_FOUND,
  [CodeValidationNotFoundError.name]: HttpStatus.NOT_FOUND,
  [TodoNotFoundError.name]: HttpStatus.NOT_FOUND,
  [CodeValidationExpiredError.name]: HttpStatus.BAD_REQUEST,
  [SessionAlreadyValidatedError.name]: HttpStatus.BAD_REQUEST,
  [UserAlreadyExistsError.name]: HttpStatus.BAD_REQUEST,
  [CategoryAlreadyExistsError.name]: HttpStatus.BAD_REQUEST,
  [InvalidEmailError.name]: HttpStatus.BAD_REQUEST,
  [UnauthorizedError.name]: HttpStatus.UNAUTHORIZED,
  [NotAcceptableError.name]: HttpStatus.NOT_ACCEPTABLE,
  [InvalidJSONFormatError.name]: HttpStatus.INTERNAL_SERVER_ERROR,
  [UnimplementedLanguageError.name]: HttpStatus.INTERNAL_SERVER_ERROR,
  [IdNotFoundError.name]: HttpStatus.INTERNAL_SERVER_ERROR,
  [TooManyRequestsError.name]: HttpStatus.TOO_MANY_REQUESTS,
  [InvalidFormatError.name]: HttpStatus.BAD_REQUEST,
  [InvalidCodeValidationError.name]: HttpStatus.BAD_REQUEST,
  [HttpException.name]: HttpStatus.NOT_FOUND,
  [JsonWebTokenError.name]: HttpStatus.UNAUTHORIZED,
};

type Exception =
  | CategoryNotFoundError
  | SessionNotFoundError
  | UserNotFoundError
  | CodeValidationNotFoundError
  | TodoNotFoundError
  | CodeValidationExpiredError
  | SessionAlreadyValidatedError
  | UserAlreadyExistsError
  | CategoryAlreadyExistsError
  | InvalidEmailError
  | UnauthorizedError
  | NotAcceptableError
  | InvalidJSONFormatError
  | UnimplementedLanguageError
  | IdNotFoundError
  | TooManyRequestsError
  | InvalidFormatError
  | InvalidCodeValidationError
  | JsonWebTokenError
  | HttpException;

type ExceptionResponse =
  | { message: string | string[]; statusCode: number }
  | string;
@Catch(Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const exceptionRes = exception.getResponse() as ExceptionResponse;

      const errors: Array<{ message: string }> = [];
      let status = 500;

      if (typeof exceptionRes === 'object') {
        status = exceptionRes.statusCode;
        if (typeof exceptionRes.message === 'string') {
          errors.push({ message: exceptionRes.message });
        } else {
          exceptionRes.message.forEach((m) => errors.push({ message: m }));
        }
      }

      response.status(status).json({ errors });
      return;
    }

    if (exception instanceof JsonWebTokenError) {
      response.status(401).json({ errors: [] });
      return;
    }

    const status = errorStatusMap[exception.name] ?? 500;
    const errors = exception?.errors ?? [];

    response.status(status).json({ errors });
  }
}
