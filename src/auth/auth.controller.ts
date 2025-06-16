import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { successResponse } from 'src/utils/response.helper';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'Đăng nhập thành công' })
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return successResponse(token, 'Đăng nhập thành công');
  }

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: 'Đăng ký thành công' })
  async register(@Body() body: CreateUserDto) {
    const response = await this.authService.register(body);
    return successResponse(response, 'Đăng ký thành công');
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('change-password')
  @ApiOperation({ summary: 'Đổi mật khẩu' })
  @ApiBearerAuth()
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Đổi mật khẩu thành công' })
  async changePassword(@Request() req, @Body() data: ChangePasswordDto) {
    const user = req.user;
    data.user_request_id = user.id;
    const response = await this.authService.changePassword(data);
    return successResponse(response, 'Đổi mật khẩu thành công');
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiOperation({ summary: 'Refresh token' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Token đã được refresh' })
  async refreshToken(@Request() req) {
    const user = req.user;
    const token = await this.authService.refreshToken(user.id);
    return successResponse(token, 'Token đã refresh');
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Đăng xuất' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Đăng xuất thành công' })
  async logout(@Request() req) {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');
    const refreshToken = req.headers['x-refresh-token']?.toString();

    const response = await this.authService.logout(accessToken, refreshToken);
    return successResponse(response, 'Đăng xuất thành công');
  }
}
