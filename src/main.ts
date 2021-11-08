import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookie_parser from 'cookie-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors({ origin: '*' }));
  app.use(helmet());
  app.use(cookie_parser());
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      for (let i = 0; i < errors.length; i++) {
        delete errors[i].target;
      }
      return new BadRequestException(errors, 'Ошибка валидации данных')
    },
    transform: true,
    whitelist: true
  }));
  await app.listen(process.env.PORT || 5000);
  console.log(`Server listen ${process.env.PORT || 5000}`);
}
bootstrap();
