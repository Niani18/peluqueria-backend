import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EntityManager } from '@mikro-orm/core';
import { Appointment, State } from './interface/appointment.entity.js';

@Injectable()
export class AppointmentsCronService {
  private readonly logger = new Logger(AppointmentsCronService.name);
  constructor(private readonly em: EntityManager) {}

  // Corre todos los días a las 00:00 (hora Buenos Aires-AR)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async markFinishedDaily() {
    // A esta hora el scheduler ya está en 00:00 local por la timeZone
    const cutoff = new Date(); // inicio del día actual (00:00)

    // Cierra solo los Confirmated de días anteriores
    const affected = await this.em.nativeUpdate(
      Appointment,
      {
        state: State.Confirmated,
        dateTimeAppointment: { $lt: cutoff }, // estrictamente antes de hoy
      },
      {
        state: State.Finished,
      },
    );

    if (affected > 0) {
      this.logger.log(`Turnos auto-finalizados (cierre diario): ${affected}`);
    }
  }
}
