import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CrudConfigService } from '@nestjsx/crud';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';

CrudConfigService.load({
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  routes: {
    updateOneBase: {
      returnShallow: true,
    },
    deleteOneBase: {
      returnDeleted: true,
    },
    createOneBase: {
      returnShallow: true,
    },
  },
});

import { AppModule } from './app.module';
import { AWS_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_REGION } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
    }),
  );

  config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_ACCESS_KEY,
    region: AWS_REGION,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Screen sales CMS')
    .setDescription('The cms API description')
    .setVersion('1.0')
    .addTag('cms')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
