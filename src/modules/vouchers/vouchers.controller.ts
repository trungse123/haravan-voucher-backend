import { Controller, Get } from '@nestjs/common';
import { VouchersService } from './vouchers.service';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchers: VouchersService) {}

  @Get('active')
  async active() {
    const now = new Date();
    return this.vouchers['model'] // truy cập trực tiếp model cho nhanh
      ? await this.vouchers['model']
          .find({ status: 'ACTIVE', startsAt: { $lte: now }, endsAt: { $gte: now } })
          .lean()
      : [];
  }
}
