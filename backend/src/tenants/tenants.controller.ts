import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';

import { TenantsService } from './tenants.service';

import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { JWTPayload } from 'src/auth/types/jwt-payload.type';

import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@UseGuards(JwtAuthGuard)
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  create(@Body() createTenantDto: CreateTenantDto, @CurrentUser() user: JWTPayload) {
    return this.tenantsService.create(user.id, createTenantDto);
  }

  @Get()
  findAll(@CurrentUser() user: JWTPayload) {
    return this.tenantsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JWTPayload) {
    return this.tenantsService.findOne(id, user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTenantDto, @CurrentUser() user: JWTPayload) {
    return this.tenantsService.update(id, user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JWTPayload) {
    return this.tenantsService.remove(id, user.id);
  }
}
