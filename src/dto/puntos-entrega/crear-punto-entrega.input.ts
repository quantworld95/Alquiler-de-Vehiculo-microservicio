import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CrearPuntoEntregaInput {
  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nombre!: string;

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  tipo!: string;

  @Field()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  direccion!: string;

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  ciudad!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  estado?: string;
}
