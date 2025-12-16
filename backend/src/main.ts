import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });

  // Habilita o Trust Proxy para o Render/Cloudflare
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // SHORT-CIRCUIT: Responde OPTIONS imediatamente para evitar bloqueio do Clerk
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      const origin = req.headers.origin;
      const allowedOrigins = [
        'https://app.capicash.com.br',
        'http://localhost:5173',
        'http://localhost:3000',
        process.env.FRONTEND_URL
      ];

      // Se a origem for permitida (ou se não tiver origem, ex: curl), libera
      if (!origin || allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin || '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
        res.header('Access-Control-Allow-Credentials', 'true');
        return res.status(204).end();
      }
    }
    next();
  });

  // Middleware CORS do Express (Roda antes dos Guards do NestJS)
  app.use(cors({
    origin: [
      'https://app.capicash.com.br',
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL
    ].filter(Boolean) as string[], // Remove valores nulos/undefined e tipa
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Servir arquivos estáticos da pasta public
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
