import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation pipe globally
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  
  // Enable CORS
  app.enableCors({
    origin: true, // Allow all origins for dev
    credentials: true,
  });

  // Match the /api prefix of the frontend routes
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
