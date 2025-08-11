// src/modules/vouchers/voucher-redemption.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VoucherRedemptionDocument = HydratedDocument<VoucherRedemption>;

@Schema({
  collection: 'voucher_redemptions',
  timestamps: { createdAt: 'redeemedAt', updatedAt: false },
})
export class VoucherRedemption {
  @Prop({ required: true, index: true })
  orderId: string;     // Haravan order id

  @Prop({ required: true, index: true })
  customerId: string;  // Haravan customer id

  @Prop({ required: true, index: true })
  code: string;

  @Prop({ required: true })
  discountValue: number; // VND
}

export const VoucherRedemptionSchema = SchemaFactory.createForClass(VoucherRedemption);
VoucherRedemptionSchema.index({ code: 1, customerId: 1 });
