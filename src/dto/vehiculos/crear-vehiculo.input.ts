import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { VehiculoEstado } from '../../common/enums';

@InputType()
export class CrearVehiculoInput {
  @Field()
  @IsString()
  @MinLength(5)
  @MaxLength(12)
  placa!: string;

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  marca!: string;

  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  modelo!: string;

  @Field(() => Int)
  @IsInt()
  @Min(1900)
  @Max(2100)
  anio!: number;

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  color!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  imagenUrl?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  precioDia!: number;

  @Field(() => VehiculoEstado, { nullable: true })
  @IsOptional()
  @IsEnum(VehiculoEstado)
  estado?: VehiculoEstado;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  categoriaId!: number;
}
