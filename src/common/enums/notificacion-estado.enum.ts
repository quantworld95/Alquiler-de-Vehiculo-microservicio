import { registerEnumType } from '@nestjs/graphql';

export enum NotificacionEstado {
  PENDIENTE = 'PENDIENTE',
  ENVIADA = 'ENVIADA',
  LEIDA = 'LEIDA',
}

registerEnumType(NotificacionEstado, {
  name: 'NotificacionEstado',
});
