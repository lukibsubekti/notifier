import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';


export enum EnvironmentNames {
  PROD = 'production',
  DEV = 'development',
  TEST = 'test',
};

export class AppConfig {
  @IsEnum(EnvironmentNames)
  env: string;

  @IsString()
  host: string;

  @IsNumber()
  port: number;
}

class SmtpConfig {
  @IsString()
  host: string;

  @IsNumber()
  port: string;

  @IsBoolean()
  isSecure: boolean;

  @IsString()
  authUser: string;

  @IsString()
  authPassword: string;

  @IsString()
  fromName: string;

  @IsString()
  fromEmail: string;
}

class SesConfig {
  @IsString()
  region: string;

  @IsString()
  accessKeyId: string;

  @IsString()
  secretAccessKey: string;

  @IsString()
  fromEmail: string;
}

class BrevoConfig {
  @IsString()
  apiKey: string;

  @IsString()
  fromName: string;

  @IsString()
  fromEmail: string;
}

export class EnvironmentVariables {
  @IsEnum(EnvironmentNames)
  NODE_ENV: EnvironmentNames;

  @IsNumber()
  APP_PORT: number;

  @IsString()
  APP_HOST: string;

  @IsString()
  SMTP_HOST: string;

  @IsNumber()
  SMTP_PORT: number;

  @IsBoolean()
  SMTP_IS_SECURE: boolean;

  @IsString()
  SMTP_AUTH_USER: string;

  @IsString()
  SMTP_AUTH_PASSWORD: string;

  @IsString()
  SMTP_FROM_NAME: string;

  @IsString()
  SMTP_FROM_EMAIL: string;

  @IsString()
  AWS_SES_REGION: string;

  @IsString()
  AWS_SES_ACCESS_KEY_ID: string;

  @IsString()
  AWS_SES_SECRET_ACCESS_KEY: string;

  @IsString()
  AWS_SES_FROM_EMAIL: string;

  @IsString()
  BREVO_API_KEY: string;

  @IsString()
  BREVO_FROM_NAME: string;

  @IsString()
  BREVO_FROM_EMAIL: string;

  @Type(() => AppConfig)
  app: AppConfig;

  @Type(() => SmtpConfig)
  smtp: SmtpConfig;

  @Type(() => SesConfig)
  ses: SesConfig;

  @Type(() => BrevoConfig)
  brevo: BrevoConfig;
}