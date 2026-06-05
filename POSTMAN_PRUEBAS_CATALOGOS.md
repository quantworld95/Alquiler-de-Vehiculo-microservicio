# Pruebas en Postman - Categorias, Vehiculos y Puntos de Entrega

## Objetivo

Probar desde Postman las operaciones GraphQL iniciales del microservicio **MS Alquiler de Vehiculos** para:

- Categorias de vehiculo.
- Vehiculos.
- Puntos de entrega.

## Requisitos Previos

Antes de probar en Postman, el microservicio debe estar ejecutandose correctamente.

Nota importante: actualmente los datos/tablas pueden no estar migrados todavia. Si no se ejecuto la migracion Prisma, las consultas y mutations de Postman fallaran porque PostgreSQL no tendra las tablas necesarias.

1. Crear archivo `.env` tomando como base `.env.example`.

```env
NODE_ENV=development
PORT=3000
GRAPHQL_PATH=/graphql
GRAPHQL_PLAYGROUND=true
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/alquiler_vehiculos?schema=public"
```

2. Tener PostgreSQL activo.

3. Ejecutar migracion Prisma, si todavia no existe la base/tablas:

```bash
npm run prisma:migrate:dev
```

Cuando Prisma pida un nombre para la migracion, se puede usar:

```text
init_catalogos
```

4. Levantar el microservicio:

```bash
npm run start:dev
```

5. URL GraphQL:

```text
http://localhost:3000/graphql
```

## Si Aun No Se Migro La Base de Datos

Antes de ejecutar las pruebas de categorias, vehiculos o puntos de entrega, realizar este orden:

```bash
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate:dev
npm run start:dev
```

Si PostgreSQL no tiene creada la base `alquiler_vehiculos`, crearla primero desde pgAdmin, DBeaver o terminal. El microservicio no crea la base automaticamente; Prisma crea las tablas dentro de una base existente.

## Configuracion Base en Postman

Metodo:

```text
POST
```

URL:

```text
http://localhost:3000/graphql
```

Headers:

```text
Content-Type: application/json
```

Body:

```text
raw -> JSON
```

Formato general del body:

```json
{
  "query": "...",
  "variables": {}
}
```

## Probar Health Check

Sirve para confirmar que GraphQL esta respondiendo.

```json
{
  "query": "query { health { service status timestamp } }"
}
```

Respuesta esperada:

```json
{
  "data": {
    "health": {
      "service": "ms-alquiler-vehiculos",
      "status": "ok",
      "timestamp": "2026-06-05T..."
    }
  }
}
```

## CategoriaVehiculo

### Crear Categoria

```json
{
  "query": "mutation CrearCategoria($input: CrearCategoriaInput!) { crearCategoriaVehiculo(input: $input) { id nombre descripcion activo createdAt updatedAt } }",
  "variables": {
    "input": {
      "nombre": "SUV",
      "descripcion": "Vehiculos deportivos utilitarios",
      "activo": true
    }
  }
}
```

Respuesta esperada:

```json
{
  "data": {
    "crearCategoriaVehiculo": {
      "id": 1,
      "nombre": "SUV",
      "descripcion": "Vehiculos deportivos utilitarios",
      "activo": true,
      "createdAt": "2026-06-05T...",
      "updatedAt": "2026-06-05T..."
    }
  }
}
```

### Listar Categorias

```json
{
  "query": "query { categoriasVehiculo { id nombre descripcion activo createdAt updatedAt } }"
}
```

### Consultar Categoria por ID

```json
{
  "query": "query Categoria($id: Int!) { categoriaVehiculo(id: $id) { id nombre descripcion activo createdAt updatedAt } }",
  "variables": {
    "id": 1
  }
}
```

### Actualizar Categoria

```json
{
  "query": "mutation ActualizarCategoria($id: Int!, $input: ActualizarCategoriaInput!) { actualizarCategoriaVehiculo(id: $id, input: $input) { id nombre descripcion activo createdAt updatedAt } }",
  "variables": {
    "id": 1,
    "input": {
      "descripcion": "SUV familiares y ejecutivos",
      "activo": true
    }
  }
}
```

## Vehiculo

Importante: antes de crear un vehiculo debe existir una categoria. En los ejemplos se usa `categoriaId: 1`, que corresponde a la categoria creada anteriormente.

### Crear Vehiculo

```json
{
  "query": "mutation CrearVehiculo($input: CrearVehiculoInput!) { crearVehiculo(input: $input) { id placa marca modelo anio color imagenUrl precioDia estado categoriaId createdAt updatedAt } }",
  "variables": {
    "input": {
      "placa": "ABC-1234",
      "marca": "Toyota",
      "modelo": "RAV4",
      "anio": 2024,
      "color": "Blanco",
      "imagenUrl": "https://example.com/vehiculos/toyota-rav4.jpg",
      "precioDia": 85.5,
      "estado": "DISPONIBLE",
      "categoriaId": 1
    }
  }
}
```

