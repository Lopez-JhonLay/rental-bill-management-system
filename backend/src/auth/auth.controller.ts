import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body('full_name') fullName: string, @Body('email') email: string, @Body('password') password: string) {
    return this.authService.register(fullName, email, password);
  }

  @Post('login')
  login(@Body('email') email: string, @Body('password') password: string, @Res() res: Response) {
    return this.authService.login(email, password, res);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
