import { registerEnumType } from '@nestjs/graphql';

export enum ReservaEstado {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  LISTA_PARA_ENTREGA = 'LISTA_PARA_ENTREGA',
  CANCELADA = 'CANCELADA',
  VENCIDA = 'VENCIDA',
}

registerEnumType(ReservaEstado, {
  name: 'ReservaEstado',
});
