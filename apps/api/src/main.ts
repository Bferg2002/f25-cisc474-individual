/* eslint-disable turbo/no-undeclared-env-vars */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // <-- ADD THIS

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || undefined;
  await app.listen(port, host);
  console.log(`Backend running at http://${host || 'localhost'}:${port}`);
}

void bootstrap();
