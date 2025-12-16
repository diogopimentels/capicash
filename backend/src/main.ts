import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Trust Proxy (Essencial para o Render)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // 2. Habilitar CORS Padrão do NestJS
  app.enableCors({
    origin: [
      'https://app.capicash.com.br',
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Log para confirmar que o server subiu
  console.log('🚀 Server running on port ' + (process.env.PORT || 3000));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