Respuesta esperada:

```json
{
  "data": {
    "crearVehiculo": {
      "id": 1,
      "placa": "ABC-1234",
      "marca": "Toyota",
      "modelo": "RAV4",
      "anio": 2024,
      "color": "Blanco",
      "imagenUrl": "https://example.com/vehiculos/toyota-rav4.jpg",
      "precioDia": 85.5,
      "estado": "DISPONIBLE",
      "categoriaId": 1,
      "createdAt": "2026-06-05T...",
      "updatedAt": "2026-06-05T..."
    }
  }
}
```

### Listar Vehiculos

```json
{
  "query": "query { vehiculos { id placa marca modelo anio color imagenUrl precioDia estado categoriaId createdAt updatedAt } }"
}
```

### Consultar Vehiculo por ID

```json
{
  "query": "query Vehiculo($id: Int!) { vehiculo(id: $id) { id placa marca modelo anio color imagenUrl precioDia estado categoriaId createdAt updatedAt } }",
  "variables": {
    "id": 1
  }
}
```

### Actualizar Vehiculo

```json
{
  "query": "mutation ActualizarVehiculo($id: Int!, $input: ActualizarVehiculoInput!) { actualizarVehiculo(id: $id, input: $input) { id placa marca modelo anio color imagenUrl precioDia estado categoriaId createdAt updatedAt } }",
  "variables": {
    "id": 1,
    "input": {
      "color": "Gris",
      "imagenUrl": "https://example.com/vehiculos/toyota-rav4-gris.jpg",
      "precioDia": 90,
      "estado": "DISPONIBLE"
    }
  }
}
```

## PuntoEntrega

### Crear Punto de Entrega

```json
{
  "query": "mutation CrearPunto($input: CrearPuntoEntregaInput!) { crearPuntoEntrega(input: $input) { id nombre tipo direccion ciudad estado createdAt updatedAt } }",
  "variables": {
    "input": {
      "nombre": "Sucursal Centro",
      "tipo": "SUCURSAL",
      "direccion": "Av. Principal 123",
      "ciudad": "Santa Cruz",
      "estado": "ACTIVO"
    }
  }
}
```

Respuesta esperada:

```json
{
  "data": {
    "crearPuntoEntrega": {
      "id": 1,
      "nombre": "Sucursal Centro",
      "tipo": "SUCURSAL",
      "direccion": "Av. Principal 123",
      "ciudad": "Santa Cruz",
      "estado": "ACTIVO",
      "createdAt": "2026-06-05T...",
      "updatedAt": "2026-06-05T..."
    }
  }
}
```

### Listar Puntos de Entrega

```json
{
  "query": "query { puntosEntrega { id nombre tipo direccion ciudad estado createdAt updatedAt } }"
}
```

### Consultar Punto de Entrega por ID

```json
{
  "query": "query PuntoEntrega($id: Int!) { puntoEntrega(id: $id) { id nombre tipo direccion ciudad estado createdAt updatedAt } }",
  "variables": {
    "id": 1
  }
}
```

### Actualizar Punto de Entrega

```json
{
  "query": "mutation ActualizarPunto($id: Int!, $input: ActualizarPuntoEntregaInput!) { actualizarPuntoEntrega(id: $id, input: $input) { id nombre tipo direccion ciudad estado createdAt updatedAt } }",
  "variables": {
    "id": 1,
    "input": {
      "direccion": "Av. Principal 123, Edificio Central",
      "estado": "ACTIVO"
    }
  }
}
```

## Errores Comunes

### No Hay Conexion a PostgreSQL

Si el servicio no inicia o Postman no responde, revisar:

- PostgreSQL esta encendido.
- `DATABASE_URL` es correcto.
- La base `alquiler_vehiculos` existe.
- Se ejecuto `npm run prisma:migrate:dev`.

### Error de Validacion

Ejemplo: nombre muy corto, URL invalida o campo faltante.

La respuesta GraphQL tendra `errors`.

### Recurso No Encontrado

Si se consulta un ID inexistente:

```json
{
  "query": "query Categoria($id: Int!) { categoriaVehiculo(id: $id) { id nombre } }",
  "variables": {
    "id": 999
  }
}
```

Se espera un error controlado indicando que el recurso no existe.

## Orden Recomendado de Prueba

1. Ejecutar `health`.
2. Crear categoria.
3. Listar categorias.
4. Consultar categoria por ID.
5. Actualizar categoria.
6. Crear vehiculo usando el `categoriaId` creado.
7. Listar vehiculos.
8. Consultar vehiculo por ID.
9. Actualizar vehiculo.
10. Crear punto de entrega.
11. Listar puntos de entrega.
12. Consultar punto de entrega por ID.
13. Actualizar punto de entrega.
