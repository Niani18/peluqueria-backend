import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ToolsDto {

  @IsString()
  @Transform(({ value }) => String(value).trim())
  name!: string;

  @IsString()
  @Transform(({ value }) => String(value).trim())
  description!: string;

}