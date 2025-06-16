import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { successResponse } from 'src/utils/response.helper';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RolesGuard } from './role-guard/role.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return successResponse(token, 'Đăng nhập thành công');
  }

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    const response = await this.authService.register(body);
    return successResponse(response, 'Đăng ký thành công');
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('change-password')
  async changePassword(@Request() req, @Body() data: ChangePasswordDto) {
    const user = req.user;
    data.user_request_id = user.id;
    const response = await this.authService.changePassword(data);
    return successResponse(response, 'Đổi mật khẩu thành công');
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refreshToken(@Body() body: RefreshTokenDto) {
    const token = await this.authService.refreshToken(body.user_id);
    return successResponse(token, 'Token đã refresh');
  }
}
