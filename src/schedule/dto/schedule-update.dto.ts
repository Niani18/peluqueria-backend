import { PartialType } from "@nestjs/mapped-types";
import { ScheduleDTO } from "./schedule.dto.js";

export class ScheduleUpdateDto extends PartialType(ScheduleDTO) {}