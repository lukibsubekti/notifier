import { plainToInstance } from 'class-transformer';
import {validateSync } from 'class-validator';
import { EnvironmentVariables } from './config.type';

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true }, // value from .env file always be read as string, set to "false" will always throw error
  );
  const errors = validateSync(validatedConfig, { skipMissingProperties: true });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}