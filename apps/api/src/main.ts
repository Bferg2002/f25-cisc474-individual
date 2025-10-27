/* eslint-disable turbo/no-undeclared-env-vars */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:3001', // ✅ Correct local frontend port
    'https://tanstack-start-app.btbf569708.workers.dev',
    'https://cisc474-individual-project.btbf569708.workers.dev',
    process.env.FRONTEND_URL,
    process.env.PRODUCTION_FRONTEND_URL,
  ].filter(Boolean);

  // ✅ Full Auth CORS config
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked request from: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'], // ✅ Required for Auth0
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);

  console.log('✅ Backend running at:');
  console.log(`   Local: http://localhost:${port}`);
  console.log(`   Network: http://${host}:${port}`);
  console.log('📌 Allowed Origins:', allowedOrigins);
  console.log('📌 Audience:', process.env.AUTH0_AUDIENCE);
  console.log('📌 Issuer:', process.env.AUTH0_ISSUER_URL);
}

void bootstrap();
