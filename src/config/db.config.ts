import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  mongoUrl: process.env.MONGO_URL as string,
}));
