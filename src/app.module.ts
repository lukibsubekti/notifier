import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import appConfig from './configs/app.config';
import smtpConfig from './configs/smtp.config';
import sesConfig from './configs/ses.config';
import brevoConfig from './configs/brevo.config';
import { validate } from './configs/config.helper';
import { EmailModule } from './modules/email/email.module';
import { ReceiverModule } from './modules/receiver/receiver.module';
import { HandlerModule } from './modules/handler/handler.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
      load: [ appConfig, smtpConfig, sesConfig, brevoConfig ],
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
