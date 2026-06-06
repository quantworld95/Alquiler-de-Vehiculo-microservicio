import { Injectable } from '@nestjs/common';

import { CapturaDocumentalTipo } from '../../common/enums';

export type ValidacionDocumentalResult = {
  aprobada: boolean;
  estado: 'APROBADA' | 'PENDIENTE' | 'RECHAZADA' | 'VENCIDA';
  validacionIaId?: number;
  documentosIds: string[];
  requiereCapturaDocumental: boolean;
  capturasRequeridas: CapturaDocumentalTipo[];
  documentalUploadUrl?: string;
};

@Injectable()
export class IaDocumentalClient {
  async validarDocumentosCliente(clienteId: number): Promise<ValidacionDocumentalResult> {
    void clienteId;

    // Simula consulta a MS Documental / MS Inteligencia Artificial.
    // Las imagenes de selfie, CI y licencia no se guardan en MS Alquiler.
    return {
      aprobada: true,
      estado: 'APROBADA',
      validacionIaId: 1,
      documentosIds: [],
      requiereCapturaDocumental: false,
      capturasRequeridas: [],
      documentalUploadUrl: undefined,
    };
  }

  obtenerInstruccionesCaptura(clienteId: number): Pick<
    ValidacionDocumentalResult,
    'requiereCapturaDocumental' | 'capturasRequeridas' | 'documentalUploadUrl'
  > {
    return {
      requiereCapturaDocumental: true,
      capturasRequeridas: [
        CapturaDocumentalTipo.SELFIE_ROSTRO,
        CapturaDocumentalTipo.DOCUMENTO_ANVERSO,
        CapturaDocumentalTipo.DOCUMENTO_REVERSO,
        CapturaDocumentalTipo.LICENCIA_ANVERSO,
        CapturaDocumentalTipo.LICENCIA_REVERSO,
      ],
      documentalUploadUrl: `/documentos/clientes/${clienteId}/validacion-identidad`,
    };
  }
}
