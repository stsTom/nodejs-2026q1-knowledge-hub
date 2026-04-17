import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersService } from "@/users/users.service";
import { JwtService } from "@nestjs/jwt"

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'ACCESS_TOKEN_SERVICE',
      useFactory: () => new JwtService({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: {
          expiresIn: process.env.TOKEN_EXPIRE_TIME
        }
      })
    },
    {
      provide: 'REFRESH_TOKEN_SERVICE',
      useFactory: () => new JwtService({
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        signOptions: {
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME
        }
      })
    }
  ],
  imports: [UsersService]
})
export class AuthModule {}