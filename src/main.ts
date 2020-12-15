import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/http-exception.filter';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.setGlobalPrefix('/api/v1');
  app.useGlobalFilters(new AllExceptionFilter());

  await app.listen(process.env.PORT || 3030);
}
bootstrap();
