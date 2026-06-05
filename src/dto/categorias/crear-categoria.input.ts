import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CrearCategoriaInput {
  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  nombre!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  descripcion?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
