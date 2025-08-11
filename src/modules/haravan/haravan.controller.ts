import { Controller, Post, Headers, Req, Res, HttpCode } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { VoucherRedemption, VoucherRedemptionDocument } from '../vouchers/voucher-redemption.schema';
import { VouchersService } from '../vouchers/vouchers.service';

@Controller('haravan/webhooks')
export class HaravanController {
  constructor(
    private cfg: ConfigService,
    @InjectModel(Order.name) private orders: Model<OrderDocument>,
    @InjectModel(VoucherRedemption.name) private reds: Model<VoucherRedemptionDocument>,
    private vouchers: VouchersService,
  ) {}

  private verify(req: Request, headerHmac?: string): boolean {
    const secret = this.cfg.get<string>('haravan.webhookSecret');
    if (!secret) return true;                          // không cấu hình secret → bỏ qua verify (dev)
    if (!headerHmac || !req['rawBody']) return false;
    const digest = crypto.createHmac('sha256', secret).update(req['rawBody']).digest('base64');
    return digest === headerHmac;
  }

  @Post('orders/create')
  @HttpCode(200)
  async ordersCreate(
    @Headers('x-haravan-hmacsha256') hmac: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!this.verify(req, hmac)) return res.status(401).send('HMAC invalid');

    const b: any = req.body;

    const doc = {
      haravanOrderId: String(b.id ?? b.order_id ?? ''),
      customerId: String(b.customer?.id ?? ''),
      total: Number(b.total_price ?? b.total ?? 0),
      discountTotal: Number(b.total_discounts ?? 0),
      shipping: Number((b.shipping_lines?.[0]?.price) ?? 0),
      paymentFee: 0,
      marginEstimated: 0,
      discountCodes: (b.discount_codes ?? []).map((d: any) => ({
        code: d.code, amount: Number(d.amount ?? 0), type: d.type
      })),
    };

    if (!doc.haravanOrderId) return res.send('ok');
    await this.orders.updateOne({ haravanOrderId: doc.haravanOrderId }, { $set: doc }, { upsert: true });

    for (const d of doc.discountCodes) {
      await this.reds.create({ orderId: doc.haravanOrderId, customerId: doc.customerId, code: d.code, discountValue: d.amount });
      // tăng used để tiện thống kê
      await this.vouchers['model']?.updateOne({ code: d.code }, { $inc: { used: 1 } }).exec();
    }

    return res.send('ok');
  }
}
