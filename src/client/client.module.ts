import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Client } from "./interface/client.entity.js";
import { ClientController } from "./client.controller.js";
import { ClientService } from "./client.service.js";


@Module({
  imports: [
    MikroOrmModule.forFeature([Client]), 
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService]
})
export class ClientModule {}