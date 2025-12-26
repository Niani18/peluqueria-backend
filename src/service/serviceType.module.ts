import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ServiceType } from "./interface/serviceType.entity.js";
import { ServiceTypeController } from "./serviceType.controller.js";
import { ServiceTypeService } from "./serviceType.service.js";

@Module({
  imports: [
    MikroOrmModule.forFeature([ServiceType]), 
  ],
  controllers: [ServiceTypeController],
  providers: [ServiceTypeService],
})

export class ServiceTypeModule  {}