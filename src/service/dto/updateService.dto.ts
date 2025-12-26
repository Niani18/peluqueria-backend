import { PartialType } from '@nestjs/mapped-types';
import { ServiceDTO } from './service.dto.js';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateServiceDTO extends PartialType(ServiceDTO) {

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  state?: boolean

}
