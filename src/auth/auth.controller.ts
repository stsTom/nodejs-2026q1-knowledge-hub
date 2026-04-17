import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common'
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto)
  }
}