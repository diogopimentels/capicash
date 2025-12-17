import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors'; // Importação do pacote nativo

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configuração de Proxy (Obrigatório para Render)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // 2. Middleware CORS Nativo (Roda ANTES de tudo do NestJS)
  // Isso resolve o 404 no OPTIONS automaticamente
  app.use(cors({
    origin: [
      'https://app.capicash.com.br',
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL
    ].filter((origin): origin is string => Boolean(origin)),
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    preflightContinue: false,
    optionsSuccessStatus: 204 // Retorna 204 para OPTIONS (Legacy browsers chiam com 200)
  }));

  // 3. Removemos o app.enableCors() nativo para não dar conflito

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Verifica se existe prefixo global (IMPORTANTE: Se o projeto usa prefixo, mantenha)
  // app.setGlobalPrefix('api'); // <--- DESCOMENTE SE SEU PROJETO USA PREFIXO

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📡 CORS enabled for: https://app.capicash.com.br and localhost`);
}
bootstrap();
