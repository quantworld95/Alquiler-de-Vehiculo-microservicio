import { registerEnumType } from '@nestjs/graphql';

export enum FirmaContratoEstado {
  PENDIENTE_FIRMA = 'PENDIENTE_FIRMA',
  FIRMADO = 'FIRMADO',
  ESCALADO_ADMIN = 'ESCALADO_ADMIN',
}

registerEnumType(FirmaContratoEstado, {
  name: 'FirmaContratoEstado',
});
