import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { validate as isUuid } from 'uuid';
import { UsersRepository } from './interfaces/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserResponse } from './interfaces/user.interface';

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

  async findByLogin(login: string): Promise<UserResponse> { //should the password be sent here?
    return this.usersRepository.findByLogin(login);
  }

  async create(dto: CreateUserDto): Promise<UserResponse> {
    return this.usersRepository.create(dto);
  }

  async updatePassword(
    id: string,
    dto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    this.assertValidUuid(id);
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
