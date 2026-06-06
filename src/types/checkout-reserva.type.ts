import { Field, Float, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';

import { CapturaDocumentalTipo, MotivoBloqueoCheckout } from '../common/enums';

@ObjectType()
export class CheckoutReservaType {
  @Field()
  puedeContinuarPago!: boolean;

  @Field(() => MotivoBloqueoCheckout, { nullable: true })
  motivoBloqueo?: MotivoBloqueoCheckout | null;

  @Field(() => [String])
  camposPerfilFaltantes!: string[];

  @Field(() => String, { nullable: true })
  estadoValidacionDocumental?: string | null;

  @Field(() => Int, { nullable: true })
  validacionIaId?: number | null;

  @Field()
  requiereCapturaDocumental!: boolean;

  @Field(() => [CapturaDocumentalTipo])
  capturasRequeridas!: CapturaDocumentalTipo[];

  @Field(() => String, { nullable: true })
  documentalUploadUrl?: string | null;

  @Field(() => Int)
  clienteId!: number;

  @Field(() => Int)
  vehiculoId!: number;

  @Field(() => Int)
  puntoRecogidaId!: number;

  @Field(() => Int)
  puntoDevolucionId!: number;

  @Field(() => GraphQLISODateTime)
  fechaInicio!: Date;

  @Field(() => GraphQLISODateTime)
  fechaFin!: Date;

  @Field(() => Int)
  diasAlquiler!: number;

  @Field(() => Float)
  montoBase!: number;
}
