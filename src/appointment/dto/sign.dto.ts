import { Type } from "class-transformer";
import { IsDate, IsDecimal, IsDefined, IsNotEmpty, IsOptional } from "class-validator";


export class SignDTO 
{

    @IsDefined()
    @Type(() => String)
    @IsNotEmpty({ message: "Ammount value is required." })
    @IsDecimal({ force_decimal: true, decimal_digits: '2' })
    amount!: string;
    
}