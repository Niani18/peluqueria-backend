import { IsBoolean, IsOptional, IsString } from "class-validator";
import { PaginationQueryDTO } from "../../shared/dto/pagination.dto.js";

export class ToolsQueryDto extends PaginationQueryDTO{

  @IsString() @IsOptional()
  name?: string;

  @IsString() @IsOptional()
  serviceName?: string;

  @IsBoolean() @IsOptional()
  state?: boolean

}