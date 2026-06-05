import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { VehiculoEstado } from '../common/enums';

@ObjectType()
export class VehiculoType {
  @Field(() => Int)
  id!: number;

  @Field()
  placa!: string;

  @Field()
  marca!: string;

  @Field()
  modelo!: string;

  @Field(() => Int)
  anio!: number;

  @Field()
  color!: string;

  @Field(() => String, { nullable: true })
  imagenUrl?: string | null;

  @Field(() => Float)
  precioDia!: number;

  @Field(() => VehiculoEstado)
  estado!: VehiculoEstado;

  @Field(() => Int)
  categoriaId!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
