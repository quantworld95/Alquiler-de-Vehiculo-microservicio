import { InputType, PartialType } from '@nestjs/graphql';

import { CrearCategoriaInput } from './crear-categoria.input';

@InputType()
export class ActualizarCategoriaInput extends PartialType(CrearCategoriaInput) {}
