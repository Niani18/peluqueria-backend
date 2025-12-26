import { IsInt, IsNumber, IsString, ValidateNested, IsDefined, IsArray, ArrayNotEmpty, ArrayUnique, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PriceDTO } from './price.dto';

export class ServiceDTO {

  @Type(() => String)
  @IsString()
  name!: string;

  @Type(() => String)
  @IsString()
  description!: string;

  @Type(() => Number)        // <-- convierte "10" a 10 si viniera como string
  @IsInt()
  @Min(1)
  duration!: number;

  @Type(() => Number)
  @IsInt()
  serviceType!: number;

  @Type(() => Number)
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  tools!: number[];

  @Type(() => Number)
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  supplies!: number[];

  @IsDefined()               // <-- exige que venga price
  @ValidateNested()
  @Type(() => PriceDTO)      // <-- transforma el objeto anidado a PriceDTO
  price!: PriceDTO;
}