import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig } from 'mercadopago';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MercadoPagoClient {
  public client: MercadoPagoConfig;
  constructor(private readonly config: ConfigService) {
    this.client = new MercadoPagoConfig({
      accessToken: this.config.getOrThrow<string>('MP_ACCESS_TOKEN'),
    });
  }
}