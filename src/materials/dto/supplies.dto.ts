import { IsString, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class SuppliesDto {

  @IsString()
  @Transform(({ value }) => String(value).trim())
  name!: string;

  @IsString()
  @Transform(({ value }) => String(value).trim())
  description!: string;

  @IsInt() @Min(0)
  stock!: number;
  
}