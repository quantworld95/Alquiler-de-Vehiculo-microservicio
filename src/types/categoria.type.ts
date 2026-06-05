import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoriaType {
  @Field(() => Int)
  id!: number;

  @Field()
  nombre!: string;

  @Field(() => String, { nullable: true })
  descripcion?: string | null;

  @Field()
  activo!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
