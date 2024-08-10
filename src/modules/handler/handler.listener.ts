import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../email/email.service';
import { SendEmailDto } from '../receiver/receiver.dto';

@Injectable()
export class HandlerListener {
  constructor(
    private readonly emailService: EmailService,
  ) {}

  @OnEvent('email.send', { async: true })
  handleSendEmailEvent(data: SendEmailDto) {
    setTimeout(async () => {
      await this.emailService.sendEmail(data);
      console.info('email sent async:', data);
    }, 1000);
  }
}