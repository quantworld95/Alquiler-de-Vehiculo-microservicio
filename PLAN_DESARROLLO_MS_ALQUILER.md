# Plan de Desarrollo - MS Alquiler de Vehiculos

## Objetivo del Plan

Guiar la implementacion del microservicio **MS Alquiler de Vehiculos** usando **NestJS** y **GraphQL**, respetando la separacion con los demas microservicios del sistema Rent a Car.

Este plan se enfoca en el orden de construccion tecnica del microservicio, no en la descripcion completa del negocio.

## Alcance Tecnico

El microservicio debe implementar:

- Gestion de categorias de vehiculos.
- Gestion de vehiculos.
- Gestion de puntos de entrega y devolucion.
- Gestion de reservas.
- Gestion de alquileres.
- Seguimiento de devoluciones.
- Registro de cargos adicionales operativos.
- Reportes operativos.
- Notificaciones internas.
- Referencias externas a cliente, pago, factura/comprobante y contrato firmado.

El microservicio no debe implementar:

- Autenticacion.
- Usuarios, roles o permisos.
- Procesamiento de pagos.
- Generacion de facturas.
- Almacenamiento de documentos.
- Generacion de PDF firmado.
- OCR, IA o recomendaciones.
- Envio directo de correos o Telegram, salvo que se registre como notificacion interna.

## Arquitectura Oficial del Proyecto

El proyecto usara una arquitectura por capas simple, adecuada para una aplicacion de gestion de negocio.

```text
src/
  main.ts
  app.module.ts

  config/
    app.config.ts
    graphql.config.ts

  common/
    enums/
    errors/
    utils/

  datos/
    prisma/
      prisma.module.ts
      prisma.service.ts
    repositories/
      categoria.repository.ts
      vehiculo.repository.ts
      punto-entrega.repository.ts
      reserva.repository.ts
      alquiler.repository.ts
      notificacion.repository.ts
      reporte.repository.ts

  servicios/
    categoria.service.ts
    vehiculo.service.ts
    punto-entrega.service.ts
    reserva.service.ts
    alquiler.service.ts
    notificacion.service.ts
    reporte.service.ts

  resolvers/
    categoria.resolver.ts
    vehiculo.resolver.ts
    punto-entrega.resolver.ts
    reserva.resolver.ts
    alquiler.resolver.ts
    notificacion.resolver.ts
    reporte.resolver.ts

  dto/
    categorias/
    vehiculos/
    puntos-entrega/
    reservas/
    alquileres/
    notificaciones/

  types/
    categoria.type.ts
    vehiculo.type.ts
    punto-entrega.type.ts
    reserva.type.ts
    alquiler.type.ts
    notificacion.type.ts
    reporte.type.ts
```

Responsabilidad de cada capa:

- `resolvers`: entrada GraphQL. Reciben queries y mutations.
- `servicios`: logica de negocio. Contienen metodos como crear, listar, actualizar, confirmar reserva, iniciar alquiler o cerrar alquiler.
- `datos/repositories`: acceso a datos. Encapsulan consultas Prisma.
- `datos/prisma`: configuracion tecnica de Prisma.
- `dto`: datos de entrada GraphQL.
- `types`: datos de salida GraphQL.
- `common`: enums, errores y utilidades compartidas.
- `config`: configuracion de la aplicacion.

Flujo de ejecucion:

```text
Resolver GraphQL
-> Servicio de negocio
-> Repository de datos
-> Prisma
-> PostgreSQL
```

## Estado Actual

### Fase 1 - Base del Proyecto

Estado: **Completada**.

Entregado:

- Proyecto Node/NestJS inicializado.
- Dependencias base instaladas.
- GraphQL configurado.
- `ConfigModule` configurado.
- `ValidationPipe` global configurado.
- Enums iniciales definidos.
- Errores base de negocio creados.
- Utilidad de rango de fechas creada.
- Query GraphQL `health` creada.
- Compilacion verificada con `npm run build`.

## Fase 2 - Persistencia y Modelo del Dominio

Estado: **En progreso avanzado**.

Entregado:

- Prisma instalado.
- `@prisma/client` instalado.
- `prisma.config.ts` creado.
- `schema.prisma` creado y validado.
- Modelos principales definidos.
- Relaciones e indices principales definidos.
- `PrismaService` creado en `src/datos/prisma`.
- `PrismaModule` creado y registrado desde `src/datos/prisma`.
- Repositorios iniciales creados en `src/datos/repositories`.
- Compilacion verificada con `npm run build`.
- Tipado verificado con `npm run typecheck`.

Pendiente:

- Configurar una base PostgreSQL accesible.
- Ejecutar la primera migracion con `npm run prisma:migrate:dev`.

Objetivo: definir como se almacenaran las entidades y crear el modelo base del dominio.

Decision tomada:

- La persistencia oficial sera **PostgreSQL + Prisma**.

