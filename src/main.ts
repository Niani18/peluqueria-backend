import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { MikroORM } from '@mikro-orm/core';          // <-- desde core
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/filters/all-exeptions.filters.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true, cors: true });
  const cfg = app.get(ConfigService);
  const orm = app.get(MikroORM);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    stopAtFirstError: true,
    exceptionFactory: (errors) => {
      // Te devuelve el array completo de errores de class-validator
      return new BadRequestException(errors);
    },
  }));
  // Ejecutá updateSchema SOLO en dev o si DB_SYNC=1
  const shouldSync =
    cfg.get<string>('NODE_ENV') !== 'production' &&
    cfg.get<number>('DB_SYNC') === 1;

  if (shouldSync) {
    // OJO: solo para dev, puede alterar columnas/índices
    await orm.getSchemaGenerator().updateSchema();
  }

  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(adapterHost)); 

  await app.listen(cfg.get<number>('PORT') ?? 3000);
}
bootstrap();