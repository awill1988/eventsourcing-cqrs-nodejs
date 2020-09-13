import {NextFunction, Request, Response} from 'express';

export enum HttpErrorCode {
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
  CONFLICT = 409,
}

export class HttpErrors {
  static withCode(code: HttpErrorCode, message?: string) {
    switch (code) {
      case HttpErrorCode.NOT_FOUND:
        return new NotFoundError(message || 'Resource not found');
      case HttpErrorCode.BAD_REQUEST:
        return new BadRequestError(message || 'Invalid request for resource');
      case HttpErrorCode.CONFLICT:
        return new ConflictError(message || 'Resource already exists');
      default:
        return new UnhandledHttpError(message);
    }
  }
}

export class UnhandledHttpError extends Error {
  code = 500;
}

export class NotFoundError extends UnhandledHttpError {
  code = 404;
}

export class BadRequestError extends UnhandledHttpError {
  code = 400;
}

export class ConflictError extends UnhandledHttpError {
  code = 409;
}

// Add catching for errors
export default function errorResponseHandler(err: UnhandledHttpError, req: Request, res: Response, _: NextFunction) {
  if (err.code) {
    return res.status(err.code).send({message: err.message});
  }
  // Unexpected error, log it and respond with 500 status code without a body
  console.error(err);
  return res.status(500).send(null);
}
