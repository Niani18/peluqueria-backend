import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Preference, Payment as MPPayment, MerchantOrder } from 'mercadopago';
import { MercadoPagoClient } from './mercadopago.client';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from '@mikro-orm/core';
import { Appointment, State } from '../appointment/interface/appointment.entity';
import { Payment } from '../appointment/interface/payment.entity';



@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly mp: MercadoPagoClient,
    private readonly config: ConfigService,
    private readonly em: EntityManager,
  ) {}

  // 1) Crear preference (no toca DB)
  async createPreferenceForAppointment(appointmentId: number, amount: number) {
    // ... tu código de arriba

    // 1) Normalizar y validar
    const rawApiBase = this.config.get<string>('API_BASE_URL');
    const apiBase = (rawApiBase ?? '').trim().replace(/\/+$/, ''); // sin espacios ni / final
    const webhook = (this.config.get<string>('MP_WEBHOOK_URL') ?? '').trim();

    if (!apiBase) throw new BadRequestException('API_BASE_URL no configurado');
    if (!webhook || !webhook.startsWith('https://')) {
      throw new BadRequestException('MP_WEBHOOK_URL debe ser https (ngrok)');
    }

    const backUrls = {
      success: `${apiBase}/payments/return/success`,
      failure: `${apiBase}/payments/return/failure`,
      pending: `${apiBase}/payments/return/pending`,
    };

    this.logger.log({ mp_back_urls: backUrls, webhook }); // <-- VER EN CONSOLA LO QUE SE ENVÍA

    // 2) Si querés salir del bloqueo, probá SIN auto_return o con https
    const preferAutoReturn = backUrls.success.startsWith('https://'); // usar auto_return sólo si success es https
    // const preferAutoReturn = true; // o fuerzalo si querés probar

    const preferenceApi = new Preference(this.mp.client);
    try {
      const pref = await preferenceApi.create({
        body: {
          items: [
            {
              id: String(appointmentId),
              title: `Pago turno #${appointmentId}`,
              quantity: 1,
              unit_price: Number(amount),
              currency_id: 'ARS',
            },
          ],
          external_reference: String(appointmentId),
          back_urls: backUrls,
          ...(preferAutoReturn ? { auto_return: 'approved' } : {}), // <-- sólo si dejamos https
          notification_url: webhook,
        },
      });

      return {
        init_point: pref.init_point ?? pref.sandbox_init_point,
        preference_id: pref.id,
      };
    } catch (e: any) {
      this.logger.error('MP preference error', e);
      const cause = e?.cause?.[0]?.description || e?.message || String(e);
      throw new BadRequestException(`MercadoPago error: ${cause}`);
    }
  }
  

  private async processApprovedPayment(mpPayment: any) {
    if (!mpPayment || mpPayment.status !== 'approved') return;

    const appointmentId = Number(mpPayment.external_reference);
    if (!Number.isFinite(appointmentId)) return;

    const appt = await this.em.findOne(Appointment, { id: appointmentId });
    if (!appt) return;

    // IDEMPOTENCIA
    const mpId = String(mpPayment.id);
    const exists = await this.em.findOne(Payment, { mpPaymentId: mpId });
    if (exists) return; // ya procesado

    const payment = new Payment();
    payment.amount = String(mpPayment.transaction_amount);
    payment.paymentDate = mpPayment.date_approved ? new Date(mpPayment.date_approved) : new Date();
    payment.appointment = appt;
    payment.mpPaymentId = mpId; // <-- guardamos el id de MP

    await this.em.persistAndFlush(payment);

    appt.state = State.Finished;
    await this.em.persistAndFlush(appt);
    
  }

  async handleWebhook(query: any, body: any) {
    const topic = query.type || query.topic || body?.type;
    const id = query['data.id'] || query.id || body?.data?.id;

    // 1) payment
    if (topic === 'payment' && id) {
      const mpPaymentApi = new MPPayment(this.mp.client);
      const p = await mpPaymentApi.get({ id });
      await this.processApprovedPayment(p);
      return;
    }

    // 2) merchant_order
    if (topic === 'merchant_order' && id) {
      const moApi = new MerchantOrder(this.mp.client);
      const mo = await moApi.get({ merchantOrderId: String(id) } as any); // ← sin fetch, sin tipos extra

      if (Array.isArray(mo.payments)) {
        const mpPaymentApi = new MPPayment(this.mp.client);
        for (const p of mo.payments) {
          if (p?.status !== 'approved') continue;
          if (p?.id == null) continue;                   // descarta undefined/null

          const full = await mpPaymentApi.get({ id: Number(p.id) }); // o String(p.id)
          await this.processApprovedPayment(full);
        }
      }
      return;
    }

    this.logger.warn({ msg: 'Webhook no procesado', topic, id, query, body });
  }

  

}

