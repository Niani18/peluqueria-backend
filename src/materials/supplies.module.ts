import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Supplies } from "./interface/materials.entity.js";
import { SuppliesController } from "./supplies.controller.js";
import { SuppliesService } from "./supplies.service.js";

@Module({
  imports: [
    MikroOrmModule.forFeature([Supplies]), 
  ],
  controllers: [SuppliesController],
  providers: [SuppliesService],
  exports: [SuppliesService],
})

export class SuppliesModule  {}