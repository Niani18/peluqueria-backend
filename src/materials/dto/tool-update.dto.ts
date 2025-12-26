import { PartialType } from "@nestjs/mapped-types";
import { ToolsDto } from "./tools.dto.js";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export class ToolUpdateDto extends PartialType(ToolsDto) {

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  state!: boolean;

}