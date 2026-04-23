import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UnitsService } from './units.service';

import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { JWTPayload } from 'src/auth/types/jwt-payload.type';

import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@UseGuards(JwtAuthGuard)
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  create(
    @Body() createUnitDto: CreateUnitDto,
    @CurrentUser() user: JWTPayload,
  ) {
    return this.unitsService.create(user.id, createUnitDto);
  }

  @Get()
  findAll(@CurrentUser() user: JWTPayload) {
    return this.unitsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JWTPayload) {
    return this.unitsService.findOne(id, user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: JWTPayload,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return this.unitsService.update(id, user.id, updateUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JWTPayload) {
    return this.unitsService.remove(id, user.id);
  }
}
