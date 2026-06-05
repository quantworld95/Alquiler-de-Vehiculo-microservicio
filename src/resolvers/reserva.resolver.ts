import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CrearReservaInput } from '../dto/reservas/crear-reserva.input';
import { ReservaService } from '../servicios/reserva.service';
import { ReservaType } from '../types';

@Resolver(() => ReservaType)
export class ReservaResolver {
  constructor(private readonly reservaService: ReservaService) {}

  @Mutation(() => ReservaType)
  crearReserva(@Args('input') input: CrearReservaInput): Promise<ReservaType> {
    return this.reservaService.crearReserva(input);
  }

  @Query(() => ReservaType)
  reserva(@Args('id', { type: () => Int }) id: number): Promise<ReservaType> {
    return this.reservaService.obtenerReservaPorId(id);
  }

  @Query(() => [ReservaType])
  reservasPorCliente(@Args('clienteId', { type: () => Int }) clienteId: number): Promise<ReservaType[]> {
    return this.reservaService.listarReservasPorCliente(clienteId);
  }
}
