import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    process.env.FRONTEND_URL,             // Local frontend
    process.env.PRODUCTION_FRONTEND_URL,  // Deployed frontend
  ].filter(Boolean);

  app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.PRODUCTION_FRONTEND_URL,
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
});


  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);

  console.log('✅ Backend running at:');
  console.log(`   Local: http://localhost:${port}`);
  console.log(`   Network: http://${host}:${port}`);
  console.log(`   Allowed Origins: ${allowedOrigins.join(', ')}`);
}

void bootstrap();
