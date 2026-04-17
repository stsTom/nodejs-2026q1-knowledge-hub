import { UsersService } from "@/users/users.service";
import { BadRequestException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    @Inject('ACCESS_TOKEN_SERVICE') private accessTokenService: JwtService,
    @Inject('REFRESH_TOKEN_SERVICE') private refreshTokenService: JwtService
  ) {}

  async signUp(dto: AuthDto){
    const exists = await this.userService.findByLogin(dto.login)
    
    if (exists) {
      throw new BadRequestException(`${dto.login} already exists`)
    }

    return this.userService.create(dto)
  }

  async login(dto: AuthDto){
    const user = await this.userService.findByLogin(dto.login)

    if (!user || dto.password !== user.password) {
      throw new ForbiddenException(`${dto.login} doesn't exist or password is invalid`)
    }

    const accessToken = this.accessTokenService.sign(user)
    const refreshToken = this.refreshTokenService.sign(user)
    
    return { accessToken, refreshToken }
  }
}