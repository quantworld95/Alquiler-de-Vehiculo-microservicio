import { registerEnumType } from '@nestjs/graphql';

export enum VehiculoEstado {
  DISPONIBLE = 'DISPONIBLE',
  RESERVADO = 'RESERVADO',
  ALQUILADO = 'ALQUILADO',
  MANTENIMIENTO = 'MANTENIMIENTO',
  INACTIVO = 'INACTIVO',
}

registerEnumType(VehiculoEstado, {
  name: 'VehiculoEstado',
});
