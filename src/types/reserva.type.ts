import { Field, Float, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';

import { FirmaContratoEstado, ReservaEstado } from '../common/enums';

@ObjectType()
export class ReservaType {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  clienteId!: number;

  @Field(() => Int)
  vehiculoId!: number;

  @Field(() => Int, { nullable: true })
  pagoId?: number | null;

  @Field(() => String, { nullable: true })
  facturaComprobanteId?: string | null;

  @Field(() => String, { nullable: true })
  contratoDocumentoId?: string | null;

  @Field(() => Int)
  puntoRecogidaId!: number;

  @Field(() => Int)
  puntoDevolucionId!: number;

  @Field(() => GraphQLISODateTime)
  fechaInicio!: Date;

  @Field(() => GraphQLISODateTime)
  fechaFin!: Date;

  @Field(() => ReservaEstado)
  estado!: ReservaEstado;

  @Field(() => FirmaContratoEstado)
  firmaContratoEstado!: FirmaContratoEstado;

  @Field(() => GraphQLISODateTime, { nullable: true })
  fechaFirmaContrato?: Date | null;

  @Field(() => Float)
  montoBase!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
