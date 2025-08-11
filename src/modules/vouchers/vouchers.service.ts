import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Voucher, VoucherDocument } from './voucher.schema';

@Injectable()
export class VouchersService {
  constructor(@InjectModel(Voucher.name) private model: Model<VoucherDocument>) {}

  async create(data: Partial<Voucher>) {
    return this.model.create(data);
  }
}
