import { IsDate, IsEnum, IsMilitaryTime, ValidateNested } from "class-validator";
import { Week } from "../interface/schedule.entity.js";
import { Type } from "class-transformer";



export class ScheduleDTO
{

    @Type(() => Number)
    @IsEnum(Week)
    day!: Week;

    @Type(() => String)
    @IsMilitaryTime()
    beginTime!: string;

    @Type(() => String)
    @IsMilitaryTime()
    endTime!: string;

}