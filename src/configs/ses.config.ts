import { registerAs } from '@nestjs/config';

export default registerAs('ses', () => ({
  region: process.env.AWS_SES_REGION || 'ap-southeast-1',
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || '',
  fromEmail: process.env.AWS_SES_FROM_EMAIL || '',
}))