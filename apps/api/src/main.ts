import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Include your known frontend domains explicitly
  const allowedOrigins = [
    'http://localhost:3000', // local frontend
    'https://tanstack-start-app.btbf569708.workers.dev', // Cloudflare dev domain
    'https://cisc474-individual-project.btbf569708.workers.dev', // your Worker alias
    process.env.FRONTEND_URL, // environment-provided local URL (Render)
    process.env.PRODUCTION_FRONTEND_URL, // environment-provided prod URL (Render)
  ].filter(Boolean);

  // ✅ Enable CORS for the specific domains
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
