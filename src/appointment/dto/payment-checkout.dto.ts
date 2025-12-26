import { Type } from "class-transformer";
import { IsNumber } from "class-validator";


export class PaymentCheckoutDTO {

  @IsNumber()
  @Type(() => Number )
  appointmentId!: number;

  @IsNumber()
  @Type(() => Number)
  amount!: number;

}