import { Module } from '@nestjs/common';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { AuthModule } from 'src/auth/auth.module';
import { SettingsModule } from 'src/settings/settings.module';

@Module({
  imports: [AuthModule, SettingsModule],
  controllers: [BillsController],
  providers: [BillsService],
})
export class BillsModule {}
