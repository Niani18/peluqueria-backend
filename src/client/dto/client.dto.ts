import { IsEmail, IsOptional, IsString, Matches, Length, IsStrongPassword, ValidateNested } from 'class-validator';
import { Transform } from 'class-transformer';
import { User } from '../../auth/interface/user.entity.js';

export class CreateClientDto {

  @IsString() @Length(1, 60)
  @Transform(({ value }) => String(value).trim())
  name!: string;

  @IsString() @Length(1, 60)
  @Transform(({ value }) => String(value).trim())
  surname!: string;

  @IsEmail()
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email!: string;

  @IsString()
  @Transform(({ value }) => String(value).trim())
  @Matches(/^\+?\d{8,15}$/, { message: 'phone: 8–15 dígitos, + opcional' })
  phone!: string;

  @ValidateNested()
  user!: User
  
}