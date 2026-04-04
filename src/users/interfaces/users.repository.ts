import { User, UserResponse } from './user.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';

/**
 * Abstract repository contract for Users.
 * Swap this implementation (InMemoryUsersRepository → TypeOrmUsersRepository, etc.)
 * without touching the service or controller layer.
 */
export abstract class UsersRepository {
  abstract findAll(): Promise<UserResponse[]>;
  abstract findById(id: string): Promise<User | undefined>;
  abstract create(dto: CreateUserDto): Promise<UserResponse>;
  abstract updatePassword(id: string, dto: UpdatePasswordDto): Promise<UserResponse>;
  abstract delete(id: string): Promise<void>;
}
