import { PartialType } from "@nestjs/mapped-types";
import { SuppliesDto } from "./supplies.dto.js";

export class SupplyUpdateDto extends PartialType(SuppliesDto) {}