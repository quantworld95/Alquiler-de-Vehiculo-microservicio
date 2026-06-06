import { Injectable } from '@nestjs/common';

export type PerfilClienteValidationResult = {
  completo: boolean;
  camposFaltantes: string[];
};

@Injectable()
export class UsuariosApiClient {
  async validarPerfilCliente(clienteId: number): Promise<PerfilClienteValidationResult> {
    void clienteId;

    // Simula consulta a MS Usuarios y Seguridad.
    // Luego se reemplaza por GET /usuarios/{id} o endpoint equivalente.
    return {
      completo: true,
      camposFaltantes: [],
    };
  }
}
