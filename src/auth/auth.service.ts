import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private redisService: RedisService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('Tài khoản không tồn tại');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ForbiddenException('Mật khẩu hoặc username không chính xác');
    }
    const payload = { sub: user.id, role: user.role };
    const token = await this.generateToken(payload);
    return token;
  }

  async register(newUser: CreateUserDto) {
    const user = await this.userService.createUser(newUser);
    return user;
  }

  async logout(accessToken: string, refreshToken?: string): Promise<void> {
    const decoded = this.jwtService.decode(accessToken) as any;
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    if (expiresIn > 0) {
      await this.redisService.blacklistToken(accessToken, expiresIn);
    }
    if (refreshToken) {
      const decodedRefresh = this.jwtService.decode(refreshToken) as any;
      const expiresIndRefresh = decodedRefresh.exp - Math.floor(Date.now() / 1000);
      if (expiresIndRefresh > 0) {
        await this.redisService.blacklistToken(refreshToken, expiresIndRefresh);
      }
    }
  }

  async generateToken(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '4d',
      secret: process.env.JWT_SECRET,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(userId: number) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('Tài khoản không tồn tại');
    }

    const payload = { sub: user.id, role: user.role };
    const token = this.generateToken(payload);
    return token;
  }

  async changePassword(data: ChangePasswordDto) {
    const user = await this.userService.findUserById(data.user_request_id);
    if (!user) {
      throw new ForbiddenException('Tài khoản không tồn tại');
    }

    const user2 = await this.userService.findUserById(data.user_id);
    if (!user2) {
      throw new ForbiddenException('Tài khoản không tồn tại');
    }

    if (user.id !== data.user_id) {
      throw new ForbiddenException(
        'Bạn không có quyền đổi mật khẩu của tài khoản khác',
      );
    }

    const isMatch = await bcrypt.compare(data.old_password, user.password);
    if (!isMatch) {
      throw new ForbiddenException('Mật khẩu cũ không chính xác');
    }

    const hashedPassword = await bcrypt.hash(data.new_password, 10);
    user2.password = hashedPassword;
    const newuser = await this.userRepository.save(user2);
    return newuser;
  }
}
