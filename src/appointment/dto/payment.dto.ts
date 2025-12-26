import { Type } from "class-transformer";
import { IsDate, IsDecimal, IsInt, IsNotEmpty, IsOptional } from "class-validator";


export class PaymentDTO 
{

    @Type(() => String)
    @IsDecimal({ force_decimal: true, decimal_digits: '2' })
    amount!: string;

    @Type(() => Number)
    @IsInt()
    appointment!: number;
    
}