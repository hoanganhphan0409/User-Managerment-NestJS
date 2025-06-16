import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiPropertyOptional({
    example: 'Phan Hoàng Anh',
    description: 'Họ tên đầy đủ',
  })
  @IsOptional()
  full_name: string;

  @ApiPropertyOptional({
    example: 'email@example.com',
    description: 'Email',
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'admin',
    description: 'Tên đăng nhập (bắt buộc)',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'password',
    description: 'Mật khẩu người dùng (bắt buộc)',
  })
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    example: '0xxx',
    description: 'Số điện thoại',
  })
  @IsOptional()
  @Matches(/^\d+$/, { message: 'Số điện thoại chỉ được chứa chữ số' })
  phone_number: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Đường dẫn avatar',
  })
  @IsOptional()
  avatar: string;
}
