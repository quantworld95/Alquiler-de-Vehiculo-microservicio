import { Injectable } from '@nestjs/common';

import { FirmaContratoEstado, ReservaEstado, VehiculoEstado } from '../common/enums';
import { BusinessRuleException, ResourceNotFoundException } from '../common/errors';
import { PuntoEntregaRepository } from '../datos/repositories/punto-entrega.repository';
import { ReservaRepository } from '../datos/repositories/reserva.repository';
import { VehiculoRepository } from '../datos/repositories/vehiculo.repository';
import { CrearReservaInput } from '../dto/reservas/crear-reserva.input';
import { ReservaType } from '../types';
import { validateDateRange } from '../validators';

type ReservaRecord = {
  id: number;
  clienteId: number;
  vehiculoId: number;
  pagoId: number | null;
  facturaComprobanteId: string | null;
  contratoDocumentoId: string | null;
  puntoRecogidaId: number;
  puntoDevolucionId: number;
  fechaInicio: Date;
  fechaFin: Date;
  estado: string;
  firmaContratoEstado: string;
  fechaFirmaContrato: Date | null;
  montoBase: { toString: () => string };
  createdAt: Date;
  updatedAt: Date;
};

type VehiculoRecord = {
  id: number;
  precioDia: { toString: () => string };
  estado: string;
};

@Injectable()
export class ReservaService {
  constructor(
    private readonly reservaRepository: ReservaRepository,
    private readonly vehiculoRepository: VehiculoRepository,
    private readonly puntoEntregaRepository: PuntoEntregaRepository,
  ) {}

  async crearReserva(input: CrearReservaInput): Promise<ReservaType> {
    validateDateRange(input.fechaInicio, input.fechaFin);
    await this.validarPuntoEntrega(input.puntoRecogidaId);
    await this.validarPuntoEntrega(input.puntoDevolucionId);

    const vehiculo = await this.obtenerVehiculo(input.vehiculoId);
    await this.validarVehiculoDisponible(input, vehiculo.id);

    const reserva = await this.reservaRepository.create({
      clienteId: input.clienteId,
      vehiculoId: input.vehiculoId,
      puntoRecogidaId: input.puntoRecogidaId,
      puntoDevolucionId: input.puntoDevolucionId,
      fechaInicio: input.fechaInicio,
      fechaFin: input.fechaFin,
      montoBase: this.calcularMontoBase(input.fechaInicio, input.fechaFin, vehiculo),
    });

    return this.toType(reserva);
  }

  async obtenerReservaPorId(id: number): Promise<ReservaType> {
    const reserva = await this.reservaRepository.findById(id);

    if (!reserva) {
      throw new ResourceNotFoundException('Reserva', id);
    }

    return this.toType(reserva);
  }

  async listarReservasPorCliente(clienteId: number): Promise<ReservaType[]> {
    const reservas = await this.reservaRepository.findByClienteId(clienteId);
    return reservas.map((reserva) => this.toType(reserva));
  }

  private async obtenerVehiculo(vehiculoId: number): Promise<VehiculoRecord> {
    const vehiculo = await this.vehiculoRepository.findById(vehiculoId);

    if (!vehiculo) {
      throw new ResourceNotFoundException('Vehiculo', vehiculoId);
    }

    if (vehiculo.estado !== VehiculoEstado.DISPONIBLE) {
      throw new BusinessRuleException('The vehicle is not available for reservation', {
        vehiculoId,
        estado: vehiculo.estado,
      });
    }

    return vehiculo;
  }

  private async validarVehiculoDisponible(input: CrearReservaInput, vehiculoId: number): Promise<void> {
    const disponibles = await this.vehiculoRepository.findDisponibles({
      fechaInicio: input.fechaInicio,
      fechaFin: input.fechaFin,
    });

    const isDisponible = disponibles.some((vehiculo) => vehiculo.id === vehiculoId);

    if (!isDisponible) {
      throw new BusinessRuleException('The vehicle has a reservation or rental conflict', {
        vehiculoId,
        fechaInicio: input.fechaInicio,
        fechaFin: input.fechaFin,
      });
    }
  }

  private async validarPuntoEntrega(puntoEntregaId: number): Promise<void> {
    const exists = await this.puntoEntregaRepository.exists(puntoEntregaId);

    if (!exists) {
      throw new ResourceNotFoundException('PuntoEntrega', puntoEntregaId);
    }
  }

  private calcularMontoBase(fechaInicio: Date, fechaFin: Date, vehiculo: VehiculoRecord): number {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const rentalDays = Math.max(
      1,
      Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / millisecondsPerDay),
    );

    return Number(vehiculo.precioDia.toString()) * rentalDays;
  }

  private toType(reserva: ReservaRecord): ReservaType {
    return {
      ...reserva,
      estado: reserva.estado as ReservaEstado,
      firmaContratoEstado: reserva.firmaContratoEstado as FirmaContratoEstado,
      montoBase: Number(reserva.montoBase.toString()),
    };
  }
}
