import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { configs, envValidationSchema } from './config';

import { VouchersModule } from './modules/vouchers/vouchers.module';
import { HaravanModule } from './modules/haravan/haravan.module';

import { DailyVoucherService } from './jobs/daily-voucher/daily-voucher.service';
import { HealthController } from './health.controller';
import { VouchersController } from './modules/vouchers/vouchers.controller';
import { DevController } from './dev.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      validationSchema: envValidationSchema,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        uri: cfg.get<string>('db.mongoUrl')!,
      }),
    }),
    ScheduleModule.forRoot(),

    // QUAN TRỌNG: cần cả 2 module này để inject vào job/controller
    VouchersModule,
    HaravanModule,
  ],
  controllers: [
    HealthController,
    VouchersController,
    DevController,
  ],
  providers: [
    DailyVoucherService, // cron job 00:00 hằng ngày
  ],
})
export class AppModule {}
