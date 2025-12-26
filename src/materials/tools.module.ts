import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Tools } from "./interface/materials.entity.js";
import { ToolsController } from "./tools.controller.js";
import { ToolsService } from "./tools.service.js";

@Module({
  imports: [
    MikroOrmModule.forFeature([Tools]), 
  ],
  controllers: [ToolsController],
  providers: [ToolsService],
})

export class ToolsModule  {}