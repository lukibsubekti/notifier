import { join } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
import * as nodemailer from 'nodemailer';
import * as AWS from 'aws-sdk';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import Handlebars from "handlebars";
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WorkerResult } from 'src/commons/app.type';
import { EnvironmentVariables } from 'src/configs/config.type';
import { SendEmailDto } from '../receiver/receiver.dto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService<EnvironmentVariables, true>,
  ) {
    // smtp
    this.transporter = nodemailer.createTransport({
      host: configService.get('smtp.host', { infer: true }),
      port: configService.get('smtp.port', { infer: true }),
      secure: configService.get('smtp.isSecure', { infer: true }), // Use `true` for port 465, `false` for all other ports
      auth: {
        user: configService.get('smtp.authUser', { infer: true }),
        pass: configService.get('smtp.authPassword', { infer: true }),
      },
    });

    // SES
    AWS.config.update({
      region: configService.get('ses.region', { infer: true }),
      credentials: new AWS.Credentials({
        accessKeyId: configService.get('ses.accessKeyId', { infer: true }),
        secretAccessKey: configService.get('ses.secretAccessKey', { infer: true }),
      })
    })

    // brevo
    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = this.configService.get('brevo.apiKey', { infer: true });
  }

  async sendEmail(data: SendEmailDto) {
    if (data.method === 'smtp') {
      return this.sendSMTP(data);
    }
    else if (data.method === 'ses') {
      return this.sendSES(data);
    }
    else if (data.method === 'brevo') {
      return this.sendBrevo(data);
    }

    return new WorkerResult({ 
      status: false, 
      message: 'No supported sending method', 
      errors: [`Method ${data.method} is not supported`], 
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  getTemplateContent(name: string, ext: 'html' | 'txt' = 'html'): HandlebarsTemplateDelegate<any> | null {
    try {
      const filePath = join(process.cwd(), `templates/${name}.${ext}`);
      const content = readFileSync(filePath, 'utf-8');
      return Handlebars.compile(content);
    } catch (error) {
      console.error(error.message || error);
      return null;
    }
  }

  verifyTemplate(name: string): boolean {
    // if no templae for html and txt, return false
    if (
      !existsSync(join(process.cwd(), `templates/${name}.html`))
      && !existsSync(join(process.cwd(), `templates/${name}.txt`))
    ) {
      return false;
    }

    return true;
  }

  /** @todo get template function */
  getTemplate(name: string) {
    if (!this.verifyTemplate(name)) {
      return null;
    }

    return {
      text: (payload: any) => { 
        const template = this.getTemplateContent(name, 'txt');
        return template ? template(payload) : '';
      },
      html: (payload: any) => {
        const template = this.getTemplateContent(name, 'html');
        return template ? template(payload) : '';
      },
    }
  }

  /** Send using SMTP protocol */
  async sendSMTP(payload: SendEmailDto) {
    const template = this.getTemplate(payload.template);

    if (!template) {
      const error = "Template doesn't exist";
      console.error(error);
      return new WorkerResult({ status: false, statusCode: HttpStatus.BAD_REQUEST, message: 'No Template', errors: [error] });
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"${this.configService.get('smtp.fromName', { infer: true })}" <${this.configService.get('smtp.fromEmail', { infer: true })}>`, // sender address
        to: payload.to_email, // list of receivers separated by comma
        subject: payload.subject, // subject line
        text: template.text(payload.payload), // plain text body
        html: template.html(payload.payload), // html body
      });
    
      console.log("Message sent: %s", info.messageId);
      return new WorkerResult({ status: true, data: { messageId: info.messageId } });
    } catch (err) {
      console.error(err);
      const error = err.message || 'SMTP email sending has failed';
      return new WorkerResult({ status: false, statusCode: HttpStatus.BAD_GATEWAY, message: 'Email Not Sent', errors: [error] });
    }
  }

  /** Send using AWS SDK */
  async sendSES(payload: SendEmailDto) {
    const template = this.getTemplate(payload.template);

    if (!template) {
      const error = "Template doesn't exist";
      console.error(error);
      return new WorkerResult({ status: false, statusCode: HttpStatus.BAD_REQUEST, message: 'No Template', errors: [error] });
    }

    // Create sendEmail params
    const params = {
      Destination: {
        /* required */
        // CcAddresses: [
        //   "EMAIL_ADDRESS",
        // ],
        ToAddresses: [
          payload.to_email,
        ],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: "UTF-8",
            Data: template.html(payload.payload),
          },
          Text: {
            Charset: "UTF-8",
            Data: template.text(payload.payload),
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: payload.subject,
        },
      },
      Source: this.configService.get('ses.fromEmail', { infer: true }), /* required */
      ReplyToAddresses: [
        this.configService.get('ses.fromEmail', { infer: true }),
      ],
    };

    // Create the promise and SES service object
    const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
      .sendEmail(params)
      .promise();

    try {
      const result = await sendPromise;
      console.log('SES:', result.MessageId);
      return new WorkerResult({ status: true, data: { messageId: result.MessageId } });
    } catch (err) {
      console.error(err);
      const error = err.message || 'SES email sending has failed';
      return new WorkerResult({ status: false, statusCode: HttpStatus.BAD_GATEWAY, message: 'Email Not Sent', errors: [error] });
    }
  }

  /** Send using Brevo */
  async sendBrevo(payload: SendEmailDto) {
    let additional: { htmlContent?: string; templateId?: string | number; params?: any } = {}

    if (payload.brevo_template) {
      additional = {
        templateId: payload.brevo_template,
        params: {
          ...payload.payload,
        }
      };

    } else {
      const template = this.getTemplate(payload.template);

      if (!template) {
        const error = "Template doesn't exist";
        console.error(error);
        return new WorkerResult({ status: false, statusCode: HttpStatus.BAD_REQUEST, message: 'No Template', errors: [error] });
      }

      additional = {
        htmlContent: template.html(payload.payload),
      };
    }

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

    sendSmtpEmail = {
      sender:{  
        name: this.configService.get('brevo.fromName', { infer: true}),
        email: this.configService.get('brevo.fromEmail', { infer: true}),
      },
      to: [{
        email: payload.to_email,
        name: payload.to_name,
      }],
      subject: payload.subject,
      headers: {
        'content-type': 'application/json',
      },
      ...additional,
    };

    return new Promise<WorkerResult<any>>((resolve, reject) => {
      apiInstance
        .sendTransacEmail(sendSmtpEmail)
        .then(function(data) {
          console.log('API called successfully. Returned data: ', data);
          resolve(new WorkerResult({ status: true, data: { messageId: data.messageId } }));
        })
        .catch(function(err) {
          console.error(err);
          const error = err.message || 'Brevo email sending has failed';
          resolve(new WorkerResult({ status: false, statusCode: HttpStatus.BAD_GATEWAY, message: 'Email Not Sent', errors: [error] })); 
        });
    })
  }
}
