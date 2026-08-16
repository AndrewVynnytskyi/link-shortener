import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AppConfig } from './config/configuration';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const { port, frontendUrl, nodeEnv } =
    configService.getOrThrow<AppConfig>('app');

  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({ origin: frontendUrl, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Link Shortener API')
    .setDescription(
      'URL shortening, auth, click analytics and page-title lookup',
    )
    .setVersion('1.0')
    .addCookieAuth('jwt')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);

  console.log(`[bootstrap] listening on :${port} (${nodeEnv}), docs at /docs`);
}

bootstrap().catch((error: unknown) => {
  console.error('Failed to bootstrap application', error);
  process.exit(1);
});
