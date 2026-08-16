import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

/**
 * Liveness probe consumed by the Docker `HEALTHCHECK` and by
 * orchestrators (Kubernetes, Compose) to determine whether the process
 * is up. Excluded from Swagger since it carries no business meaning.
 */
@ApiExcludeController()
@Controller('health')
export class HealthController {
  @Get()
  check(): { status: 'ok'; timestamp: string } {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
