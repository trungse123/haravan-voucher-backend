import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ collection: 'orders', timestamps: true })
export class Order {
  @Prop({ required: true, unique: true, index: true })
  haravanOrderId: string;

  @Prop({ required: true, index: true })
  customerId: string;

  @Prop({ required: true, default: 0 })
  total: number;

  @Prop({ default: 0 })
  discountTotal: number;

  @Prop({ default: 0 })
  shipping: number;

  @Prop({ default: 0 })
  paymentFee: number;

  @Prop({ default: 0 })
  marginEstimated: number;

  @Prop({ type: [{ code: String, amount: Number, type: String }], default: [] })
  discountCodes: Array<{ code: string; amount: number; type: string }>;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ createdAt: 1 });
