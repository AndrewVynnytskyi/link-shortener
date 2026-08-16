import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Shape of every error response the API returns. Keeping this uniform
 * makes the frontend's error handling predictable regardless of which
 * endpoint or exception type produced it.
 */
interface ErrorResponseBody {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
}

/**
 * Normalizes every thrown error (Nest `HttpException`s and unexpected
 * runtime errors alike) into a single JSON shape, and logs 5xx errors
 * server-side without leaking internals to the client.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException ? exception.getResponse() : null;
    const message =
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
        ? (exceptionResponse as { message: string | string[] }).message
        : isHttpException
          ? exception.message
          : 'Internal server error';

    const error =
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'error' in exceptionResponse
        ? (exceptionResponse as { error: string }).error
        : HttpStatus[statusCode];

    const body: ErrorResponseBody = {
      statusCode,
      message,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (statusCode >= (HttpStatus.INTERNAL_SERVER_ERROR as number)) {
      const stack = exception instanceof Error ? exception.stack : undefined;
      this.logger.error(
        `${request.method} ${request.url} -> ${statusCode}`,
        stack,
      );
    }

    response.status(statusCode).json(body);
  }
}
