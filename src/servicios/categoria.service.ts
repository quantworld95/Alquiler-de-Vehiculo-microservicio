import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '../common/errors';
import { CategoriaRepository } from '../datos/repositories/categoria.repository';
import { ActualizarCategoriaInput } from '../dto/categorias/actualizar-categoria.input';
import { CrearCategoriaInput } from '../dto/categorias/crear-categoria.input';
import { CategoriaType } from '../types';

@Injectable()
export class CategoriaService {
  constructor(private readonly categoriaRepository: CategoriaRepository) {}

  async crearCategoria(input: CrearCategoriaInput): Promise<CategoriaType> {
    return this.categoriaRepository.create({
      nombre: input.nombre.trim(),
      descripcion: input.descripcion?.trim(),
      activo: input.activo ?? true,
    });
  }

  async listarCategorias(): Promise<CategoriaType[]> {
    return this.categoriaRepository.findAll();
  }

  async obtenerCategoriaPorId(id: number): Promise<CategoriaType> {
    const categoria = await this.categoriaRepository.findById(id);

    if (!categoria) {
      throw new ResourceNotFoundException('CategoriaVehiculo', id);
    }

    return categoria;
  }

  async actualizarCategoria(id: number, input: ActualizarCategoriaInput): Promise<CategoriaType> {
    await this.obtenerCategoriaPorId(id);

    return this.categoriaRepository.update(id, {
      nombre: input.nombre?.trim(),
      descripcion: input.descripcion?.trim(),
      activo: input.activo,
    });
  }
}
