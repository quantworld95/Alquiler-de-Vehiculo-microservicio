import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ActualizarCategoriaInput } from '../dto/categorias/actualizar-categoria.input';
import { CrearCategoriaInput } from '../dto/categorias/crear-categoria.input';
import { CategoriaService } from '../servicios/categoria.service';
import { CategoriaType } from '../types';

@Resolver(() => CategoriaType)
export class CategoriaResolver {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Mutation(() => CategoriaType)
  crearCategoriaVehiculo(@Args('input') input: CrearCategoriaInput): Promise<CategoriaType> {
    return this.categoriaService.crearCategoria(input);
  }

  @Query(() => [CategoriaType])
  categoriasVehiculo(): Promise<CategoriaType[]> {
    return this.categoriaService.listarCategorias();
  }

  @Query(() => CategoriaType)
  categoriaVehiculo(@Args('id', { type: () => Int }) id: number): Promise<CategoriaType> {
    return this.categoriaService.obtenerCategoriaPorId(id);
  }

  @Mutation(() => CategoriaType)
  actualizarCategoriaVehiculo(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: ActualizarCategoriaInput,
  ): Promise<CategoriaType> {
    return this.categoriaService.actualizarCategoria(id, input);
  }
}
