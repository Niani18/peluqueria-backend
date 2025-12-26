import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MercadoPagoClient } from './mercadopago.client';
import { PaymentsService } from './payment.service.js';
import { PaymentsWebhookController } from './payment.controller.js';
import { Appointment } from '../appointment/interface/appointment.entity';
import { Payment } from '../appointment/interface/payment.entity';
import { PaymentsReturnController } from './payment.return.controller.js';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forFeature([Appointment, Payment]),
  ],
  providers: [MercadoPagoClient, PaymentsService],
  controllers: [PaymentsWebhookController, PaymentsReturnController],
  exports: [PaymentsService],
})
export class PaymentsModule {}