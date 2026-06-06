import { Injectable } from '@nestjs/common';

import {
  AlquilerEstado,
  FirmaContratoEstado,
  ReservaEstado,
  VehiculoEstado,
} from '../common/enums';
import { BusinessRuleException, ResourceNotFoundException } from '../common/errors';
import { AlquilerRepository } from '../datos/repositories/alquiler.repository';
import { ReservaRepository } from '../datos/repositories/reserva.repository';
import { IniciarAlquilerInput } from '../dto/alquileres/iniciar-alquiler.input';
import { RegistrarDevolucionInput } from '../dto/alquileres/registrar-devolucion.input';
import { AlquilerType } from '../types';

type AlquilerRecord = {
  id: number;
  reservaId: number;
  vehiculoId: number;
  fechaEntregaProgramada: Date;
  fechaDevolucionProgramada: Date;
  fechaEntregaReal: Date | null;
  fechaDevolucionReal: Date | null;
  kilometrajeSalida: number | null;
  kilometrajeRetorno: number | null;
  combustibleSalida: string | null;
  combustibleRetorno: string | null;
  estadoVehiculoEntrega: string | null;
  estadoVehiculoDevolucion: string | null;
  danios: string | null;
  incidencias: string | null;
  cargosAdicionalesTotal: { toString: () => string };
  estado: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class AlquilerService {
  constructor(
    private readonly alquilerRepository: AlquilerRepository,
    private readonly reservaRepository: ReservaRepository,
  ) {}

  async iniciarAlquiler(input: IniciarAlquilerInput): Promise<AlquilerType> {
    const reserva = await this.reservaRepository.findById(input.reservaId);

    if (!reserva) {
      throw new ResourceNotFoundException('Reserva', input.reservaId);
    }

    if (reserva.estado !== ReservaEstado.LISTA_PARA_ENTREGA) {
      throw new BusinessRuleException('Only reservations ready for delivery can start a rental', {
        reservaId: input.reservaId,
        estado: reserva.estado,
      });
    }

    if (
      reserva.firmaContratoEstado !== FirmaContratoEstado.FIRMADO ||
      !reserva.contratoDocumentoId
    ) {
      throw new BusinessRuleException('The signed contract is required before vehicle delivery', {
        reservaId: input.reservaId,
        firmaContratoEstado: reserva.firmaContratoEstado,
      });
    }

    const alquiler = await this.alquilerRepository.iniciar({
      reservaId: reserva.id,
      vehiculoId: reserva.vehiculoId,
      fechaEntregaProgramada: reserva.fechaInicio,
      fechaDevolucionProgramada: reserva.fechaFin,
      fechaEntregaReal: input.fechaEntregaReal ?? new Date(),
      kilometrajeSalida: input.kilometrajeSalida,
      combustibleSalida: input.combustibleSalida,
      estadoVehiculoEntrega: input.estadoVehiculoEntrega,
    });

    return this.toType(alquiler);
  }

  async registrarDevolucion(input: RegistrarDevolucionInput): Promise<AlquilerType> {
    const alquiler = await this.alquilerRepository.findById(input.alquilerId);

    if (!alquiler) {
      throw new ResourceNotFoundException('Alquiler', input.alquilerId);
    }

    if (alquiler.estado !== AlquilerEstado.EN_CURSO) {
      throw new BusinessRuleException('Only rentals in progress can be returned', {
        alquilerId: input.alquilerId,
        estado: alquiler.estado,
      });
    }

    const fechaDevolucionReal = input.fechaDevolucionReal ?? new Date();

    if (alquiler.fechaEntregaReal && fechaDevolucionReal < alquiler.fechaEntregaReal) {
      throw new BusinessRuleException('The return date cannot be before the delivery date', {
        alquilerId: input.alquilerId,
        fechaEntregaReal: alquiler.fechaEntregaReal,
        fechaDevolucionReal,
      });
    }

    if (
      input.kilometrajeRetorno !== undefined &&
      alquiler.kilometrajeSalida !== null &&
      input.kilometrajeRetorno < alquiler.kilometrajeSalida
    ) {
      throw new BusinessRuleException('The return mileage cannot be less than the departure mileage', {
        alquilerId: input.alquilerId,
        kilometrajeSalida: alquiler.kilometrajeSalida,
        kilometrajeRetorno: input.kilometrajeRetorno,
      });
    }

    const requiereRevision = Boolean(input.danios?.trim() || input.incidencias?.trim());
    const alquilerActualizado = await this.alquilerRepository.registrarDevolucion({
      alquilerId: alquiler.id,
      vehiculoId: alquiler.vehiculoId,
      fechaDevolucionReal,
      kilometrajeRetorno: input.kilometrajeRetorno,
      combustibleRetorno: input.combustibleRetorno,
      estadoVehiculoDevolucion: input.estadoVehiculoDevolucion,
      danios: input.danios,
      incidencias: input.incidencias,
      estadoAlquiler: requiereRevision ? AlquilerEstado.OBSERVADO : AlquilerEstado.FINALIZADO,
      estadoVehiculo: requiereRevision ? VehiculoEstado.MANTENIMIENTO : VehiculoEstado.DISPONIBLE,
    });

    return this.toType(alquilerActualizado);
  }

  async obtenerAlquilerPorId(id: number): Promise<AlquilerType> {
    const alquiler = await this.alquilerRepository.findById(id);

    if (!alquiler) {
      throw new ResourceNotFoundException('Alquiler', id);
    }

    return this.toType(alquiler);
  }

  async obtenerAlquilerPorReserva(reservaId: number): Promise<AlquilerType> {
    const alquiler = await this.alquilerRepository.findByReservaId(reservaId);

    if (!alquiler) {
      throw new ResourceNotFoundException('Alquiler de reserva', reservaId);
    }

    return this.toType(alquiler);
  }

  private toType(alquiler: AlquilerRecord): AlquilerType {
    return {
      ...alquiler,
      cargosAdicionalesTotal: Number(alquiler.cargosAdicionalesTotal.toString()),
      estado: alquiler.estado as AlquilerEstado,
    };
  }
}
