import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export abstract class PaginationQueryDTO {
    // --- paginación ---
  @Type(() => Number)
  @IsInt() @Min(1) @IsOptional()
  page = 1;

  @Type(() => Number)
  @IsInt() @Min(1) @Max(100) @IsOptional()
  limit = 20;

  @IsString() @IsOptional()
  sort?: string;
}