import { Injectable } from '@nestjs/common';

import { VehiculoEstado } from '../common/enums';
import { ResourceNotFoundException } from '../common/errors';
import { CategoriaRepository } from '../datos/repositories/categoria.repository';
import { PuntoEntregaRepository } from '../datos/repositories/punto-entrega.repository';
import { VehiculoRepository } from '../datos/repositories/vehiculo.repository';
import { ActualizarVehiculoInput } from '../dto/vehiculos/actualizar-vehiculo.input';
import { BuscarVehiculosDisponiblesInput } from '../dto/vehiculos/buscar-vehiculos-disponibles.input';
import { CrearVehiculoInput } from '../dto/vehiculos/crear-vehiculo.input';
import { VehiculoType } from '../types';
import { validateDateRange } from '../validators';

type VehiculoRecord = {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  imagenUrl?: string | null;
  precioDia: { toString: () => string };
  estado: string;
  categoriaId: number;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class VehiculoService {
  constructor(
    private readonly vehiculoRepository: VehiculoRepository,
    private readonly categoriaRepository: CategoriaRepository,
    private readonly puntoEntregaRepository: PuntoEntregaRepository,
  ) {}

  async crearVehiculo(input: CrearVehiculoInput): Promise<VehiculoType> {
    await this.validarCategoria(input.categoriaId);

    const vehiculo = await this.vehiculoRepository.create({
      placa: input.placa.trim().toUpperCase(),
      marca: input.marca.trim(),
      modelo: input.modelo.trim(),
      anio: input.anio,
      color: input.color.trim(),
      imagenUrl: input.imagenUrl?.trim(),
      precioDia: input.precioDia,
      estado: input.estado ?? VehiculoEstado.DISPONIBLE,
      categoriaId: input.categoriaId,
    });

    return this.toType(vehiculo);
  }

  async listarVehiculos(): Promise<VehiculoType[]> {
    const vehiculos = await this.vehiculoRepository.findAll();
    return vehiculos.map((vehiculo) => this.toType(vehiculo));
  }

  async obtenerVehiculoPorId(id: number): Promise<VehiculoType> {
    const vehiculo = await this.vehiculoRepository.findById(id);

    if (!vehiculo) {
      throw new ResourceNotFoundException('Vehiculo', id);
    }

    return this.toType(vehiculo);
  }

  async actualizarVehiculo(id: number, input: ActualizarVehiculoInput): Promise<VehiculoType> {
    await this.obtenerVehiculoPorId(id);

    if (input.categoriaId !== undefined) {
      await this.validarCategoria(input.categoriaId);
    }

    const vehiculo = await this.vehiculoRepository.update(id, {
      placa: input.placa?.trim().toUpperCase(),
      marca: input.marca?.trim(),
      modelo: input.modelo?.trim(),
      anio: input.anio,
      color: input.color?.trim(),
      imagenUrl: input.imagenUrl?.trim(),
      precioDia: input.precioDia,
      estado: input.estado,
      categoriaId: input.categoriaId,
    });

    return this.toType(vehiculo);
  }

  async buscarVehiculosDisponibles(
    input: BuscarVehiculosDisponiblesInput,
  ): Promise<VehiculoType[]> {
    validateDateRange(input.fechaInicio, input.fechaFin);
    await this.validarPuntoEntrega(input.puntoRecogidaId);
    await this.validarPuntoEntrega(input.puntoDevolucionId);

    if (input.categoriaId !== undefined) {
      await this.validarCategoria(input.categoriaId);
    }

    const vehiculos = await this.vehiculoRepository.findDisponibles({
      fechaInicio: input.fechaInicio,
      fechaFin: input.fechaFin,
      categoriaId: input.categoriaId,
    });

    return vehiculos.map((vehiculo) => this.toType(vehiculo));
  }

  private async validarCategoria(categoriaId: number): Promise<void> {
    const exists = await this.categoriaRepository.exists(categoriaId);

    if (!exists) {
      throw new ResourceNotFoundException('CategoriaVehiculo', categoriaId);
    }
  }

  private async validarPuntoEntrega(puntoEntregaId: number): Promise<void> {
    const exists = await this.puntoEntregaRepository.exists(puntoEntregaId);

    if (!exists) {
      throw new ResourceNotFoundException('PuntoEntrega', puntoEntregaId);
    }
  }

  private toType(vehiculo: VehiculoRecord): VehiculoType {
    return {
      ...vehiculo,
      precioDia: Number(vehiculo.precioDia.toString()),
      estado: vehiculo.estado as VehiculoEstado,
    };
  }
}
