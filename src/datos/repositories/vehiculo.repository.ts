import { Injectable } from '@nestjs/common';

import { AlquilerEstado, ReservaEstado, VehiculoEstado } from '../../common/enums';
import { PrismaService } from '../prisma';

type VehiculoCreateData = {
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  imagenUrl?: string;
  precioDia: number;
  estado: VehiculoEstado;
  categoriaId: number;
};

type VehiculoUpdateData = Partial<VehiculoCreateData>;

type VehiculosDisponiblesFilter = {
  fechaInicio: Date;
  fechaFin: Date;
  categoriaId?: number;
};

@Injectable()
export class VehiculoRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: VehiculoCreateData) {
    return this.prisma.vehiculo.create({ data });
  }

  findAll() {
    return this.prisma.vehiculo.findMany({
      orderBy: { id: 'asc' },
    });
  }

  findById(id: number) {
    return this.prisma.vehiculo.findUnique({
      where: { id },
    });
  }

  update(id: number, data: VehiculoUpdateData) {
    return this.prisma.vehiculo.update({
      where: { id },
      data,
    });
  }

  findDisponibles(filter: VehiculosDisponiblesFilter) {
    return this.prisma.vehiculo.findMany({
      where: {
        estado: {
          notIn: [VehiculoEstado.MANTENIMIENTO, VehiculoEstado.INACTIVO],
        },
        categoriaId: filter.categoriaId,
        reservas: {
          none: {
            estado: {
              in: [
                ReservaEstado.PENDIENTE,
                ReservaEstado.CONFIRMADA,
                ReservaEstado.LISTA_PARA_ENTREGA,
              ],
            },
            fechaInicio: { lt: filter.fechaFin },
            fechaFin: { gt: filter.fechaInicio },
          },
        },
        alquileres: {
          none: {
            estado: {
              in: [AlquilerEstado.PENDIENTE_ENTREGA, AlquilerEstado.EN_CURSO],
            },
            fechaEntregaProgramada: { lt: filter.fechaFin },
            fechaDevolucionProgramada: { gt: filter.fechaInicio },
          },
        },
      },
      orderBy: { id: 'asc' },
    });
  }
}
