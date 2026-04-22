import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';

import { JWTPayload } from 'src/auth/types/jwt-payload.type';

import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  // CREATE A UNIT
  async create(userId: string, createUnitDto: CreateUnitDto) {
    return this.prisma.unit.create({
      data: {
        user_id: userId,
        unit_name: createUnitDto.unit_name,
        monthly_rent: createUnitDto.monthly_rent,
      },
    });
  }

  // GET ALL UNITS
  async findAll(userId: string) {
    return this.prisma.unit.findMany({
      where: { user_id: userId },
      include: { tenant: true }, // include tenant info
    });
  }

  // GET ONE UNIT BY ID
  async findOne(id: string, userId: string) {
    const unit = await this.prisma.unit.findFirst({
      where: { id, user_id: userId },
      include: {
        tenant: true,
        bills: {
          orderBy: { billing_month: 'desc' },
        },
      },
    });

    if (!unit) throw new NotFoundException('Unit not found');

    return unit;
  }

  // UPDATE ONE UNIT
  async update(id: string, userId: string, updateUnitDto: UpdateUnitDto) {
    await this.findOne(id, userId);

    return this.prisma.unit.update({
      where: { id },
      data: updateUnitDto,
    });
  }

  // DELETE UNIT
  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.unit.delete({
      where: { id },
    });
  }
}
