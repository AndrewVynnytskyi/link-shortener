import { plainToInstance } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  validateSync,
} from 'class-validator';

/**
 * Allowed Node.js runtime environments for this application.
 */
type NodeEnv = 'development' | 'production' | 'test';

/**
 * Shape and validation rules for every environment variable the backend
 * reads. Booting fails fast with a readable error if a required variable
 * is missing or malformed, instead of surfacing as a runtime crash later.
 */
class EnvironmentVariables {
  @IsOptional()
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: NodeEnv = 'development';

  @IsOptional()
  @IsNumberString()
  PORT = '3000';

  @IsNotEmpty()
  DATABASE_URL: string;

  @IsNotEmpty()
  JWT_SECRET: string;

  @IsOptional()
  @IsNotEmpty()
  JWT_EXPIRES_IN = '2d';

  @IsNotEmpty()
  FRONTEND_URL: string;

  @IsOptional()
  COOKIE_DOMAIN?: string;

  @IsOptional()
  @IsNumberString()
  THROTTLE_TTL = '60000';

  @IsOptional()
  @IsNumberString()
  THROTTLE_LIMIT = '20';
}

/**
 * Validates `process.env` against {@link EnvironmentVariables} at boot time.
 * Used as the `validate` factory for `ConfigModule.forRoot`.
 *
 * @throws Error listing every invalid/missing environment variable.
 */
export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    const details = errors
      .map((error) => Object.values(error.constraints ?? {}).join(', '))
      .join('; ');
    throw new Error(`Invalid environment configuration: ${details}`);
  }

  return validated;
}
