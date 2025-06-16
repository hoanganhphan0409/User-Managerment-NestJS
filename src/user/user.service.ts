import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const username = this.configService.get<string>('DEFAULT_ADMIN_USERNAME');
    const rawPassword = this.configService.get<string>(
      'DEFAULT_ADMIN_PASSWORD',
    );

    const existingAdmin = await this.userRepository.findOneBy({ username });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      const newAdmin = this.userRepository.create({
        username,
        password: hashedPassword,
        role: Role.ADMIN,
      });

      await this.userRepository.save(newAdmin);
    }
  }

  async findAll(
    page: number = 1,
    size: number = 10,
    search: string = '',
  ): Promise<{ data: User[]; total: number }> {
    const skip = (page - 1) * size;

    const whereCondition = search
      ? [
          { full_name: ILike(`%${search}%`) },
          { phone_number: ILike(`%${search}%`) },
        ]
      : {};

    const [data, total] = await this.userRepository.findAndCount({
      where: whereCondition,
      skip,
      take: size,
      order: { created_at: 'DESC' },
    });

    return { data, total };
  }

  async findUserById(id: number): Promise<User | null> {
    const user = this.userRepository.findOneBy({ id: id });
    return user;
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const findUser = await this.findByUsername(user.username);
    if (findUser) {
      throw new ConflictException('Đã có tài khoản sử dụng username này');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    const newUser = await this.userRepository.save(user);
    return newUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userInfor = await this.userRepository.findOneBy({ email: email });
    return userInfor;
  }

  async findByUsername(username: string): Promise<User | null> {
    const userInfor = await this.userRepository.findOneBy({
      username,
    });
    return userInfor;
  }

  async softDeleteUserById(
    id: number,
    currentUser: { id: number; role: string },
  ): Promise<void> {
    const targetUser = await this.findUserById(id);

    if (!targetUser) {
      throw new NotFoundException('Tài khoản không tồn tại');
    }

    if (currentUser.role !== Role.ADMIN && currentUser.id !== targetUser.id) {
      throw new ForbiddenException('Bạn không có quyền xóa tài khoản này');
    }

    await this.userRepository.softDelete(id);
  }

  async updateUserById(
    id: number,
    user: UpdateUserDto,
    currentUser: { id: number; role: string },
  ): Promise<void> {
    const targetUser = await this.findUserById(id);

    if (!targetUser) {
      throw new NotFoundException('Tài khoản không tồn tại');
    }

    const existUser = await this.findByUsername(user.username || '');
    if (existUser && targetUser.username !== user.username) {
      throw new ConflictException('Username đã được sử dụng');
    }

    if (currentUser.role !== Role.ADMIN && currentUser.id !== targetUser.id) {
      throw new ForbiddenException('Bạn không có quyền cập nhật tài khoản này');
    }

    await this.userRepository.update(id, user);
  }
}
