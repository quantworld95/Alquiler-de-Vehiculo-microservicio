import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsOptional, Min } from 'class-validator';

@InputType()
export class BuscarVehiculosDisponiblesInput {
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

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  categoriaId?: number;
}
