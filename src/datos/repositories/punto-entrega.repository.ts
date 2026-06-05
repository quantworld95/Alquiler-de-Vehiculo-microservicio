import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma';

type PuntoEntregaData = {
  nombre: string;
  tipo: string;
  direccion: string;
  ciudad: string;
  estado: string;
};

@Injectable()
export class PuntoEntregaRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: PuntoEntregaData) {
    return this.prisma.puntoEntrega.create({ data });
  }

  findAll() {
    return this.prisma.puntoEntrega.findMany({
      orderBy: { id: 'asc' },
    });
  }

  findById(id: number) {
    return this.prisma.puntoEntrega.findUnique({
      where: { id },
    });
  }

  exists(id: number): Promise<boolean> {
    return this.prisma.puntoEntrega
      .findUnique({
        where: { id },
        select: { id: true },
      })
      .then(Boolean);
  }

  update(id: number, data: Partial<PuntoEntregaData>) {
    return this.prisma.puntoEntrega.update({
      where: { id },
      data,
    });
  }
}
