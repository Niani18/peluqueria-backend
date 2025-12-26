import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";

export class ServiceTypeDTO {

  @Type(() => String)
  @IsString()
  name!: string;
  
  @Type(() => String)
  @IsString()
  description!: string;

}
