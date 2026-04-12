// export enum UserRole {
//   ADMIN = 'admin',
//   EDITOR = 'editor',
//   VIEWER = 'viewer',
// }

export { Role } from '@prisma/client';

export interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  role: import('@prisma/client').Role;
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}

// Password is excluded from all API responses
export type UserResponse = Omit<User, 'password'>;
