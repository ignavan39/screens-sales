import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CrudConfigService } from '@nestjsx/crud';
import { config } from 'aws-sdk';
import { auth } from 'express-openid-connect';

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
import {
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_ISSUER_URL,
  DOMAIN,
} from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
    }),
  );

  app.use(
    auth({
      issuerBaseURL: AUTH0_ISSUER_URL,
      baseURL: DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      secret: AUTH0_CLIENT_SECRET,
      idpLogout: true,
      auth0Logout: true,
    }),
  );

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
