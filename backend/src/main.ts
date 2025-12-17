import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Trust Proxy (Obrigatório para Render/Cloudflare)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // 2. MIDDLEWARE DE CORREÇÃO DE CORS (RAW)
  // Intercepta qualquer OPTIONS e responde 200 OK com os headers
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      const origin = req.headers.origin;
      // Permite a origem que chamou (reflection) ou fallback para *
      res.header('Access-Control-Allow-Origin', origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');

      // Responde 200 e morre aqui (não passa para Guards ou Roteador)
      return res.status(200).end();
    }
    next();
  });

  // 3. CORS padrão do Nest (Fallback para as outras requisições)
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
