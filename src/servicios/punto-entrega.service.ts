import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '../common/errors';
import { PuntoEntregaRepository } from '../datos/repositories/punto-entrega.repository';
import { ActualizarPuntoEntregaInput } from '../dto/puntos-entrega/actualizar-punto-entrega.input';
import { CrearPuntoEntregaInput } from '../dto/puntos-entrega/crear-punto-entrega.input';
import { PuntoEntregaType } from '../types';

@Injectable()
export class PuntoEntregaService {
  constructor(private readonly puntoEntregaRepository: PuntoEntregaRepository) {}

  async crearPuntoEntrega(input: CrearPuntoEntregaInput): Promise<PuntoEntregaType> {
    return this.puntoEntregaRepository.create({
      nombre: input.nombre.trim(),
      tipo: input.tipo.trim(),
      direccion: input.direccion.trim(),
      ciudad: input.ciudad.trim(),
      estado: input.estado?.trim() ?? 'ACTIVO',
    });
  }

  async listarPuntosEntrega(): Promise<PuntoEntregaType[]> {
    return this.puntoEntregaRepository.findAll();
  }

  async obtenerPuntoEntregaPorId(id: number): Promise<PuntoEntregaType> {
    const puntoEntrega = await this.puntoEntregaRepository.findById(id);

    if (!puntoEntrega) {
      throw new ResourceNotFoundException('PuntoEntrega', id);
    }

    return puntoEntrega;
  }

  async actualizarPuntoEntrega(
    id: number,
    input: ActualizarPuntoEntregaInput,
  ): Promise<PuntoEntregaType> {
    await this.obtenerPuntoEntregaPorId(id);

    return this.puntoEntregaRepository.update(id, {
      nombre: input.nombre?.trim(),
      tipo: input.tipo?.trim(),
      direccion: input.direccion?.trim(),
      ciudad: input.ciudad?.trim(),
      estado: input.estado?.trim(),
    });
  }
}
