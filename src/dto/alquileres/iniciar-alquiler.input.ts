import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

@InputType()
export class IniciarAlquilerInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  reservaId!: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  @IsDate()
  fechaEntregaReal?: Date;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  kilometrajeSalida?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  combustibleSalida?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  estadoVehiculoEntrega?: string;
}
