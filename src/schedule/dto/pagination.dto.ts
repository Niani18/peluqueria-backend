import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt, IsOptional, IsString, Max, Min,
} from 'class-validator';
import { PaginationQueryDTO } from '../../shared/dto/pagination.dto.js';
import { Week } from '../interface/schedule.entity.js';


export class ScheduleQueryDTO extends PaginationQueryDTO {

  @IsEnum(Week)
  @IsOptional()
  day?: Week;
  
}