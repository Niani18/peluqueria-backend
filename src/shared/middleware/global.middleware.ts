import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class GlobalMiddleware implements NestMiddleware {
  private readonly logger = new Logger(GlobalMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // --- datos básicos de la request ---
    const { method, originalUrl } = req;
    const ip = (req.headers['x-forwarded-for'] as string) ?? req.ip ?? 'unknown';
    const ua = req.get('user-agent') || 'unknown';

    // --- request-id para correlación (si tu proxy no lo pone, lo generamos) ---
    const reqId =
      (req.headers['x-request-id'] as string) ||
      (res.getHeader('x-request-id') as string) ||
      randomUUID();

    // expone el id para capas siguientes (interceptor, filter, etc.)
    res.setHeader('x-request-id', reqId);
    (req as any).reqId = reqId;

    // esto es un ejemplo, aca van las rutas que se quieren saltear
    if (originalUrl === '/health') return next();

    // log de ENTRADA
    this.logger.log(`[IN] ${method} ${originalUrl} | id=${reqId} | ip=${ip} | ua="${ua}"`);

    next();
  }
}
