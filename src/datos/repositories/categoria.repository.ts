import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma';

@Injectable()
export class CategoriaRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { nombre: string; descripcion?: string; activo: boolean }) {
    return this.prisma.categoriaVehiculo.create({ data });
  }

  findAll() {
    return this.prisma.categoriaVehiculo.findMany({
      orderBy: { id: 'asc' },
    });
  }

  findById(id: number) {
    return this.prisma.categoriaVehiculo.findUnique({
      where: { id },
    });
  }

  update(id: number, data: { nombre?: string; descripcion?: string; activo?: boolean }) {
    return this.prisma.categoriaVehiculo.update({
      where: { id },
      data,
    });
  }

  exists(id: number): Promise<boolean> {
    return this.prisma.categoriaVehiculo
      .findUnique({
        where: { id },
        select: { id: true },
      })
      .then(Boolean);
  }
}
