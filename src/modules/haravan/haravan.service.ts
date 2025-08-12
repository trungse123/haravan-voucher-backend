import { Injectable } from '@nestjs/common';  // Import Injectable từ @nestjs/common
import { ConfigService } from '@nestjs/config';  // Import ConfigService từ @nestjs/config
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
    try {
      const res = await axios.post(url, { discount: payload }, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      });
      return res.data;
    } catch (e: any) {
      console.error('Error creating discount:', e.response?.data ?? e.message);
      throw new Error(e.response?.data?.message ?? 'Unknown error');
    }
  }
}
