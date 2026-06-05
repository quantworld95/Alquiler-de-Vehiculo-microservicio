import { Query, Resolver } from '@nestjs/graphql';

import { HealthStatus } from '../types';

@Resolver(() => HealthStatus)
export class HealthResolver {
  @Query(() => HealthStatus, {
    description: 'Returns the current status of the MS Alquiler de Vehiculos service.',
  })
  health(): HealthStatus {
    return {
      service: 'ms-alquiler-vehiculos',
      status: 'ok',
      timestamp: new Date(),
    };
  }
}
