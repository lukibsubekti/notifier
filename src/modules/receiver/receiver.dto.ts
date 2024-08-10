import { IsEmail, IsIn, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ValidTemplate, ToValidOption } from './receiver.validator';

export enum EmailMethod {
  BREVO = 'brevo',
  SES = 'ses',
  SMTP = 'smtp',
}

const emailMethods = Object.values(EmailMethod);

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  to_email: string;

  @IsString()
  @IsNotEmpty()
  to_name: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsObject()
  payload: any;

  @IsOptional()
  @IsIn(emailMethods)
  @ToValidOption(emailMethods, 'smtp')
  method?: EmailMethod = EmailMethod.SMTP;

  @IsOptional()
  @IsIn([true, false])
  @ToValidOption([true, false], false)
  is_sync?: boolean = false;

  /** This is required if method is other than "brevo".
   * If the "method" is "brevo" and "brevo_template" is empty, 
   * this will be ordinary dynamic content.
   * */
  @ValidTemplate()
  template: string;

  /** (Optional) This can be used when "method" is "brevo". This will ignore "template" value. */
  @IsOptional()
  @IsNotEmpty()
  brevo_template: string | number = null;
}