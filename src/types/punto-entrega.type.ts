import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PuntoEntregaType {
  @Field(() => Int)
  id!: number;

  @Field()
  nombre!: string;

  @Field()
  tipo!: string;

  @Field()
  direccion!: string;

  @Field()
  ciudad!: string;

  @Field()
  estado!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