Motivo:

- Prisma simplifica el modelado, las migraciones y el acceso tipado a datos.
- PostgreSQL encaja con las relaciones entre categorias, vehiculos, reservas, alquileres, notificaciones y cargos adicionales.

Actividades:

- Instalar y configurar Prisma.
- Configurar conexion a PostgreSQL mediante `DATABASE_URL`.
- Crear `schema.prisma`.
- Crear modelo `CategoriaVehiculo`.
- Crear modelo `Vehiculo`.
- Crear modelo `PuntoEntrega`.
- Crear modelo `Reserva`.
- Crear modelo `Alquiler`.
- Crear modelo `Notificacion`.
- Crear modelo `CargoAdicional`.
- Definir relaciones internas.
- Definir indices para busqueda por fechas, vehiculos y estados.
- Crear `PrismaService` para NestJS.

Criterio de salida:

- La aplicacion compila.
- Los modelos Prisma estan definidos.
- La conexion a base de datos esta configurada.
- El modelo soporta los estados definidos en el plan funcional.

## Fase 3 - GraphQL Base del Dominio

Estado: **En progreso**.

Entregado:

- `types` GraphQL iniciales para categorias, vehiculos, puntos de entrega y health.
- `dto` iniciales para crear y actualizar categorias, vehiculos y puntos de entrega.
- `resolvers` iniciales para categorias, vehiculos y puntos de entrega.
- `servicios` iniciales para categorias, vehiculos y puntos de entrega.
- `repositories` iniciales para categorias, vehiculos y puntos de entrega.
- Reorganizacion a arquitectura por capas.
- Compilacion verificada con `npm run build`.
- Tipado verificado con `npm run typecheck`.

Objetivo: exponer el contrato GraphQL inicial para las entidades principales.

Actividades:

- Crear types GraphQL en `src/types`.
- Crear DTO/inputs GraphQL en `src/dto`.
- Crear resolvers GraphQL en `src/resolvers`.
- Crear servicios de negocio en `src/servicios`.
- Crear repositories de datos en `src/datos/repositories`.
- Crear queries base de consulta.
- Crear mutations base de creacion y actualizacion.

Entidades:

- `categorias`
- `vehiculos`
- `puntos-entrega`
- `reservas`
- `alquileres`
- `notificaciones`
- `reportes`

Criterio de salida:

- El schema GraphQL se genera sin errores.
- Existen queries y mutations iniciales por entidad.
- La estructura queda separada por capas.

## Fase 4 - Catalogos Operativos

Objetivo: implementar CRUD funcional para datos base del negocio.

Actividades:

- Crear categorias.
- Listar categorias.
- Consultar categoria por ID.
- Actualizar categorias.
- Crear vehiculos.
- Listar vehiculos.
- Consultar vehiculo por ID.
- Actualizar vehiculos.
- Crear puntos de entrega.
- Listar puntos de entrega.
- Consultar punto por ID.
- Actualizar puntos de entrega.

Validaciones:

- Campos obligatorios.
- Estados permitidos.
- Placa unica para vehiculos.
- Categoria existente al crear vehiculo.
- Punto de entrega activo para operaciones.

Criterio de salida:

- Los catalogos se pueden administrar desde GraphQL.
- Los vehiculos quedan disponibles para el flujo de reserva.

## Fase 5 - Disponibilidad y Reservas

Objetivo: implementar el nucleo de reservas y validacion de disponibilidad.

Actividades:

- Consultar vehiculos disponibles por fechas, categoria y punto.
- Crear reserva en estado `PENDIENTE`.
- Validar solapamiento de reservas.
- Validar solapamiento de alquileres.
- Cancelar reserva.
- Confirmar reserva al procesar evento `PAGO_APROBADO`.
- Guardar referencia `pago_id`.
- Guardar referencia a factura/comprobante si se define un campo externo.

Reglas clave:

- No permitir reserva si el vehiculo esta reservado o alquilado en el mismo rango.
- Toda reserva nueva inicia en `PENDIENTE`.
- Solo el evento `PAGO_APROBADO` cambia la reserva a `CONFIRMADA`.

Criterio de salida:

- El flujo de creacion y confirmacion de reservas funciona.
- No se permiten conflictos de fechas.
- El microservicio no procesa pagos, solo registra referencias.

## Fase 6 - Pago, Facturacion y Firma de Contrato

Objetivo: soportar el flujo posterior al pago aprobado hasta dejar la reserva lista para entrega.

Actividades:

- Recibir o procesar el evento `PAGO_APROBADO`.
- Confirmar la reserva.
- Exponer estado de firma del contrato.
- Registrar que la app mostro contrato HTML firmable.
- Registrar `contrato_documento_id` cuando el MS Documental genere el PDF firmado.
- Cambiar reserva a `LISTA_PARA_ENTREGA`.
- Exponer consulta para que n8n verifique estado de firma.
- Registrar escalamiento al administrador si la firma sigue pendiente.

