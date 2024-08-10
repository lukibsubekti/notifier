import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';


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

export class EnvironmentVariables {
  @IsEnum(EnvironmentNames)
  NODE_ENV: EnvironmentNames;

  @IsNumber()
  APP_PORT: number;

  @IsString()
  APP_HOST: string;

  @Type(() => AppConfig)
  app: AppConfig;
}