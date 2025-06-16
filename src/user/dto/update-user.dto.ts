import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Phan Hoàng Anh', description: 'Họ và tên người dùng' })
  @IsOptional()
  full_name: string;

  @ApiPropertyOptional({ example: 'email@example.com', description: 'Email người dùng' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin', description: 'Tên đăng nhập', required: true })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password', description: 'Mật khẩu đăng nhập', required: true })
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ example: '09xxx', description: 'Số điện thoại' })
  @IsOptional()
  @Matches(/^\d+$/, { message: 'Số điện thoại chỉ được chứa chữ số' })
  phone_number: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'Link avatar' })
  @IsOptional()
  avatar: string;
}
