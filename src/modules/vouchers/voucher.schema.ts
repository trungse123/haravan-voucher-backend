import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VoucherDocument = HydratedDocument<Voucher>;

@Schema({ collection: 'vouchers', timestamps: true })
export class Voucher {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  type: string; // FIXED, PERCENT, FREESHIP

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  minOrder: number;

  @Prop({ required: true })
  startsAt: Date;

  @Prop({ required: true })
  endsAt: Date;

  @Prop({ default: 0 })
  used: number;

  @Prop({ required: true })
  usageLimit: number;

  @Prop({ default: true })
  oncePerCustomer: boolean;

  @Prop({ default: 'ACTIVE' })
  status: string;

  @Prop()
  haravanId?: string;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
