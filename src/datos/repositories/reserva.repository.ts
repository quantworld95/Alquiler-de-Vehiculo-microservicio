import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma';

type ReservaCreateData = {
  clienteId: number;
  vehiculoId: number;
  puntoRecogidaId: number;
  puntoDevolucionId: number;
  fechaInicio: Date;
  fechaFin: Date;
  montoBase: number;
};

@Injectable()
export class ReservaRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: ReservaCreateData) {
    return this.prisma.reserva.create({ data });
  }

  findById(id: number) {
    return this.prisma.reserva.findUnique({
      where: { id },
    });
  }

  findByClienteId(clienteId: number) {
    return this.prisma.reserva.findMany({
      where: { clienteId },
      orderBy: { id: 'desc' },
    });
  }
}
