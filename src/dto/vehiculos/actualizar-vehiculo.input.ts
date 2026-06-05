import { InputType, PartialType } from '@nestjs/graphql';

import { CrearVehiculoInput } from './crear-vehiculo.input';

@InputType()
export class ActualizarVehiculoInput extends PartialType(CrearVehiculoInput) {}
