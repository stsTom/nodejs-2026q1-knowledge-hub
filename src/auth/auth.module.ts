import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'ACCESS_TOKEN_SERVICE',
      useFactory: () => new JwtService({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: {
          expiresIn: process.env.TOKEN_EXPIRE_TIME,
        },
      }),
    },
    {
      provide: 'REFRESH_TOKEN_SERVICE',
      useFactory: () => new JwtService({
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        signOptions: {
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        },
      }),
    },
  ],
})
export class AuthModule {}