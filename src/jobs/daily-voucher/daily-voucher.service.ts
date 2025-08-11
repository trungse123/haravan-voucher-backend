import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { VouchersService } from '../../modules/vouchers/vouchers.service';
import { HaravanService } from '../../modules/haravan/haravan.service';

@Injectable()
export class DailyVoucherService {
  private readonly logger = new Logger(DailyVoucherService.name);

  constructor(
    private vouchers: VouchersService,
    private haravan: HaravanService,
  ) {}

  // Cron 00:00 mỗi ngày
  @Cron('0 0 * * *')
  async handleCron() {
    await this.runOnce();
  }

  // Cho phép gọi thủ công từ /dev/run-daily
  async runOnce() {
    const today = new Date();
    const ends = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const dateStr = today.toISOString().slice(0, 10);

    const templates = [
      { code: `DAILY10K_${dateStr}`, type: 'FIXED', value: 10000, minOrder: 149000, usageLimit: 300 },
      { code: `DAILY20K_${dateStr}`, type: 'FIXED', value: 20000, minOrder: 249000, usageLimit: 200 },
    ];

    for (const t of templates) {
      try {
        // 1) Gọi Haravan tạo mã (cần HARAVAN_API_TOKEN hợp lệ)
        await this.haravan.createDiscount({
          code: t.code,
          discount_type: 'fixed_amount',
          value: t.value,
          minimum_order_amount: t.minOrder,
          usage_limit: t.usageLimit,
          once_per_customer: true,
          starts_at: today.toISOString(),
          ends_at: ends.toISOString(),
          channels_selection: 'all',
        });

        // 2) Lưu Mongo
        await this.vouchers.create({
          code: t.code,
          type: t.type as any,
          value: t.value,
          minOrder: t.minOrder,
          usageLimit: t.usageLimit,
          oncePerCustomer: true,
          startsAt: today,
          endsAt: ends,
          status: 'ACTIVE',
        });

        this.logger.log(`Created voucher ${t.code}`);
      } catch (e: any) {
        this.logger.error(`Fail create ${t.code}: ${e?.response?.status} ${e?.response?.data?.message ?? e.message}`);
      }
    }
  }
}
