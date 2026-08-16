/**
 * Strongly typed application configuration, derived from `process.env`
 * once it has already passed {@link validateEnv}. Consumed via Nest's
 * `ConfigService.get<AppConfig>('app')` rather than reading `process.env`
 * directly throughout the codebase.
 */
export interface AppConfig {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  frontendUrl: string;
  cookieDomain?: string;
  throttleTtlMs: number;
  throttleLimit: number;
}

export default (): { app: AppConfig } => ({
  app: {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
    databaseUrl: process.env.DATABASE_URL ?? '',
    jwtSecret: process.env.JWT_SECRET ?? '',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '2d',
    frontendUrl: process.env.FRONTEND_URL ?? '',
    cookieDomain: process.env.COOKIE_DOMAIN,
    throttleTtlMs: parseInt(process.env.THROTTLE_TTL ?? '60000', 10),
    throttleLimit: parseInt(process.env.THROTTLE_LIMIT ?? '20', 10),
  },
});
