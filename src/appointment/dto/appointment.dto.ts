import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDate, IsEnum, IsInt, IsOptional, ValidateNested } from "class-validator";
import { State } from "../interface/appointment.entity.js";
import { PaymentDTO } from "./payment.dto.js";
import { SignDTO } from "./sign.dto.js";


export class AppointmentDTO
{

    @IsDate()
    dateTime?: Date = new Date() 

    @Type(() => Date)
    @IsDate()
    dateTimeAppointment!: Date
    
    @Type(() => Number)
    @IsArray()
    @ArrayNotEmpty()
    service!: number[];
    
    @IsOptional()
    @ValidateNested()
    @Type(() => PaymentDTO)
    payment?: PaymentDTO;
    
    @ValidateNested()
    @Type(() => SignDTO)
    sign!: SignDTO;

}