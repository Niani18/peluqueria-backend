import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";
import { PaginationQueryDTO } from "../../shared/dto/pagination.dto.js";


export class ServiceQueryDTO extends PaginationQueryDTO
{

    @IsInt()
    @IsOptional()
    serviceType: number;

    @IsInt()
    @IsOptional()
    minDuration: number;

    @IsInt()
    @IsOptional()
    maxDuration: number;

    @IsString()
    @IsOptional()
    nameLike: string;

    @IsBoolean()
    @IsOptional()
    state: boolean

}