import { Type } from "class-transformer";
import { Equals, IsInt, IsOptional, IsString, IsStrongPassword, Matches, MaxLength, MinLength, ValidateNested } from "class-validator";
import { CreateClientDto } from "../../client/dto/client.dto.js";


export class RegisterDTO {

    @IsString()
    username!: string;

    @IsString()
    @MaxLength(16)
    @IsStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 0
    })
    password!: string;

    @IsString()
    @MaxLength(16)
    @IsStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 0
    })
    passwordConfirm!: string;

    @ValidateNested()
    @Type(() => CreateClientDto)
    client?: CreateClientDto
    
}