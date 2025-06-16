import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { successResponse } from 'src/utils/response.helper';
import { ResponseType } from 'src/utils/response.type';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/role-guard/role.guard';
import { Roles } from 'src/utils/role.decorator';
import { Role } from './entities/user.entity';
import { response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseType> {
    const response = await this.userService.createUser(createUserDto);
    return successResponse(response, 'Tạo tài khoản thành công');
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('list')
  async findAll(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('search') search: string = '',
  ): Promise<ResponseType> {
    const response = await this.userService.findAll(
      Number(page),
      Number(size),
      search,
    );
    return successResponse(response, 'Lấy danh sách tài khoản thành công');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req): Promise<ResponseType> {
    const currentUser = req.user;
    const response = await this.userService.findUserById(+currentUser.id);
    return successResponse(
      response,
      'Lấy thông tin chi tiết tài khoản thành công',
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  async finduserById(@Param('id') id: string): Promise<ResponseType> {
    const response = await this.userService.findUserById(+id);
    return successResponse(
      response,
      'Lấy thông tin chi tiết tài khoản thành công',
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: number,
    @Request() req,
  ): Promise<ResponseType> {
    const currentUser = req.user;
    const response = await this.userService.updateUserById(
      id,
      updateUserDto,
      currentUser,
    );
    return successResponse(response, 'Cập nhật tài khoản thành công');
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ): Promise<ResponseType> {
    const currentUser = req.user;
    const response = await this.userService.updateUserById(
      +currentUser.id,
      updateUserDto,
      currentUser,
    );
    return successResponse(response, 'Cập nhật tài khoản thành công');
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Request() req) {
    const currentUser = req.user;
    const response = await this.userService.softDeleteUserById(
      +id,
      currentUser,
    );
    return successResponse(response, 'Xoá tài khoản thành công');
  }
}
