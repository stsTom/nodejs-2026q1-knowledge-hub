import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User, UserResponse } from '../interfaces/user.interface';
import { UsersRepository } from '../interfaces/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import bcrypt from 'bcrypt'

function toUser(raw: any): User {
  return {
    ...raw,
    createdAt: raw.createdAt.getTime(),
    updatedAt: raw.updatedAt.getTime(),
  };
}

function toResponse(user: User): UserResponse {
  const { password, ...response } = user;
  return response;
}

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserResponse[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u) => toResponse(toUser(u)));
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? toUser(user) : undefined;
  }

  async findByLogin(login: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({ where: { login } });
    return user ? toUser(user) : undefined
  }

  async create(dto: CreateUserDto): Promise<UserResponse> {
    const saltRounds = 10
    const hash = await bcrypt.hash(dto.password, saltRounds)

    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        password: hash,
        role: dto.role,
      },
    });
    return toResponse(toUser(user));
  }

  async updatePassword(
    id: string,
    dto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { password: dto.newPassword },
    });
    return toResponse(toUser(user));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
