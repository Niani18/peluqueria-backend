import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Appointment } from "./interface/appointment.entity.js";
import { Module } from "@nestjs/common";
import { AppointmentController } from "./appointment.controller.js";
import { AppointmentService } from "./appointment.service.js";
import { PeluqueriaScheduleModule } from "../schedule/schedule.module.js";
import { ServiceModule } from "../service/service.module.js";
import { AppointmentsCronService } from "./appointments-cron.service.js";
import { SuppliesModule } from "../materials/supplies.module.js";
import { PaymentsModule } from "../payments/payment.module.js";

@Module({
    imports : [MikroOrmModule.forFeature([Appointment]), PeluqueriaScheduleModule, ServiceModule, SuppliesModule, PaymentsModule],
    controllers : [AppointmentController],
    providers : [AppointmentService/*, AppointmentsCronService*/]
})
export class AppointmentModule {}