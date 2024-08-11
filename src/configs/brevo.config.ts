import { registerAs } from '@nestjs/config';

export default registerAs('brevo', () => ({
  apiKey: process.env.BREVO_API_KEY || '',
  fromName: process.env.BREVO_FROM_NAME || 'Admin',
  fromEmail: process.env.BREVO_FROM_EMAIL || 'noreply@email.com',
}))