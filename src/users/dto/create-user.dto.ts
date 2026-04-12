import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'login is required' })
  login: string;

  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  password: string;

  @IsOptional()
  @IsEnum(Role, {
    message: `role must be one of: ${Object.values(Role).join(', ')}`,
  })
  role?: Role;
}
