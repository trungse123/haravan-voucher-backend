import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().port().default(3000),
  BASE_URL: Joi.string().uri().required(),
  TZ: Joi.string().default('Asia/Ho_Chi_Minh'),

  MONGO_URL: Joi.string().required(),

  HARAVAN_API_BASE: Joi.string().uri().default('https://apis.haravan.com'),
  HARAVAN_API_TOKEN: Joi.string().required(),
  HARAVAN_SHOP: Joi.string().required(),
  HARAVAN_WEBHOOK_SECRET: Joi.string().allow('', null).default(null),

  EMAIL_PROVIDER: Joi.string().valid('sendgrid', 'smtp').default('sendgrid'),
  SENDGRID_API_KEY: Joi.string().allow('', null),
});
