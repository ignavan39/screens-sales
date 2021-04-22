import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CrudConfigService } from '@nestjsx/crud';
import { auth } from 'express-openid-connect'
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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(auth({
    issuerBaseURL: 'https://dev--83rk4dm.eu.auth0.com',
    baseURL: 'https://warm-snail-49.loca.lt',
    clientID: '0DKeivuHRA5jlJQnbxIXJUp07C8jJnqJ',
    secret: '1nTlGIiAwxjyq7Rc3eiSAHgnyQCfu8K0wO9QsyAKSpxNCKlCrbmCCvpA3bqqFceV',
    idpLogout: true,
  }))
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Screen sales CMS')
    .setDescription('The cms API description')
    .setVersion('1.0')
    .addTag('cms')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
