import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        driver: MySqlDriver, // 👈 driver explícito
        clientUrl: cfg.get<string>('DB_URL'),
        entities: ['dist/**/*.entity.js'],
        entitiesTs: ['src/**/*.entity.ts'],
        registerRequestContext: true, // cada request tiene su propio EntityManager
        debug: cfg.get<string>('NODE_ENV') !== 'production', // activa logs solo en dev
        highlighter: new SqlHighlighter(), // resalta las queries en consola
        schemaGenerator: {
          disableForeignKeys: true,
          createForeignKeyConstraints: true,
          ignoreSchema: [],
        },
      }),
    }),
  ],
  // Nota: no exportamos MikroOrmModule porque este módulo es global
})
export class DatabaseModule {}