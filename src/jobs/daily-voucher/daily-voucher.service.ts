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

  // Cron job chạy vào lúc 00:00 mỗi ngày
  @Cron('0 0 * * *', { timeZone: 'Asia/Ho_Chi_Minh' })
  async handleCron() {
    await this.runOnce();
  }

  // Chạy một lần để tạo voucher mới
  async runOnce() {
    const today = new Date();
    const ends = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const dateStr = today.toISOString().slice(0, 10); // Lấy ngày theo định dạng YYYY-MM-DD

    const templates = [
      {
        code: `DAILY10K_${dateStr}`,
        type: 'fixed_amount',
        value: 10000,
        minOrder: 149000,
        usageLimit: 300,
      },
      {
        code: `DAILY20K_${dateStr}`,
        type: 'fixed_amount',
        value: 20000,
        minOrder: 249000,
        usageLimit: 200,
      },
    ];

    for (const t of templates) {
      try {
        // 1) Gọi Haravan tạo mã giảm giá
        const response = await this.haravan.createDiscount({
          code: t.code,
          discount_type: t.type,               // Đảm bảo 'fixed_amount' là đúng
          value: t.value,                      // Giá trị giảm (tiền mặt)
          minimum_order_amount: t.minOrder,    // Ngưỡng tối thiểu đơn hàng
          usage_limit: t.usageLimit,           // Giới hạn sử dụng
          once_per_customer: true,             // Mỗi khách hàng chỉ dùng 1 lần
          starts_at: today.toISOString(),     // Thời gian bắt đầu
          ends_at: ends.toISOString(),        // Thời gian kết thúc
          channels_selection: 'all',          // Áp dụng cho tất cả các kênh
        });

        // 2) Lưu mã giảm giá vào MongoDB
        await this.vouchers.create({
          code: t.code,                         // Mã giảm giá
          type: t.type as any,                   // Loại mã giảm giá
          value: t.value,                        // Giá trị giảm
          minOrder: t.minOrder,                  // Ngưỡng đơn hàng tối thiểu
          usageLimit: t.usageLimit,              // Giới hạn sử dụng
          oncePerCustomer: true,                 // Mỗi khách hàng chỉ dùng 1 lần
          startsAt: today,                       // Ngày bắt đầu
          endsAt: ends,                          // Ngày kết thúc
          status: 'ACTIVE',                      // Trạng thái mã giảm giá
        });

        this.logger.log(`Created voucher ${t.code}`);
      } catch (e: any) {
        // Log lỗi chi tiết từ Haravan API
        this.logger.error(`Fail create ${t.code}: ${e?.response?.status} ${e?.response?.data?.message ?? e.message}`);
        // Log thêm chi tiết về lỗi
        if (e?.response?.data?.errors) {
          this.logger.error('Haravan API errors:', JSON.stringify(e.response?.data.errors, null, 2));
        }
      }
    }
  }
}
