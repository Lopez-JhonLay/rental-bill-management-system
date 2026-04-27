import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRateDto } from './dto/create-rate.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  // ADD a new rate — never edit existing ones
  async create(userId: string, dto: CreateRateDto) {
    // Check for duplicate effective_from date
    const existing = await this.prisma.rateSetting.findFirst({
      where: {
        user_id: userId,
        effective_from: new Date(dto.effective_from),
      },
    });

    if (existing) {
      throw new ConflictException(
        `A rate setting for ${dto.effective_from} already exists`,
      );
    }

    return this.prisma.rateSetting.create({
      data: {
        user_id: userId,
        electricity_rate: dto.electricity_rate,
        water_rate: dto.water_rate,
        effective_from: new Date(dto.effective_from),
      },
    });
  }

  // GET all rates — most recent first
  async findAllRates(userId: string) {
    return this.prisma.rateSetting.findMany({
      where: { user_id: userId },
      orderBy: { effective_from: 'desc' },
    });
  }

  // GET active rate for a specific billing month
  async getActiveRate(userId: string, billingMonth: string) {
    const billingDate = new Date(billingMonth + '-01');

    const rate = await this.prisma.rateSetting.findFirst({
      where: {
        user_id: userId,
        effective_from: { lte: billingDate },
      },
      orderBy: { effective_from: 'desc' },
    });

    if (!rate) {
      throw new NotFoundException(
        `No rate found for billing month ${billingMonth}. 
         Please add a rate setting first.`,
      );
    }

    return rate;
  }
}
