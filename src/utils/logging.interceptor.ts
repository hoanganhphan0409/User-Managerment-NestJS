import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  private readonly lightBlue = '\x1b[94m'; 
  private readonly reset = '\x1b[0m';

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    const { method, originalUrl } = req;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        this.logger.log(
          `${this.lightBlue}${method} ${originalUrl} - ${delay}ms${this.reset}`,
        );
      }),
      catchError((err) => {
        const delay = Date.now() - now;
        this.logger.error(
          `${method} ${originalUrl} - ${delay}ms - Error: ${err.message}`,
        );
        throw err;
      }),
    );
  }
}
