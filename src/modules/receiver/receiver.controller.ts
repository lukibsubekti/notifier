import { Body, Controller, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WorkerResult } from 'src/commons/app.type';
import { EmailService } from '../email/email.service';
import { SendEmailDto } from './receiver.dto';

@Controller('send')
export class ReceiverController {
  constructor(
    private readonly emailService: EmailService,
    private readonly eventService: EventEmitter2,
  ) {}

  @Post()
  async sendEmail(@Body() data: SendEmailDto) {
    if (data.is_sync) {
      return await this.emailService.sendEmail(data);
    } 

    this.eventService.emit('email.send', data);
    return new WorkerResult({ status: true, message: 'Email will be sent asynchronously' });
  }
}
