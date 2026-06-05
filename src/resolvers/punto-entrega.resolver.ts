import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ActualizarPuntoEntregaInput } from '../dto/puntos-entrega/actualizar-punto-entrega.input';
import { CrearPuntoEntregaInput } from '../dto/puntos-entrega/crear-punto-entrega.input';
import { PuntoEntregaService } from '../servicios/punto-entrega.service';
import { PuntoEntregaType } from '../types';

@Resolver(() => PuntoEntregaType)
export class PuntoEntregaResolver {
  constructor(private readonly puntoEntregaService: PuntoEntregaService) {}

  @Mutation(() => PuntoEntregaType)
  crearPuntoEntrega(@Args('input') input: CrearPuntoEntregaInput): Promise<PuntoEntregaType> {
    return this.puntoEntregaService.crearPuntoEntrega(input);
  }

  @Query(() => [PuntoEntregaType])
  puntosEntrega(): Promise<PuntoEntregaType[]> {
    return this.puntoEntregaService.listarPuntosEntrega();
  }

  @Query(() => PuntoEntregaType)
  puntoEntrega(@Args('id', { type: () => Int }) id: number): Promise<PuntoEntregaType> {
    return this.puntoEntregaService.obtenerPuntoEntregaPorId(id);
  }

  @Mutation(() => PuntoEntregaType)
  actualizarPuntoEntrega(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: ActualizarPuntoEntregaInput,
  ): Promise<PuntoEntregaType> {
    return this.puntoEntregaService.actualizarPuntoEntrega(id, input);
  }
}
