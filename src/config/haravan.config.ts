import { registerAs } from '@nestjs/config';

export default registerAs('haravan', () => ({
  apiBase: process.env.HARAVAN_API_BASE ?? 'https://apis.haravan.com',
  accessToken: process.env.HARAVAN_API_TOKEN as string,
  shop: process.env.HARAVAN_SHOP as string,
  webhookSecret: process.env.HARAVAN_WEBHOOK_SECRET || null,
}));
