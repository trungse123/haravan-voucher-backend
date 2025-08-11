import { Controller, Post } from '@nestjs/common';
import { DailyVoucherService } from './jobs/daily-voucher/daily-voucher.service';

@Controller('dev')
export class DevController {
  constructor(private readonly job: DailyVoucherService) {}

  @Post('run-daily')
  async runDailyOnce() {
    await this.job.runOnce();
    return { ok: true };
  }
}
