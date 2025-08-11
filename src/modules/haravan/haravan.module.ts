import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HaravanService } from './haravan.service';
import { HaravanController } from './haravan.controller';
import { Order, OrderSchema } from './order.schema';
import { VoucherRedemption, VoucherRedemptionSchema } from '../vouchers/voucher-redemption.schema';
import { VouchersModule } from '../vouchers/vouchers.module';

@Module({
  imports: [
    VouchersModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: VoucherRedemption.name, schema: VoucherRedemptionSchema },
    ]),
  ],
  controllers: [HaravanController],
  providers: [HaravanService],
  exports: [HaravanService],
})
export class HaravanModule {}
