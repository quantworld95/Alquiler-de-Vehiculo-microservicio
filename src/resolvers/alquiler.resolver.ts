import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { IniciarAlquilerInput } from '../dto/alquileres/iniciar-alquiler.input';
import { RegistrarDevolucionInput } from '../dto/alquileres/registrar-devolucion.input';
import { AlquilerService } from '../servicios/alquiler.service';
import { AlquilerType } from '../types';

@Resolver(() => AlquilerType)
export class AlquilerResolver {
  constructor(private readonly alquilerService: AlquilerService) {}

  @Mutation(() => AlquilerType)
  iniciarAlquiler(@Args('input') input: IniciarAlquilerInput): Promise<AlquilerType> {
    return this.alquilerService.iniciarAlquiler(input);
  }

  @Mutation(() => AlquilerType)
  registrarDevolucion(
    @Args('input') input: RegistrarDevolucionInput,
  ): Promise<AlquilerType> {
    return this.alquilerService.registrarDevolucion(input);
  }

  @Query(() => AlquilerType)
  alquiler(@Args('id', { type: () => Int }) id: number): Promise<AlquilerType> {
    return this.alquilerService.obtenerAlquilerPorId(id);
  }

  @Query(() => AlquilerType)
  alquilerPorReserva(
    @Args('reservaId', { type: () => Int }) reservaId: number,
  ): Promise<AlquilerType> {
    return this.alquilerService.obtenerAlquilerPorReserva(reservaId);
  }
}
