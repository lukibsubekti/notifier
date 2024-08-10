import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFastifyApplication, FastifyAdapter  } from '@nestjs/platform-fastify';
import { EnvironmentVariables } from './configs/config.type';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({
    logger: process.env.NODE_ENV === 'production' ? false : true,
  }));

  app.useGlobalPipes(new ValidationPipe({ 
    transform: true,
    whitelist: true,
  }));
  
  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  const appPort = configService.get('app.port', { infer: true });
  const appHost = configService.get('app.host', { infer: true });

  await app.listen(appPort, appHost);

  console.info(`Server listen to ${appHost}:${appPort}`);
}
bootstrap();
