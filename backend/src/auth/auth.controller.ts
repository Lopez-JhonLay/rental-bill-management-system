import { Controller, Post, Body, Res, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';

import { JwtAuthGuard } from './jwt.auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JWTPayload } from './types/jwt-payload.type';

import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto.full_name, dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: LoginDTO, @Res() res: Response) {
    return this.authService.login(dto.email, dto.password, res);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: JWTPayload) {
    return this.authService.me(user.id);
  }
}
