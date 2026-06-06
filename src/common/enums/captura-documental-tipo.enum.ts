import { registerEnumType } from '@nestjs/graphql';

export enum CapturaDocumentalTipo {
  SELFIE_ROSTRO = 'SELFIE_ROSTRO',
  DOCUMENTO_ANVERSO = 'DOCUMENTO_ANVERSO',
  DOCUMENTO_REVERSO = 'DOCUMENTO_REVERSO',
  LICENCIA_ANVERSO = 'LICENCIA_ANVERSO',
  LICENCIA_REVERSO = 'LICENCIA_REVERSO',
}

registerEnumType(CapturaDocumentalTipo, {
  name: 'CapturaDocumentalTipo',
});
