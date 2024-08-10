import { Injectable } from '@nestjs/common';
import { SendEmailDto } from '../receiver/receiver.dto';

@Injectable()
export class EmailService {
  constructor() {}

  sendEmail(data: SendEmailDto) {
    return data;
  }
}
