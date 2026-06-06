import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

import { appConfig } from './config/app.config';
import { buildGraphqlConfig } from './config/graphql.config';
import { IaDocumentalClient, UsuariosApiClient } from './datos/external';
import { AlquilerRepository } from './datos/repositories/alquiler.repository';
import { CategoriaRepository } from './datos/repositories/categoria.repository';
import { PuntoEntregaRepository } from './datos/repositories/punto-entrega.repository';
import { ReservaRepository } from './datos/repositories/reserva.repository';
import { VehiculoRepository } from './datos/repositories/vehiculo.repository';
import { PrismaModule } from './datos/prisma';
import { AlquilerResolver } from './resolvers/alquiler.resolver';
import { CategoriaResolver } from './resolvers/categoria.resolver';
import { HealthResolver } from './resolvers/health.resolver';
import { PuntoEntregaResolver } from './resolvers/punto-entrega.resolver';
import { ReservaResolver } from './resolvers/reserva.resolver';
import { VehiculoResolver } from './resolvers/vehiculo.resolver';
import { AlquilerService } from './servicios/alquiler.service';
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
    AlquilerResolver,
    CategoriaService,
    VehiculoService,
    PuntoEntregaService,
    ReservaService,
    AlquilerService,
    UsuariosApiClient,
    IaDocumentalClient,
    CategoriaRepository,
    VehiculoRepository,
    PuntoEntregaRepository,
    ReservaRepository,
    AlquilerRepository,
  ],
})
export class AppModule {}
