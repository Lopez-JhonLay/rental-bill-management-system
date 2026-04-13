import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import * as bycrpt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(fullName: string, email: string, password: string) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bycrpt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        full_name: fullName,
        email,
        password_hash: hashedPassword,
      },
    });

    return { message: 'Account created successfully', userId: user.id };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bycrpt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
      },
    };
  }
}
