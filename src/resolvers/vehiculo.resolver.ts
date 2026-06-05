import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ActualizarVehiculoInput } from '../dto/vehiculos/actualizar-vehiculo.input';
import { BuscarVehiculosDisponiblesInput } from '../dto/vehiculos/buscar-vehiculos-disponibles.input';
import { CrearVehiculoInput } from '../dto/vehiculos/crear-vehiculo.input';
import { VehiculoService } from '../servicios/vehiculo.service';
import { VehiculoType } from '../types';

@Resolver(() => VehiculoType)
export class VehiculoResolver {
  constructor(private readonly vehiculoService: VehiculoService) {}

  @Mutation(() => VehiculoType)
  crearVehiculo(@Args('input') input: CrearVehiculoInput): Promise<VehiculoType> {
    return this.vehiculoService.crearVehiculo(input);
  }

  @Query(() => [VehiculoType])
  vehiculos(): Promise<VehiculoType[]> {
    return this.vehiculoService.listarVehiculos();
  }

  @Query(() => [VehiculoType])
  vehiculosDisponibles(
    @Args('input') input: BuscarVehiculosDisponiblesInput,
  ): Promise<VehiculoType[]> {
    return this.vehiculoService.buscarVehiculosDisponibles(input);
  }

  @Query(() => VehiculoType)
  vehiculo(@Args('id', { type: () => Int }) id: number): Promise<VehiculoType> {
    return this.vehiculoService.obtenerVehiculoPorId(id);
  }

  @Mutation(() => VehiculoType)
  actualizarVehiculo(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: ActualizarVehiculoInput,
  ): Promise<VehiculoType> {
    return this.vehiculoService.actualizarVehiculo(id, input);
  }
}
