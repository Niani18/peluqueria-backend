import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { APP_GUARD } from "@nestjs/core";
import { ClientModule } from "../client/client.module.js";
import { AuthGuard } from "./auth.guard.js";
import { RolesGuard } from "./roles.guard.js";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { User } from "./interface/user.entity.js";

@Module({
  imports: [ClientModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1h" }
      })
    }),
    MikroOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AuthModule{}