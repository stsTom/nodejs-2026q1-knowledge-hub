import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User, UserResponse, UserRole } from '../interfaces/user.interface';
import { UsersRepository } from '../interfaces/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@Injectable()
export class InMemoryUsersRepository implements UsersRepository {
  private readonly users: Map<string, User> = new Map();

  private toResponse(user: User): UserResponse {
    const { password, ...response } = user;
    return response;
  }

  async findAll(): Promise<UserResponse[]> {
    return Array.from(this.users.values()).map(this.toResponse);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async create(dto: CreateUserDto): Promise<UserResponse> {
    const now = Date.now();
    const user: User = {
      id: uuidv4(),
      login: dto.login,
      password: dto.password,
      role: dto.role ?? UserRole.VIEWER,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(user.id, user);
    return this.toResponse(user);
  }

  async updatePassword(id: string, dto: UpdatePasswordDto): Promise<UserResponse> {
    const user = this.users.get(id);
    const updated: User = {
      ...user,
      password: dto.newPassword,
      updatedAt: Date.now(),
    };
    this.users.set(id, updated);
    return this.toResponse(updated);
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}
