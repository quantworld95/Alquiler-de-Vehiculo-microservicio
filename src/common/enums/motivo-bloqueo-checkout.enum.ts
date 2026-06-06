import { registerEnumType } from '@nestjs/graphql';

export enum MotivoBloqueoCheckout {
  PERFIL_CLIENTE_INCOMPLETO = 'PERFIL_CLIENTE_INCOMPLETO',
  VALIDACION_DOCUMENTAL_PENDIENTE = 'VALIDACION_DOCUMENTAL_PENDIENTE',
  VALIDACION_DOCUMENTAL_RECHAZADA = 'VALIDACION_DOCUMENTAL_RECHAZADA',
  LICENCIA_VENCIDA = 'LICENCIA_VENCIDA',
}

registerEnumType(MotivoBloqueoCheckout, {
  name: 'MotivoBloqueoCheckout',
});
