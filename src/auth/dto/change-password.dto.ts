import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';
export class ChangePasswordDto {
  old_password: string;
  @IsString()
  @IsNotEmpty()
  new_password: string;
  @IsNumber()
  user_id: number;
  user_request_id: number;
}
