import { Field, Float, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';

import { AlquilerEstado } from '../common/enums';

@ObjectType()
export class AlquilerType {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  reservaId!: number;

  @Field(() => Int)
  vehiculoId!: number;

  @Field(() => GraphQLISODateTime)
  fechaEntregaProgramada!: Date;

  @Field(() => GraphQLISODateTime)
  fechaDevolucionProgramada!: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  fechaEntregaReal?: Date | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  fechaDevolucionReal?: Date | null;

  @Field(() => Int, { nullable: true })
  kilometrajeSalida?: number | null;

  @Field(() => Int, { nullable: true })
  kilometrajeRetorno?: number | null;

  @Field(() => String, { nullable: true })
  combustibleSalida?: string | null;

  @Field(() => String, { nullable: true })
  combustibleRetorno?: string | null;

  @Field(() => String, { nullable: true })
  estadoVehiculoEntrega?: string | null;

  @Field(() => String, { nullable: true })
  estadoVehiculoDevolucion?: string | null;

  @Field(() => String, { nullable: true })
  danios?: string | null;

  @Field(() => String, { nullable: true })
  incidencias?: string | null;

  @Field(() => Float)
  cargosAdicionalesTotal!: number;

  @Field(() => AlquilerEstado)
  estado!: AlquilerEstado;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
