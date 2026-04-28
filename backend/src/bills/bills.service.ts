import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { SettingsService } from '../settings/settings.service';

import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

@Injectable()
export class BillsService {
  constructor(
    private prisma: PrismaService,
    private settingsService: SettingsService,
  ) {}

  // GENERATE a new DRAFT bill
  async create(userId: string, dto: CreateBillDto) {
    // 1. Get unit and verify ownership
    const unit = await this.prisma.unit.findFirst({
      where: { id: dto.unit_id, user_id: userId },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    // 2. Get active tenant
    const tenant = await this.prisma.tenant.findUnique({
      where: { unit_id: dto.unit_id },
    });

    if (!tenant) {
      throw new NotFoundException('No active tenant found for this unit');
    }

    // 3. Check if bill already exists for this month
    const existing = await this.prisma.bill.findUnique({
      where: {
        unit_id_billing_month: {
          unit_id: dto.unit_id,
          billing_month: dto.billing_month,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `A bill for ${dto.billing_month} already exists for this unit`,
      );
    }

    // 4. Get active rate for this billing month
    const rate = await this.settingsService.getActiveRate(
      userId,
      dto.billing_month,
    );

    // 5. Get previous_kwh from last confirmed bill
    const lastBill = await this.prisma.bill.findFirst({
      where: {
        unit_id: dto.unit_id,
        status: 'CONFIRMED',
      },
      orderBy: { billing_month: 'desc' },
    });

    const previousKwh = lastBill ? Number(lastBill.current_kwh) : 0;

    if (dto.current_kwh < previousKwh) {
      throw new BadRequestException(
        `Current reading (${dto.current_kwh}) cannot be lower than previous reading (${previousKwh})`,
      );
    }

    // 6. Compute charges
    const electricityCharge =
      (dto.current_kwh - previousKwh) * Number(rate.electricity_rate);
    const waterCharge = tenant.person_count * Number(rate.water_rate);
    const rentCharge = Number(unit.monthly_rent);
    const totalAmount = electricityCharge + waterCharge + rentCharge;

    // 7. Save as DRAFT
    return this.prisma.bill.create({
      data: {
        unit_id: dto.unit_id,
        tenant_id: tenant.id,
        billing_month: dto.billing_month,
        previous_kwh: previousKwh,
        current_kwh: dto.current_kwh,
        electricity_rate: Number(rate.electricity_rate),
        water_rate: Number(rate.water_rate),
        electricity_charge: electricityCharge,
        water_charge: waterCharge,
        rent_charge: rentCharge,
        total_amount: totalAmount,
        status: 'DRAFT',
      },
    });
  }

  // GET ALL bills for the landlord
  async findAll(userId: string, billingMonth?: string) {
    return this.prisma.bill.findMany({
      where: {
        unit: { user_id: userId },
        ...(billingMonth && { billing_month: billingMonth }),
      },
      include: {
        unit: true,
        tenant: true,
      },
      orderBy: { billing_month: 'desc' },
    });
  }

  // GET ONE bill by id
  async findOne(id: string, userId: string) {
    const bill = await this.prisma.bill.findFirst({
      where: {
        id,
        unit: { user_id: userId },
      },
      include: {
        unit: true,
        tenant: true,
      },
    });

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    return bill;
  }

  // EDIT a DRAFT bill
  async update(id: string, userId: string, dto: UpdateBillDto) {
    const bill = await this.findOne(id, userId);

    // Can only edit DRAFT bills
    if (bill.status === 'CONFIRMED') {
      throw new BadRequestException('Cannot edit a confirmed bill');
    }

    const previousKwh = dto.previous_kwh ?? Number(bill.previous_kwh);
    const currentKwh = dto.current_kwh ?? Number(bill.current_kwh);

    if (currentKwh < previousKwh) {
      throw new BadRequestException(
        `Current reading (${dto.current_kwh}) cannot be lower than previous reading (${previousKwh})`,
      );
    }

    // Recompute charges with updated values
    const electricityCharge =
      (currentKwh - previousKwh) * Number(bill.electricity_rate);
    const waterCharge = Number(bill.water_charge);
    const rentCharge = Number(bill.rent_charge);
    const totalAmount = electricityCharge + waterCharge + rentCharge;

    return this.prisma.bill.update({
      where: { id },
      data: {
        previous_kwh: previousKwh,
        current_kwh: currentKwh,
        electricity_charge: electricityCharge,
        total_amount: totalAmount,
      },
    });
  }

  // CONFIRM a bill — locks it permanently
  async confirm(id: string, userId: string, force: boolean = false) {
    const bill = await this.findOne(id, userId);

    if (bill.status === 'CONFIRMED') {
      throw new BadRequestException('Bill is already confirmed');
    }

    if (!force) {
      // Check if a newer rate exists for this billing month
      const currentRate = await this.settingsService.getActiveRate(
        userId,
        bill.billing_month,
      );

      const billElectricityRate = Number(bill.electricity_rate);
      const currentElectricityRate = Number(currentRate.electricity_rate);

      const billWaterRate = Number(bill.water_rate);
      const currentWaterRate = Number(currentRate.water_rate);

      const isRateChange =
        billElectricityRate !== currentElectricityRate ||
        billWaterRate !== currentWaterRate;

      if (isRateChange) {
        throw new BadRequestException({
          message: 'Rate has changed since this bill was generated',
          warning: true,
          current_bill_rates: {
            electricity_rate: billElectricityRate,
            water_rate: billWaterRate,
          },
          new_bill_rates: {
            electricity_rate: currentElectricityRate,
            water_rate: currentWaterRate,
          },
          hint: 'Recompute the bill to use the latest rate or confirm anyway.',
        });
      }
    }

    return this.prisma.bill.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        confirmed_at: new Date(),
      },
    });
  }

  // RECOMPUTE bill with latest active rate
  async recompute(id: string, userId: string) {
    const bill = await this.findOne(id, userId);

    // Can only recompute DRAFT bills
    if (bill.status === 'CONFIRMED') {
      throw new BadRequestException('Cannot recompute a confirmed bill');
    }

    // Fetch the latest active rate for this billing month
    const rate = await this.settingsService.getActiveRate(
      userId,
      bill.billing_month,
    );

    // Recompute charges using NEW rate
    const previousKwh = Number(bill.previous_kwh);
    const currentKwh = Number(bill.current_kwh);

    const electricityCharge =
      (currentKwh - previousKwh) * Number(rate.electricity_rate);
    const waterCharge = bill.tenant.person_count * Number(rate.water_rate);
    const rentCharge = Number(bill.rent_charge);
    const totalAmount = electricityCharge + waterCharge + rentCharge;

    return this.prisma.bill.update({
      where: { id },
      data: {
        // Snapshot the new rate
        electricity_rate: Number(rate.electricity_rate),
        water_rate: Number(rate.water_rate),
        // Update computed charges
        electricity_charge: electricityCharge,
        water_charge: waterCharge,
        total_amount: totalAmount,
      },
    });
  }
}
