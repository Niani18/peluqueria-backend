import { IsString, IsStrongPassword, Matches, MaxLength } from "class-validator";



export class LogInDTO {

    @IsString()
    username!: string;

    @IsString()
    password!: string;
}