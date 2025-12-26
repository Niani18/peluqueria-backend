import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Service } from "./interface/service.entity.js";
import { ServiceController } from "./service.controller.js";
import { ServiceService } from "./service.service.js";

@Module({
  imports: [
    MikroOrmModule.forFeature([Service]), 
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService]
})

export class ServiceModule  {}