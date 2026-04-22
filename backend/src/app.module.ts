import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UnitsModule } from './units/units.module';
import { TenantsModule } from './tenants/tenants.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, UnitsModule, TenantsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
