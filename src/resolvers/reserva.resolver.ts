import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ConfirmarReservaPagoInput } from '../dto/reservas/confirmar-reserva-pago.input';
import { PrepararCheckoutReservaInput } from '../dto/reservas/preparar-checkout-reserva.input';
import { RegistrarContratoFirmadoInput } from '../dto/reservas/registrar-contrato-firmado.input';
import { ReservaService } from '../servicios/reserva.service';
import { CheckoutReservaType, ReservaType } from '../types';

@Resolver(() => ReservaType)
export class ReservaResolver {
  constructor(private readonly reservaService: ReservaService) {}

  @Mutation(() => CheckoutReservaType)
  prepararCheckoutReserva(
    @Args('input') input: PrepararCheckoutReservaInput,
  ): Promise<CheckoutReservaType> {
    return this.reservaService.prepararCheckoutReserva(input);
  }

  @Mutation(() => ReservaType)
  confirmarReservaPorPago(
    @Args('input') input: ConfirmarReservaPagoInput,
  ): Promise<ReservaType> {
    return this.reservaService.confirmarReservaPorPago(input);
  }

  @Mutation(() => ReservaType)
  registrarContratoFirmado(
    @Args('input') input: RegistrarContratoFirmadoInput,
  ): Promise<ReservaType> {
    return this.reservaService.registrarContratoFirmado(input);
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
