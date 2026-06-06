import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString, MaxLength, Min } from 'class-validator';

@InputType()
export class RegistrarContratoFirmadoInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  reservaId!: number;

  @Field()
  @IsString()
  @MaxLength(120)
  contratoDocumentoId!: string;
}
