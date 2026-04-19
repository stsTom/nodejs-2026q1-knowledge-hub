import { UsersService } from '@/users/users.service';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshDto } from './dto/refresh.dto';
import { verify, JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export interface TokenPayload {
  userId: string;
  login: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    @Inject('ACCESS_TOKEN_SERVICE') private accessTokenService: JwtService,
    @Inject('REFRESH_TOKEN_SERVICE') private refreshTokenService: JwtService,
  ) {}

  async signUp(dto: AuthDto) {
    const exists = await this.userService.findByLogin(dto.login);

    if (exists) {
      throw new BadRequestException(`Login "${dto.login}" is already taken`);
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    return this.userService.create({
      ...dto,
      password: hashedPassword,
      role: 'viewer',
    });
  }

  async login(dto: AuthDto) {
    const user = await this.userService.findByLogin(dto.login);

    const passwordMatches =
      user && (await bcrypt.compare(dto.password, user.password));

    if (!user || !passwordMatches) {
      throw new ForbiddenException('Login or password is incorrect');
    }

    const payload: TokenPayload = {
      userId: user.id,
      login: user.login,
      role: user.role,
    };

    return this.createTokens(payload);
  }

  async refreshTokens(dto: RefreshDto) {
    try {
      const decoded = verify(
        dto.refreshToken,
        process.env.JWT_REFRESH_SECRET,
      ) as JwtPayload & TokenPayload;

      const payload: TokenPayload = {
        userId: decoded.userId,
        login: decoded.login,
        role: decoded.role,
      };

      return this.createTokens(payload);
    } catch {
      throw new ForbiddenException(
        'Authentication failed: refresh token is invalid or has expired',
      );
    }
  }

  async createTokens(payload: TokenPayload) {
    const accessToken = this.accessTokenService.sign(payload);
    const refreshToken = this.refreshTokenService.sign(payload);
    return { accessToken, refreshToken };
  }
}