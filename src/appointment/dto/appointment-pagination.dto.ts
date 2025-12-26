import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min, IsISO8601, IsIn, IsBooleanString, IsNumberString } from 'class-validator';
import { PaginationQueryDTO } from '../../shared/dto/pagination.dto.js';


export class AppointmentPaginatioQueryDTO extends PaginationQueryDTO {
  // --- filtros negocio ---
  /** Rango sobre a.dateTimeAppointment */
  @IsISO8601({ strict: false }) @IsOptional()
  from?: string;

  @IsISO8601({ strict: false }) @IsOptional()
  to?: string;

  @IsNumberString() @IsOptional()
  clientId?: string;

  /** Filtra turnos que incluyan este servicio (M2M) */
  @IsNumberString() @IsOptional()
  serviceId?: string;

  /** 'C' (Confirmated) | 'F' (Finished) */
  @IsString() @IsOptional()
  state?: string;
}