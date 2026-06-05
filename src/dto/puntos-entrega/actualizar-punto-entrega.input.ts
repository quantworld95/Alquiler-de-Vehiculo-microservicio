import { InputType, PartialType } from '@nestjs/graphql';

import { CrearPuntoEntregaInput } from './crear-punto-entrega.input';

@InputType()
export class ActualizarPuntoEntregaInput extends PartialType(CrearPuntoEntregaInput) {}
