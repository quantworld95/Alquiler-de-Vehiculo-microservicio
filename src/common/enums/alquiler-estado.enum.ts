import { registerEnumType } from '@nestjs/graphql';

export enum AlquilerEstado {
  PENDIENTE_ENTREGA = 'PENDIENTE_ENTREGA',
  EN_CURSO = 'EN_CURSO',
  FINALIZADO = 'FINALIZADO',
  OBSERVADO = 'OBSERVADO',
  CANCELADO = 'CANCELADO',
}

registerEnumType(AlquilerEstado, {
  name: 'AlquilerEstado',
});
