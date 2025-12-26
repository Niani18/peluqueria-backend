import { IsOptional, IsString } from "class-validator";
import { PaginationQueryDTO } from "../../shared/dto/pagination.dto.js";

export class SuppliesQueryDto extends PaginationQueryDTO{

  @IsString() @IsOptional()
  name?: string;

  @IsString() @IsOptional()
  serviceName?: string;

}