// src/bills/bills.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BillsService } from './bills.service';

import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JWTPayload } from '../auth/types/jwt-payload.type';

import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

@UseGuards(JwtAuthGuard)
@Controller('bills')
export class BillsController {
  constructor(private billsService: BillsService) {}

  @Post()
  create(@Body() dto: CreateBillDto, @CurrentUser() user: JWTPayload) {
    return this.billsService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: JWTPayload, @Query('month') month?: string) {
    return this.billsService.findAll(user.id, month);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JWTPayload) {
    return this.billsService.findOne(id, user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBillDto,
    @CurrentUser() user: JWTPayload,
  ) {
    return this.billsService.update(id, user.id, dto);
  }

  @Put(':id/confirm')
  confirm(
    @Param('id') id: string,
    @CurrentUser() user: JWTPayload,
    @Query('force') force?: string,
  ) {
    return this.billsService.confirm(id, user.id, force === 'true');
  }

  @Put(':id/recompute')
  recompute(@Param('id') id: string, @CurrentUser() user: JWTPayload) {
    return this.billsService.recompute(id, user.id);
  }
}
