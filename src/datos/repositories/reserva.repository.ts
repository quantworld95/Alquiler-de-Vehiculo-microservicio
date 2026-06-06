import { Injectable } from '@nestjs/common';

import {
  AlquilerEstado,
  FirmaContratoEstado,
  ReservaEstado,
  VehiculoEstado,
} from '../../common/enums';
import { PrismaService } from '../prisma';

type ReservaConfirmadaPorPagoData = {
  clienteId: number;
  vehiculoId: number;
  puntoRecogidaId: number;
  puntoDevolucionId: number;
  fechaInicio: Date;
  fechaFin: Date;
  montoBase: number;
  pagoId: number;
  facturaComprobanteId: string;
};

type ContratoFirmadoData = {
  reservaId: number;
  contratoDocumentoId: string;
};

@Injectable()
export class ReservaRepository {
  constructor(private readonly prisma: PrismaService) {}

  confirmarPorPago(data: ReservaConfirmadaPorPagoData) {
    return this.prisma.$transaction(async (tx) => {
      const reservaExistente = await tx.reserva.findFirst({
        where: { pagoId: data.pagoId },
      });

      if (reservaExistente) {
        return reservaExistente;
      }

      const vehiculoDisponible = await tx.vehiculo.findFirst({
        where: {
          id: data.vehiculoId,
          estado: {
            notIn: [VehiculoEstado.MANTENIMIENTO, VehiculoEstado.INACTIVO],
          },
          reservas: {
            none: {
              estado: {
                in: [
                  ReservaEstado.PENDIENTE,
                  ReservaEstado.CONFIRMADA,
                  ReservaEstado.LISTA_PARA_ENTREGA,
                ],
              },
              fechaInicio: { lt: data.fechaFin },
              fechaFin: { gt: data.fechaInicio },
            },
          },
          alquileres: {
            none: {
              estado: {
                in: [AlquilerEstado.PENDIENTE_ENTREGA, AlquilerEstado.EN_CURSO],
              },
              fechaEntregaProgramada: { lt: data.fechaFin },
              fechaDevolucionProgramada: { gt: data.fechaInicio },
            },
          },
        },
        select: { id: true },
      });

      if (!vehiculoDisponible) {
        return null;
      }

      return tx.reserva.create({
        data: {
          clienteId: data.clienteId,
          vehiculoId: data.vehiculoId,
          puntoRecogidaId: data.puntoRecogidaId,
          puntoDevolucionId: data.puntoDevolucionId,
          fechaInicio: data.fechaInicio,
          fechaFin: data.fechaFin,
          montoBase: data.montoBase,
          pagoId: data.pagoId,
          facturaComprobanteId: data.facturaComprobanteId,
          estado: ReservaEstado.CONFIRMADA,
        },
      });
    });
  }

  findById(id: number) {
    return this.prisma.reserva.findUnique({
      where: { id },
    });
  }

  registrarContratoFirmado(data: ContratoFirmadoData) {
    return this.prisma.reserva.update({
      where: { id: data.reservaId },
      data: {
        contratoDocumentoId: data.contratoDocumentoId,
        firmaContratoEstado: FirmaContratoEstado.FIRMADO,
        fechaFirmaContrato: new Date(),
        estado: ReservaEstado.LISTA_PARA_ENTREGA,
      },
    });
  }

  findByClienteId(clienteId: number) {
    return this.prisma.reserva.findMany({
      where: { clienteId },
      orderBy: { id: 'desc' },
    });
  }
}
