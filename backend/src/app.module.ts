import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { AnimalModule } from './animal/animal.module';
import { ImageModule } from './image/image.module';
import { InqueryModule } from './inquery/inquery.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    AnimalModule,
    ImageModule,
    InqueryModule,
    PrismaModule,
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
      serveRoot: '/images',
    }),
  ],
})
export class AppModule {}
