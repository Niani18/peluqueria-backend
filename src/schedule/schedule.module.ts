import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Schedule } from "./interface/schedule.entity.js";
import { ScheduleService } from "./schedule.service.js";
import { ScheduleController } from "./schedule.controller.js";



@Module({
    imports: [MikroOrmModule.forFeature([Schedule])],
    controllers: [ScheduleController],
    providers: [ScheduleService],
    exports: [ScheduleService]
})
export class PeluqueriaScheduleModule {}