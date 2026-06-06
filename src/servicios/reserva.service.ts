import { Injectable } from '@nestjs/common';

import {
  FirmaContratoEstado,
  MotivoBloqueoCheckout,
  ReservaEstado,
  VehiculoEstado,
} from '../common/enums';
import { BusinessRuleException, ResourceNotFoundException } from '../common/errors';
import { IaDocumentalClient } from '../datos/external/ia-documental.client';
import { UsuariosApiClient } from '../datos/external/usuarios-api.client';
import { PuntoEntregaRepository } from '../datos/repositories/punto-entrega.repository';
import { ReservaRepository } from '../datos/repositories/reserva.repository';
import { VehiculoRepository } from '../datos/repositories/vehiculo.repository';
import { ConfirmarReservaPagoInput } from '../dto/reservas/confirmar-reserva-pago.input';
import { PrepararCheckoutReservaInput } from '../dto/reservas/preparar-checkout-reserva.input';
import { RegistrarContratoFirmadoInput } from '../dto/reservas/registrar-contrato-firmado.input';
import { CheckoutReservaType, ReservaType } from '../types';
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
    private readonly usuariosApiClient: UsuariosApiClient,
    private readonly iaDocumentalClient: IaDocumentalClient,
  ) {}

  async prepararCheckoutReserva(input: PrepararCheckoutReservaInput): Promise<CheckoutReservaType> {
    validateDateRange(input.fechaInicio, input.fechaFin);
    await this.validarPuntoEntrega(input.puntoRecogidaId);
    await this.validarPuntoEntrega(input.puntoDevolucionId);

    const vehiculo = await this.obtenerVehiculo(input.vehiculoId);
    await this.validarVehiculoDisponible(input, vehiculo.id);
    const diasAlquiler = this.calcularDiasAlquiler(input.fechaInicio, input.fechaFin);
    const montoBase = this.calcularMontoBase(diasAlquiler, vehiculo);
    const perfilCliente = await this.usuariosApiClient.validarPerfilCliente(input.clienteId);

    if (!perfilCliente.completo) {
      return {
        puedeContinuarPago: false,
        motivoBloqueo: MotivoBloqueoCheckout.PERFIL_CLIENTE_INCOMPLETO,
        camposPerfilFaltantes: perfilCliente.camposFaltantes,
        estadoValidacionDocumental: null,
        validacionIaId: null,
        requiereCapturaDocumental: false,
        capturasRequeridas: [],
        documentalUploadUrl: null,
        clienteId: input.clienteId,
        vehiculoId: input.vehiculoId,
        puntoRecogidaId: input.puntoRecogidaId,
        puntoDevolucionId: input.puntoDevolucionId,
        fechaInicio: input.fechaInicio,
        fechaFin: input.fechaFin,
        diasAlquiler,
        montoBase,
      };
    }

    const validacionDocumental = await this.iaDocumentalClient.validarDocumentosCliente(
      input.clienteId,
    );

    if (!validacionDocumental.aprobada) {
      const instruccionesCaptura = this.iaDocumentalClient.obtenerInstruccionesCaptura(
        input.clienteId,
      );

      return {
        puedeContinuarPago: false,
        motivoBloqueo: this.obtenerMotivoBloqueoDocumental(validacionDocumental.estado),
        camposPerfilFaltantes: [],
        estadoValidacionDocumental: validacionDocumental.estado,
        validacionIaId: validacionDocumental.validacionIaId ?? null,
        requiereCapturaDocumental: instruccionesCaptura.requiereCapturaDocumental,
        capturasRequeridas: instruccionesCaptura.capturasRequeridas,
        documentalUploadUrl: instruccionesCaptura.documentalUploadUrl ?? null,
        clienteId: input.clienteId,
        vehiculoId: input.vehiculoId,
        puntoRecogidaId: input.puntoRecogidaId,
        puntoDevolucionId: input.puntoDevolucionId,
        fechaInicio: input.fechaInicio,
        fechaFin: input.fechaFin,
        diasAlquiler,
        montoBase,
      };
    }

    return {
      puedeContinuarPago: true,
      motivoBloqueo: null,
      camposPerfilFaltantes: [],
      estadoValidacionDocumental: validacionDocumental.estado,
      validacionIaId: validacionDocumental.validacionIaId ?? null,
      requiereCapturaDocumental: false,
      capturasRequeridas: [],
      documentalUploadUrl: null,
      clienteId: input.clienteId,
      vehiculoId: input.vehiculoId,
      puntoRecogidaId: input.puntoRecogidaId,
      puntoDevolucionId: input.puntoDevolucionId,
      fechaInicio: input.fechaInicio,
      fechaFin: input.fechaFin,
      diasAlquiler,
      montoBase,
    };
  }

  async confirmarReservaPorPago(input: ConfirmarReservaPagoInput): Promise<ReservaType> {
    validateDateRange(input.fechaInicio, input.fechaFin);
    await this.validarPuntoEntrega(input.puntoRecogidaId);
    await this.validarPuntoEntrega(input.puntoDevolucionId);

    const vehiculo = await this.obtenerVehiculo(input.vehiculoId);
    await this.validarVehiculoDisponible(input, vehiculo.id);
    await this.validarClienteHabilitadoParaReserva(input.clienteId);

    const diasAlquiler = this.calcularDiasAlquiler(input.fechaInicio, input.fechaFin);
    const montoBase = this.calcularMontoBase(diasAlquiler, vehiculo);
    const reserva = await this.reservaRepository.confirmarPorPago({
      clienteId: input.clienteId,
      vehiculoId: input.vehiculoId,
      puntoRecogidaId: input.puntoRecogidaId,
      puntoDevolucionId: input.puntoDevolucionId,
      fechaInicio: input.fechaInicio,
      fechaFin: input.fechaFin,
      montoBase,
      pagoId: input.pagoId,
      facturaComprobanteId: input.facturaComprobanteId,
    });

    if (!reserva) {
      throw new BusinessRuleException('The vehicle is no longer available for these dates', {
        vehiculoId: input.vehiculoId,
        fechaInicio: input.fechaInicio,
        fechaFin: input.fechaFin,
      });
    }

    return this.toType(reserva);
  }

  async registrarContratoFirmado(input: RegistrarContratoFirmadoInput): Promise<ReservaType> {
    const reserva = await this.reservaRepository.findById(input.reservaId);

    if (!reserva) {
      throw new ResourceNotFoundException('Reserva', input.reservaId);
    }

    if (reserva.firmaContratoEstado === FirmaContratoEstado.FIRMADO) {
      if (reserva.contratoDocumentoId === input.contratoDocumentoId) {
        return this.toType(reserva);
      }

      throw new BusinessRuleException('The reservation contract is already signed', {
        reservaId: input.reservaId,
        contratoDocumentoId: reserva.contratoDocumentoId,
      });
    }

    if (reserva.estado !== ReservaEstado.CONFIRMADA) {
      throw new BusinessRuleException('Only confirmed reservations can be signed', {
        reservaId: input.reservaId,
        estado: reserva.estado,
      });
    }

    if (!reserva.pagoId || !reserva.facturaComprobanteId) {
      throw new BusinessRuleException('The reservation payment has not been confirmed', {
        reservaId: input.reservaId,
      });
    }

    const reservaActualizada = await this.reservaRepository.registrarContratoFirmado(input);
    return this.toType(reservaActualizada);
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

    if (
      vehiculo.estado === VehiculoEstado.MANTENIMIENTO ||
      vehiculo.estado === VehiculoEstado.INACTIVO
    ) {
      throw new BusinessRuleException('The vehicle is not available for reservation', {
        vehiculoId,
        estado: vehiculo.estado,
      });
    }

    return vehiculo;
  }

  private async validarVehiculoDisponible(
    input: { fechaInicio: Date; fechaFin: Date },
    vehiculoId: number,
  ): Promise<void> {
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

  private async validarClienteHabilitadoParaReserva(clienteId: number): Promise<void> {
    const perfilCliente = await this.usuariosApiClient.validarPerfilCliente(clienteId);

    if (!perfilCliente.completo) {
      throw new BusinessRuleException('The customer profile is incomplete', {
        clienteId,
        camposFaltantes: perfilCliente.camposFaltantes,
      });
    }

    const validacionDocumental = await this.iaDocumentalClient.validarDocumentosCliente(clienteId);

    if (!validacionDocumental.aprobada) {
      throw new BusinessRuleException('The customer document validation is not approved', {
        clienteId,
        estadoValidacionDocumental: validacionDocumental.estado,
        validacionIaId: validacionDocumental.validacionIaId ?? null,
      });
    }
  }

  private calcularDiasAlquiler(fechaInicio: Date, fechaFin: Date): number {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    return Math.max(
      1,
      Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / millisecondsPerDay),
    );
  }

  private calcularMontoBase(diasAlquiler: number, vehiculo: VehiculoRecord): number {
    return Number(vehiculo.precioDia.toString()) * diasAlquiler;
  }

  private obtenerMotivoBloqueoDocumental(
    estado: 'PENDIENTE' | 'RECHAZADA' | 'VENCIDA' | 'APROBADA',
  ): MotivoBloqueoCheckout | null {
    if (estado === 'PENDIENTE') {
      return MotivoBloqueoCheckout.VALIDACION_DOCUMENTAL_PENDIENTE;
    }

    if (estado === 'RECHAZADA') {
      return MotivoBloqueoCheckout.VALIDACION_DOCUMENTAL_RECHAZADA;
    }

    if (estado === 'VENCIDA') {
      return MotivoBloqueoCheckout.LICENCIA_VENCIDA;
    }

    return null;
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