Responsabilidades externas:

- MS Pagos genera factura/comprobante.
- n8n envia correo de pago correcto con factura.
- App captura firma manual digital sobre pantalla.
- MS Documental genera PDF firmado.
- n8n envia recordatorio por Telegram si no hay firma.

Criterio de salida:

- Una reserva confirmada no puede iniciar entrega hasta tener contrato firmado.
- Solo una reserva `LISTA_PARA_ENTREGA` puede generar alquiler.

## Fase 7 - Ciclo de Alquiler

Objetivo: implementar entrega, alquiler activo, devolucion y cierre.

Actividades:

- Crear alquiler desde reserva `LISTA_PARA_ENTREGA`.
- Registrar entrega del vehiculo.
- Cambiar alquiler a `EN_CURSO`.
- Cambiar vehiculo a `ALQUILADO`.
- Registrar kilometraje de salida.
- Registrar combustible de salida.
- Registrar devolucion.
- Registrar kilometraje de retorno.
- Registrar combustible de retorno.
- Registrar danos o incidencias.
- Registrar cargos adicionales.
- Cerrar alquiler como `FINALIZADO` u `OBSERVADO`.
- Cambiar vehiculo a `DISPONIBLE` o `MANTENIMIENTO`.

Criterio de salida:

- El ciclo operativo completo del alquiler funciona desde GraphQL.
- Las transiciones de estado son controladas.
- La flota mantiene estados consistentes.

## Fase 8 - Seguimiento Automatizado de Devolucion

Objetivo: permitir que n8n controle recordatorios y retrasos de devolucion.

Actividades:

- Consultar alquileres activos proximos a devolucion.
- Consultar alquileres activos retrasados.
- Registrar notificacion interna por recordatorio.
- Registrar aviso al administrador.
- Registrar cargo adicional por retraso.
- Notificar cargo adicional registrado.

Responsabilidades externas:

- n8n agenda recordatorio 24 horas antes.
- n8n agenda recordatorio 2 horas antes.
- n8n envia Telegram al cliente.
- MS Pagos procesa el cobro efectivo del cargo adicional.

Criterio de salida:

- n8n puede consultar alquileres y actuar segun estado.
- El microservicio registra cargos y notificaciones sin cobrar dinero.

## Fase 9 - Reportes y Notificaciones

Objetivo: entregar informacion operativa para seguimiento interno.

Actividades:

- Reporte de reservas por estado.
- Reporte de alquileres por estado.
- Reporte de vehiculos por estado.
- Reporte de alquileres retrasados.
- Reporte de cargos adicionales.
- Listar notificaciones.
- Consultar notificaciones por usuario.
- Marcar notificacion como `LEIDA`.

Criterio de salida:

- El administrador puede consultar estado operativo del negocio.
- Las notificaciones internas quedan disponibles por GraphQL.

## Fase 10 - Pruebas, Validaciones y Documentacion

Objetivo: estabilizar el microservicio y dejarlo listo para integracion.

Actividades:

- Probar creacion de catalogos.
- Probar disponibilidad de vehiculos.
- Probar reservas solapadas.
- Probar confirmacion por `PAGO_APROBADO`.
- Probar firma y cambio a `LISTA_PARA_ENTREGA`.
- Probar creacion de alquiler.
- Probar inicio y cierre de alquiler.
- Probar devolucion tardia.
- Probar cargos adicionales.
- Probar reportes.
- Documentar queries y mutations.
- Documentar eventos externos esperados.

Criterio de salida:

- Build exitoso.
- Pruebas criticas ejecutadas.
- Reglas de negocio principales verificadas.
- Documentacion GraphQL lista para uso.

## Orden de Implementacion Recomendado

1. Persistencia y entidades.
2. Catalogos operativos.
3. Disponibilidad.
4. Reservas.
5. Evento `PAGO_APROBADO`.
6. Firma y contrato firmado.
7. Alquileres.
8. Devoluciones y cargos adicionales.
9. Reportes.
10. Pruebas y documentacion.

## Riesgos Principales

- Definir tarde la base de datos puede obligar a rehacer entidades.
- Mezclar responsabilidades con pagos o documental puede romper la arquitectura de microservicios.
- No controlar bien los solapamientos de fechas puede generar reservas duplicadas.
- Permitir entrega sin contrato firmado puede romper el flujo legal del alquiler.
- Registrar cargos adicionales sin referencia clara puede complicar la integracion con pagos.

## Siguiente Paso

La tecnologia de persistencia ya fue definida.

Decision:

```text
PostgreSQL + Prisma
```

Para iniciar la Fase 2 se debe:

- Instalar Prisma.
- Configurar `DATABASE_URL`.
- Crear `schema.prisma`.
- Definir los modelos principales.
- Crear `PrismaService`.
- Ejecutar la primera migracion.
