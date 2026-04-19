import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { validate as isUuid } from 'uuid';
import { Role } from '@prisma/client';
import { UsersRepository } from './interfaces/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User, UserResponse } from './interfaces/user.interface';
import { AuthenticatedUser } from '../rbac/current-user.decorator';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(): Promise<UserResponse[]> {
    return this.usersRepository.findAll();
  }

  async findOne(id: string): Promise<UserResponse> {
    this.assertValidUuid(id);
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    const { password, ...response } = user;
    return response;
  }

  async findByLogin(login: string): Promise<User | undefined> {
    return this.usersRepository.findByLogin(login);
  }

  async create(dto: CreateUserDto): Promise<UserResponse> {
    return this.usersRepository.create(dto);
  }

  async updatePassword(
    id: string,
    dto: UpdatePasswordDto,
    requester: AuthenticatedUser,
  ): Promise<UserResponse> {
    this.assertValidUuid(id);

    if (requester.role === Role.editor && requester.id !== id) {
      throw new ForbiddenException('You can only update your own password');
    }

    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }
    return this.usersRepository.updatePassword(id, dto);
  }

  async remove(id: string): Promise<void> {
    this.assertValidUuid(id);
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    await this.usersRepository.delete(id);
  }

  private assertValidUuid(id: string): void {
    if (!isUuid(id)) {
      throw new BadRequestException(`"${id}" is not a valid UUID`);
    }
  }
}