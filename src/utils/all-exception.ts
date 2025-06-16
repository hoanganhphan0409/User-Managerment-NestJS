import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseType } from './response.type';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode: number;
    let message: string;
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const responseBody = exception.getResponse();
      message =
        typeof responseBody === 'object'
          ? (responseBody as any).message
          : responseBody;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'Internal Server Error';
    }

    const res: ResponseType = {
      success: false,
      message: Array.isArray(message) ? message[0] : message,
      code: statusCode,
      data: null,
    };

    response.status(statusCode).json(res);
  }
}
