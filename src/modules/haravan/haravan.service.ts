import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class HaravanService {
  private apiBase: string;
  private token: string;

  constructor(private cfg: ConfigService) {
    this.apiBase = cfg.get<string>('haravan.apiBase')!;
    this.token = cfg.get<string>('haravan.accessToken')!;
  }

  async createDiscount(payload: any) {
    const url = `${this.apiBase}/com/discounts.json`;
    const res = await axios.post(url, { discount: payload }, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
    return res.data;
  }
}
