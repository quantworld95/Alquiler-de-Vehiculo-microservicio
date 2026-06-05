import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

import { appConfig } from './config/app.config';
import { buildGraphqlConfig } from './config/graphql.config';
import { CategoriaRepository } from './datos/repositories/categoria.repository';
import { PuntoEntregaRepository } from './datos/repositories/punto-entrega.repository';
import { ReservaRepository } from './datos/repositories/reserva.repository';
import { VehiculoRepository } from './datos/repositories/vehiculo.repository';
import { PrismaModule } from './datos/prisma';
import { CategoriaResolver } from './resolvers/categoria.resolver';
import { HealthResolver } from './resolvers/health.resolver';
import { PuntoEntregaResolver } from './resolvers/punto-entrega.resolver';
import { ReservaResolver } from './resolvers/reserva.resolver';
import { VehiculoResolver } from './resolvers/vehiculo.resolver';
import { CategoriaService } from './servicios/categoria.service';
import { PuntoEntregaService } from './servicios/punto-entrega.service';
import { ReservaService } from './servicios/reserva.service';
import { VehiculoService } from './servicios/vehiculo.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      ...buildGraphqlConfig(),
    }),
    PrismaModule,
  ],
  providers: [
    HealthResolver,
    CategoriaResolver,
    VehiculoResolver,
    PuntoEntregaResolver,
    ReservaResolver,
    CategoriaService,
    VehiculoService,
    PuntoEntregaService,
    ReservaService,
    CategoriaRepository,
    VehiculoRepository,
    PuntoEntregaRepository,
    ReservaRepository,
  ],
})
export class AppModule {}
