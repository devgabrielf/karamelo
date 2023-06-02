import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtGuard } from './auth/guards/';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtGuard(reflector));

  await app.listen(3333);
}

bootstrap();
