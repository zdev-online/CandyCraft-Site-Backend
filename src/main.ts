import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookie_parser from 'cookie-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors({ origin: '*' }));
  app.use(helmet());
  app.use(cookie_parser());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        for (let i = 0; i < errors.length; i++) {
          delete errors[i].target;
        }
        return new BadRequestException(errors, 'Ошибка валидации данных');
      },
      transform: true,
      whitelist: true,
    }),
  );

  if (process.env.MODE == 'dev') {
    const docsConfig = new DocumentBuilder()
      .setTitle('Candy Craft - API ')
      .setDescription('Описание API для backend - части сайта Candy Craft')
      .setVersion('1.0')
      .addTag('candy-craft')
      .addBearerAuth(
        {
          description: `Bearer <JWT_TOKEN>`,
          name: 'Authorization',
          bearerFormat: 'Bearer',
          scheme: 'Bearer',
          type: 'http',
          in: 'header',
        },
        'JWT_AUTH',
      )
      .build();

    const document = SwaggerModule.createDocument(app, docsConfig, {
      deepScanRoutes: true,
    });
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(process.env.PORT || 5000);
  console.log(`Server listen ${process.env.PORT || 5000}`);
}
bootstrap();
