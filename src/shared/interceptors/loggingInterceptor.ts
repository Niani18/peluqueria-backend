import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>() as any;
    const res = http.getResponse<Response>() as any;

    const { method, originalUrl } = req;
    const reqId = (req as any).reqId ?? ''; // si tu middleware puso un x-request-id
    const start = Date.now();

    return next.handle().pipe(
      finalize(() => {
        const ms = Date.now() - start;
        const status = res?.statusCode ?? 200;
        // Log uniforme de salida
        this.logger.log(
          `[OUT] ${method} ${originalUrl} -> ${status} in ${ms}ms${reqId ? ` | id=${reqId}` : ''}`,
        );
      }),
    );
  }
}