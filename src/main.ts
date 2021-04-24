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
import { Auth0Guard } from './auth/auth.guard';
import { AWS_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_REGION } from './constants';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
    }),
  );

  // app.useGlobalGuards(new Auth0Guard())

  app.use(
    auth({
      issuerBaseURL: 'https://dev--83rk4dm.eu.auth0.com',
      baseURL: 'https://serious-mouse-66.loca.lt',
      clientID: '0DKeivuHRA5jlJQnbxIXJUp07C8jJnqJ',
      secret:
        '1nTlGIiAwxjyq7Rc3eiSAHgnyQCfu8K0wO9QsyAKSpxNCKlCrbmCCvpA3bqqFceV',
      idpLogout: true,
      auth0Logout: true,
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
