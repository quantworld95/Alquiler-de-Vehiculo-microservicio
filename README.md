# Microservicio de Alquiler de Vehiculos

Microservicio desarrollado para un sistema de alquiler de vehiculos bajo una arquitectura orientada a servicios. Su funcion principal es gestionar el proceso de alquiler generado a partir de una reserva, controlando vehiculos, disponibilidad, fechas, puntos de entrega, estados de reserva y estados del alquiler.

Este servicio no administra clientes directamente. El cliente se referencia mediante `clienteId`, permitiendo integracion con otros microservicios del sistema.

## Funcionalidades principales

- Gestion de vehiculos: registro, consulta, actualizacion y busqueda de vehiculos disponibles.
- Gestion de categorias de vehiculos.
- Gestion de puntos de entrega y devolucion.
- Registro y consulta de reservas.
- Control de disponibilidad por rango de fechas.
- Seguimiento de estados de vehiculos, reservas y alquileres.
- Exposicion de operaciones mediante GraphQL.
- Persistencia de datos con PostgreSQL y Prisma ORM.

## Flujo general

1. Se registra o consulta un vehiculo disponible.
2. Se crea una reserva asociada a un `clienteId`, un vehiculo, fechas y puntos de entrega/devolucion.
3. A partir de la reserva se controla el ciclo del alquiler.
4. El sistema mantiene estados para identificar si el vehiculo esta disponible, reservado, alquilado, en mantenimiento o inactivo.

## Tecnologias utilizadas

- Node.js
- NestJS
- GraphQL con Apollo
- Prisma ORM
- PostgreSQL
- TypeScript
- Class Validator

## Modulos del dominio

- `Vehiculo`: informacion del vehiculo, estado, categoria y precio por dia.
- `CategoriaVehiculo`: clasificacion de vehiculos.
- `PuntoEntrega`: lugares de recogida y devolucion.
- `Reserva`: solicitud previa que da origen al alquiler.
- `Alquiler`: control operativo del alquiler generado desde una reserva.
- `CargoAdicional`: cargos asociados a incidencias o condiciones adicionales.
- `Notificacion`: registro de avisos relacionados con reservas o alquileres.
- `Reporte`: resumenes o informacion historica del servicio.

## Operaciones GraphQL principales

### Queries

- `health`
- `vehiculos`
- `vehiculo(id)`
- `vehiculosDisponibles(input)`
- `categoriasVehiculo`
- `categoriaVehiculo(id)`
- `puntosEntrega`
- `puntoEntrega(id)`
- `reserva(id)`
- `reservasPorCliente(clienteId)`

### Mutations

- `crearVehiculo(input)`
- `actualizarVehiculo(id, input)`
- `crearCategoriaVehiculo(input)`
- `actualizarCategoriaVehiculo(id, input)`
- `crearPuntoEntrega(input)`
- `actualizarPuntoEntrega(id, input)`
- `crearReserva(input)`

## Requisitos

- Node.js
- PostgreSQL
- npm

## Configuracion del entorno

Crear un archivo `.env` tomando como referencia `.env.example`:

```env
NODE_ENV=development
PORT=3000
GRAPHQL_PATH=/graphql
GRAPHQL_PLAYGROUND=true
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/alquiler_vehiculos?schema=public"
```

> El archivo `.env` no debe subirse al repositorio porque contiene configuracion local o sensible.

## Instalacion

```bash
npm install
```

## Prisma

Validar el esquema:

```bash
npm run prisma:validate
```

Generar el cliente de Prisma:

```bash
npm run prisma:generate
```

Ejecutar migraciones en desarrollo:

```bash
npm run prisma:migrate:dev
```

Abrir Prisma Studio:

```bash
npm run prisma:studio
```

## Ejecucion

Modo desarrollo:

```bash
npm run start:dev
```

Compilar el proyecto:

```bash
npm run build
```

Ejecutar en produccion:

```bash
npm run start:prod
```

Por defecto, el servidor usa el puerto definido en `PORT` y GraphQL queda disponible en:

```text
http://localhost:3000/graphql
```

## Validaciones

El proyecto utiliza `ValidationPipe` global de NestJS para:

- Validar datos de entrada.
- Remover propiedades no permitidas.
- Rechazar campos que no pertenecen a los DTO.
- Transformar tipos cuando corresponde.

## Estado del proyecto

Microservicio base funcional para gestionar vehiculos, reservas y el ciclo de alquiler dentro de un sistema distribuido de renta de vehiculos.
