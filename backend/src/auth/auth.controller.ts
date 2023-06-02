import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignupDto, SigninDto } from './dtos';
import { AuthService } from './auth.service';
import { Public } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @Public()
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  @Public()
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }
}
