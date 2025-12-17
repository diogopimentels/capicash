import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Necessário para Webhooks do Stripe/Clerk
  });

  // Configuração Robusta de CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://capicash.com', // Adicione seu domínio de produção aqui
      'https://capicash.onrender.com', // Exemplo de domínio no Render
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With, stripe-signature',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
