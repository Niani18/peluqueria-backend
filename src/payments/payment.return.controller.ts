// payments.return.controller.ts
import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Payment as MPPayment } from 'mercadopago';
import { MercadoPagoClient } from './mercadopago.client';

@Controller('payments/return')
export class PaymentsReturnController {
  constructor(
    private readonly cfg: ConfigService,
    private readonly mp: MercadoPagoClient,
  ) {}

  // Utilidad opcional: consultar pago a MP (para mostrar confirmación real)
  private async fetchPayment(paymentId?: string) {
    if (!paymentId) return null;
    const api = new MPPayment(this.mp.client);
    try {
      return await api.get({ id: paymentId });
    } catch {
      return null;
    }
  }

  @Get('success')
  async success(@Query() q: any, @Res() res: Response) {
    // MP suele mandar: payment_id, status, merchant_order_id, preference_id, external_reference...
    const p = await this.fetchPayment(q.payment_id);
    const appointmentId = p?.external_reference ?? q.external_reference ?? '-';
    const status = p?.status ?? q.status ?? 'approved';

    // Muestra una paginita simple desde el backend
    return res.send(`
      <html><body style="font-family: sans-serif">
        <h1>Pago exitoso ✅</h1>
        <p>Turno: <b>${appointmentId}</b></p>
        <p>Payment ID: ${q.payment_id || '-'}</p>
        <p>Estado: ${status}</p>
        <p><a href="/">Volver</a></p>
      </body></html>
    `);
  }

  @Get('failure')
  async failure(@Query() q: any, @Res() res: Response) {
    return res.send(`
      <html><body style="font-family: sans-serif">
        <h1>Pago fallido ❌</h1>
        <p>Payment ID: ${q.payment_id || '-'}</p>
        <p>Estado: ${q.status || 'failure'}</p>
        <p><a href="/">Volver</a></p>
      </body></html>
    `);
  }

  @Get('pending')
  async pending(@Query() q: any, @Res() res: Response) {
    return res.send(`
      <html><body style="font-family: sans-serif">
        <h1>Pago pendiente ⏳</h1>
        <p>Payment ID: ${q.payment_id || '-'}</p>
        <p>Estado: ${q.status || 'pending'}</p>
        <p><a href="/">Volver</a></p>
      </body></html>
    `);
  }
}