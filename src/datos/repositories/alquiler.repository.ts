import { Injectable } from '@nestjs/common';

import { AlquilerEstado, VehiculoEstado } from '../../common/enums';
import { PrismaService } from '../prisma';

type IniciarAlquilerData = {
  reservaId: number;
  vehiculoId: number;
  fechaEntregaProgramada: Date;
  fechaDevolucionProgramada: Date;
  fechaEntregaReal: Date;
  kilometrajeSalida?: number;
  combustibleSalida?: string;
  estadoVehiculoEntrega?: string;
};

type RegistrarDevolucionData = {
  alquilerId: number;
  vehiculoId: number;
  fechaDevolucionReal: Date;
  kilometrajeRetorno?: number;
  combustibleRetorno?: string;
  estadoVehiculoDevolucion?: string;
  danios?: string;
  incidencias?: string;
  estadoAlquiler: AlquilerEstado.FINALIZADO | AlquilerEstado.OBSERVADO;
  estadoVehiculo: VehiculoEstado.DISPONIBLE | VehiculoEstado.MANTENIMIENTO;
};

@Injectable()
export class AlquilerRepository {
  constructor(private readonly prisma: PrismaService) {}

  iniciar(data: IniciarAlquilerData) {
    return this.prisma.$transaction(async (tx) => {
      const alquilerExistente = await tx.alquiler.findUnique({
        where: { reservaId: data.reservaId },
      });

      if (alquilerExistente) {
        return alquilerExistente;
      }

      await tx.vehiculo.update({
        where: { id: data.vehiculoId },
        data: { estado: VehiculoEstado.ALQUILADO },
      });

      return tx.alquiler.create({
        data: {
          reservaId: data.reservaId,
          vehiculoId: data.vehiculoId,
          fechaEntregaProgramada: data.fechaEntregaProgramada,
          fechaDevolucionProgramada: data.fechaDevolucionProgramada,
          fechaEntregaReal: data.fechaEntregaReal,
          kilometrajeSalida: data.kilometrajeSalida,
          combustibleSalida: data.combustibleSalida,
          estadoVehiculoEntrega: data.estadoVehiculoEntrega,
          estado: AlquilerEstado.EN_CURSO,
        },
      });
    });
  }

  findById(id: number) {
    return this.prisma.alquiler.findUnique({
      where: { id },
    });
  }

  registrarDevolucion(data: RegistrarDevolucionData) {
    return this.prisma.$transaction(async (tx) => {
      await tx.vehiculo.update({
        where: { id: data.vehiculoId },
        data: { estado: data.estadoVehiculo },
      });

      return tx.alquiler.update({
        where: { id: data.alquilerId },
        data: {
          fechaDevolucionReal: data.fechaDevolucionReal,
          kilometrajeRetorno: data.kilometrajeRetorno,
          combustibleRetorno: data.combustibleRetorno,
          estadoVehiculoDevolucion: data.estadoVehiculoDevolucion,
          danios: data.danios,
          incidencias: data.incidencias,
          estado: data.estadoAlquiler,
        },
      });
    });
  }

  findByReservaId(reservaId: number) {
    return this.prisma.alquiler.findUnique({
      where: { reservaId },
    });
  }
}
