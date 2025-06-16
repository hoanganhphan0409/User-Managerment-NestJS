import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldpass', description: 'Mật khẩu cũ' })
  @IsString()
  @IsNotEmpty()
  old_password: string;

  @ApiProperty({ example: 'newpass', description: 'Mật khẩu mới' })
  @IsString()
  @IsNotEmpty()
  new_password: string;

  @ApiProperty({ example: 1, description: 'Id người dùng cần đổi mật khẩu' })
  @IsNumber()
  user_id: number;

  @ApiProperty({ example: 1, description: 'Id người yêu cầu đổi mật khẩu (lấy từ token)' })
  @IsNumber()
  user_request_id: number;
}
