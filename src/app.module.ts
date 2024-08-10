import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './configs/config.helper';
import appConfig from './configs/app.config';
import { ReceiverModule } from './modules/receiver/receiver.module';
import { HandlerModule } from './modules/handler/handler.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './modules/email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: [
        '.env.local',
        '.env',
      ],
      validate,
      load: [ appConfig ],
    }),
    EventEmitterModule.forRoot({
      global: true,
      wildcard: true,
      delimiter: '.',
    }),
    EmailModule.forRoot({
      isGlobal: true,
    }),
    ReceiverModule,
    HandlerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
