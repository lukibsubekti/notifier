import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  enable: process.env.AUTH_ENABLE === 'true',
  token: process.env.AUTH_TOKEN || '',
}));
