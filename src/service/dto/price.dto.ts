import { IsDecimal, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class PriceDTO {

    @Type(() => String)
    @IsDecimal({ force_decimal: true, decimal_digits: '2' })
    amount!: string;
  
}




