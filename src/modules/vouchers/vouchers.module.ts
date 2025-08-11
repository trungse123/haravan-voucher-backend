import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Voucher, VoucherSchema } from './voucher.schema';
import { VoucherRedemption, VoucherRedemptionSchema } from './voucher-redemption.schema';
import { VouchersService } from './vouchers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Voucher.name,            schema: VoucherSchema },
      { name: VoucherRedemption.name,  schema: VoucherRedemptionSchema },
    ]),
  ],
  providers: [VouchersService],
  exports: [VouchersService],
})
export class VouchersModule {}
