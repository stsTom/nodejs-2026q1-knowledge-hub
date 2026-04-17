import { UsersService } from "@/users/users.service";
import { BadRequestException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { RefreshDto } from "./dto/refresh.dto";
import { verify } from "jsonwebtoken";

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

    const payload = { sub: user.id }
    const tokens = await this.createTokens(payload)
    
    return tokens
  }
  
  async refreshTokens(dto: RefreshDto){
    try{
      const valid = verify(dto.refreshToken, process.env.JWT_SECRET_REFRESH_KEY)
      const newTokens = await this.createTokens(valid.sub)
      
      return newTokens
    }catch(error){
      throw new ForbiddenException(`Authentication failed: refresh token is invalid or it has expired`)
    }
  }

  async createTokens(payload){
    const accessToken = this.accessTokenService.sign(payload)
    const refreshToken = this.refreshTokenService.sign(payload)

    return { accessToken, refreshToken }
  }
}