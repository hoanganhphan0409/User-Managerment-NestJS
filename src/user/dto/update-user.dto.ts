import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  full_name?: string;
  username?: string;
  email?: string;
  password?: string;
  phone_number?: string;
  avatar?: string;
}
