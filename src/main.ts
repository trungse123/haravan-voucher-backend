import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ verify: (req: any, _res, buf) => (req.rawBody = buf) }));
  app.use(bodyParser.urlencoded({ extended: true, verify: (req: any, _res, buf) => (req.rawBody = buf) }));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
