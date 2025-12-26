import { Body, Controller, Post, Query, Res } from '@nestjs/common';
import { PaymentsService } from './payment.service.js';
import type { Response } from 'express';
import { Public } from '../shared/decorators.js';

@Controller('payments')
@Public()
export class PaymentsWebhookController {
  constructor(private readonly payments: PaymentsService) {}

  // IMPORTANTE: dejar público (sin guards ni roles), MP no se autenticará con tu esquema
  @Post('webhook')
  async webhook(@Query() query: any, @Body() body: any, @Res() res: Response) {
    await this.payments.handleWebhook(query, body);
    res.status(200).send('OK');
  }
}