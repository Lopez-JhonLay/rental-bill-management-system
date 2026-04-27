// src/settings/settings.controller.ts
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';

import { SettingsService } from './settings.service';

import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { JWTPayload } from 'src/auth/types/jwt-payload.type';

import { CreateRateDto } from './dto/create-rate.dto';

@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('rates')
  findAllRates(@CurrentUser() user: JWTPayload) {
    return this.settingsService.findAllRates(user.id);
  }

  @Post('rates')
  create(@Body() dto: CreateRateDto, @CurrentUser() user: JWTPayload) {
    return this.settingsService.create(user.id, dto);
  }
}
