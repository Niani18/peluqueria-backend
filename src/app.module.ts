import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from './database/orm.module.js'; // tu módulo global de MikroORM
import { ClientModule } from './client/client.module.js';
import { ServiceTypeModule } from './service/serviceType.module.js';
import { ServiceModule } from './service/service.module.js';
import { PeluqueriaScheduleModule } from './schedule/schedule.module.js';
import { AppointmentModule } from './appointment/appointment.module.js';
import { SuppliesModule } from './materials/supplies.module.js';
import { ToolsModule } from './materials/tools.module.js';
import { GlobalMiddleware } from './shared/middleware/global.middleware.js';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './shared/interceptors/loggingInterceptor.js';
import { AuthModule } from './auth/auth.module.js';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true, // hace que ConfigService esté disponible en toda la app
      // Podés agregar envFilePath si querés archivos por entorno (ver sección abajo)
      // Esto sirve para ver que valores están en el .env, si no están así tira error, sin más. Esto es gracias al Joi
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'test', 'production').required(),
        PORT: Joi.number().default(3000),
        DB_URL: Joi.string().uri().required(),
        DB_SYNC: Joi.number().valid(0, 1).default(0),
      }),
    }),
    DatabaseModule,
    ClientModule,
    ServiceTypeModule,
    ServiceModule,
    PeluqueriaScheduleModule,
    SuppliesModule,
    ToolsModule,
    AppointmentModule,
    AuthModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    },
  ]
})

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(GlobalMiddleware)
    .forRoutes('*')
  }
}