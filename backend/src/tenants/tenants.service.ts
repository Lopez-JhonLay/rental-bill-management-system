import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';

import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  // CREATE a new tenant
  async create(userId: string, dto: CreateTenantDto) {
    // 1. Check if unit exists and belongs to landlord
    const unit = await this.prisma.unit.findFirst({
      where: { id: dto.unit_id, user_id: userId },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    // 2. Check if unit already has a tenant
    const existing = await this.prisma.tenant.findUnique({
      where: { unit_id: dto.unit_id },
    });

    if (existing) {
      throw new ConflictException('Unit already has an active tenant');
    }

    // 3. Create the tenant
    return this.prisma.tenant.create({
      data: {
        unit_id: dto.unit_id,
        tenant_name: dto.tenant_name,
        person_count: dto.person_count,
      },
    });
  }

  // GET ALL tenants belonging to the landlord
  async findAll(userId: string) {
    return this.prisma.tenant.findMany({
      where: {
        unit: { user_id: userId }, // filter through unit ownership
      },
      include: { unit: true },
    });
  }

  // GET ONE tenant by id
  async findOne(id: string, userId: string) {
    const tenant = await this.prisma.tenant.findFirst({
      where: {
        id,
        unit: { user_id: userId },
      },
      include: { unit: true },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  // UPDATE a tenant
  async update(id: string, userId: string, dto: UpdateTenantDto) {
    await this.findOne(id, userId); // ensures tenant exists and belongs to user

    return this.prisma.tenant.update({
      where: { id },
      data: dto,
    });
  }

  // DELETE a tenant
  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // ensures tenant exists and belongs to user

    return this.prisma.tenant.delete({
      where: { id },
    });
  }
}
