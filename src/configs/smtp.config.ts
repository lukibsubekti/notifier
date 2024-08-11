import { registerAs } from '@nestjs/config';

export default registerAs('smtp', () => ({
  host: process.env.SMTP_HOST || 'smtp.email.com',
  port: process.env.SMTP_PORT ? +process.env.SMTP_PORT : 25,
  isSecure: process.env.SMTP_IS_SECURE === 'true' ? true : false,
  authUser: process.env.SMTP_AUTH_USER || 'user@email.com',
  authPassword: process.env.SMTP_AUTH_PASSWORD || 'password',
  fromName: process.env.SMTP_FROM_NAME || 'Admin',
  fromEmail: process.env.SMTP_FROM_EMAIL || 'noreply@email.com',
}))