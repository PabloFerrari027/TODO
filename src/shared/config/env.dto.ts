import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsEnum,
  IsOptional,
  IsArray,
  IsString,
  ArrayNotEmpty,
  ArrayMinSize,
} from 'class-validator';

export enum NodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export enum TemplateLanguage {
  'PT-BR' = 'pt-BR',
}

@Injectable()
export class EnvDTO {
  @IsEnum(NodeEnv, {
    message: 'NODE_ENV must be one of: development, production, test',
  })
  NODE_ENV: NodeEnv = NodeEnv.DEVELOPMENT;

  @IsInt({ message: 'PORT must be an integer' })
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value))
  PORT: number = 3000;

  @IsArray({ message: 'CORS_ORIGINS must be an array' })
  @ArrayNotEmpty({ message: 'CORS_ORIGINS array cannot be empty' })
  @ArrayMinSize(1, { message: 'CORS_ORIGINS must contain at least 1 item' })
  @Transform(({ value }: { value: string }) =>
    value.split(',').map((v) => v.trim()),
  )
  @IsString({
    each: true,
    message: 'Each item in CORS_ORIGINS must be a string',
  })
  CORS_ORIGINS: string[];

  @IsInt({ message: 'RESPONSE_TIMEOUT must be an integer' })
  @Transform(({ value }: { value: string }) => parseInt(value))
  RESPONSE_TIMEOUT: number = 5000;

  @IsInt({ message: 'RATE_LIMIT_TTL must be an integer' })
  @Transform(({ value }: { value: string }) => parseInt(value))
  RATE_LIMIT_TTL: number;

  @IsInt({ message: 'RATE_LIMIT_LIMIT must be an integer' })
  @Transform(({ value }: { value: string }) => parseInt(value))
  RATE_LIMIT_LIMIT: number;

  @IsEnum(TemplateLanguage, {
    message: 'TEMPLATE_LANGUAGE must be one of: pt-BR',
  })
  TEMPLATE_LANGUAGE: TemplateLanguage;

  @IsString()
  REDIS_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  POSTGRESQL_DATABASE_URL: string;
}
