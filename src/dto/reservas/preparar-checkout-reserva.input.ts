import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsInt, Min } from 'class-validator';

@InputType()
export class PrepararCheckoutReservaInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  clienteId!: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  vehiculoId!: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  puntoRecogidaId!: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  puntoDevolucionId!: number;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  fechaInicio!: Date;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  fechaFin!: Date;
}
