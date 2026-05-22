import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { CartModule } from './modules/cart/cart.module';
import { AdminModule } from './modules/admin/admin.module';
import { ImagesModule } from './modules/images/images.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

// Resolve static path dynamically based on whether code is compiled (dist) or source (src)
const isProd = __dirname.includes('dist');
const frontendDistPath = isProd
  ? join(__dirname, '..', '..', '..', 'frontend', 'dist')
  : join(__dirname, '..', '..', 'frontend', 'dist');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: frontendDistPath,
      exclude: ['/api/(.*)'],
    }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    QuotesModule,
    ShippingModule,
    CartModule,
    AdminModule,
    ImagesModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
