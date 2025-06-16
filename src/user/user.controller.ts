import {
  Controller,
  Get,
  Post,
  Body,
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

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post('create')
  @ApiOperation({ summary: 'Tạo tài khoản mới' })
  @ApiResponse({ status: 201, description: 'Tạo tài khoản thành công' })
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseType> {
    const response = await this.userService.createUser(createUserDto);
    return successResponse(response, 'Tạo tài khoản thành công', 201);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('list')
  @ApiOperation({ summary: 'Lấy danh sách tài khoản' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'size', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'hoanganh' })
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
  @ApiOperation({ summary: 'Lấy thông tin tài khoản đang đăng nhập' })
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
  @ApiOperation({ summary: 'Lấy thông tin chi tiết tài khoản theo id' })
  @ApiParam({ name: 'id', required: true, example: 1 })
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
  @ApiOperation({ summary: 'Cập nhật thông tin tài khoản' })
  @ApiParam({ name: 'id', required: true, example: 1 })
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
  @ApiOperation({ summary: 'Cập nhật tài khoản đang đăng nhập' })
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
  @ApiOperation({ summary: 'Xoá tài khoản' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  async deleteUser(@Param('id') id: string, @Request() req) {
    const currentUser = req.user;
    const response = await this.userService.softDeleteUserById(
      +id,
      currentUser,
    );
    return successResponse(response, 'Xoá tài khoản thành công');
  }
}
