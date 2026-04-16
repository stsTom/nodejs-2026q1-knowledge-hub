import { UsersService } from "@/users/users.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async signUp(dto: AuthDto){
    const exists = await this.userService.findByLogin(dto.login)
    
    if (exists) {
      throw new BadRequestException(`${dto.login} already exists`)
    }

    return this.userService.create(dto)
  }

  async login(){
    
  }
}