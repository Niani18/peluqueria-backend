import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min, IsISO8601, IsIn, IsBooleanString, IsNumberString, IsEnum, IsBoolean} from 'class-validator';
import { PaginationQueryDTO } from '../../shared/dto/pagination.dto.js';


export class ClientQueryDto extends PaginationQueryDTO {

  @IsString() @IsOptional()
  name?: string;

  @IsString() @IsOptional()
  surname?: string;  

  @IsString() @IsOptional()
  state?: string;

}