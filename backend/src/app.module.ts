import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { WithdrawalsModule } from './modules/withdrawals/withdrawals.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { ClerkAuthGuard } from './modules/auth/clerk-auth.guard';
import { AbacateModule } from './modules/abacate/abacate.module';
import { SalesModule } from './modules/sales/sales.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        CLERK_SECRET_KEY: Joi.string().required(),
        ABACATE_API_KEY: Joi.string().required(),
        PORT: Joi.number().default(3000),
      }),
    }),
    PrismaModule,
    UsersModule,
    ProductsModule,
    CheckoutModule,
    WebhooksModule,
    WithdrawalsModule,
    UploadsModule,
    AbacateModule,
    SalesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
})
export class AppModule { }