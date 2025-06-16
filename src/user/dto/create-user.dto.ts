import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  full_name: string;
  @IsOptional()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
  @IsOptional()
  phone_number: string;
  @IsOptional()
  avatar: string;
}
