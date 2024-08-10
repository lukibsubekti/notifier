import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV || 'development',
  host: process.env.APP_HOST || '::',
  port: process.env.APP_PORT ? +process.env.APP_PORT : 3000,
}))