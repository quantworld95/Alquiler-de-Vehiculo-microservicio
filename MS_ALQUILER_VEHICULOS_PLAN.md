# MS Alquiler de Vehiculos - Instrucciones y Plan de Desarrollo

## Objetivo

Implementar unicamente el microservicio **MS Alquiler de Vehiculos** para un sistema **Rent a Car**.

El sistema completo esta disenado con cinco microservicios:

- MS Usuarios y Seguridad.
- MS Alquiler de Vehiculos.
- MS Pagos y Facturacion.
- MS Gestion Documental.
- MS Inteligencia Artificial.

En esta implementacion solo se debe desarrollar el microservicio de **Alquiler de Vehiculos**.

## Tecnologia Principal

- Lenguaje/framework: **NestJS**.
- Comunicacion externa: **GraphQL**.
- No se debe implementar API REST para las operaciones del negocio.
- Se deben crear `typeDefs`, `resolvers`, `queries`, `mutations`, `inputs` y `types` necesarios.

## Alcance del Microservicio

El microservicio debe encargarse de la logica principal del negocio relacionada con:

- Categorias de vehiculos.
- Vehiculos.
- Puntos de recogida y devolucion.
- Reservas.
- Alquileres.
- Reportes operativos.
- Notificaciones internas del proceso de alquiler.

## Entidades Principales

### CategoriaVehiculo

Representa la clasificacion comercial u operativa de los vehiculos.

Ejemplos:

- Economico.
- SUV.
- Premium.
- Camioneta.

### Vehiculo

Representa una unidad disponible en la flota.

Debe manejar datos como:

- Placa.
- Marca.
- Modelo.
- Anio.
- Color.
- URL de imagen del vehiculo.
- Precio por dia.
- Estado.
- Categoria asociada.

### PuntoEntrega

Representa lugares disponibles para recoger o devolver vehiculos.

Debe manejar datos como:

- Nombre.
- Tipo.
- Direccion.
- Ciudad.
- Estado.

### Reserva

Representa la solicitud de reserva de un vehiculo por parte de un cliente.

Debe guardar referencias externas, sin implementar la logica interna de otros microservicios:

- `cliente_id`: referencia al MS Usuarios y Seguridad.
- `pago_id`: referencia al MS Pagos y Facturacion.
- `contrato_documento_id`: referencia al PDF final firmado en el MS Gestion Documental.

Importante: el contrato no nace como un PDF pendiente. Primero se muestra como una vista HTML firmable en la app. El PDF final se genera recien cuando el cliente firma digitalmente de forma manual sobre la pantalla.

La reserva debe controlar:

- Punto de recogida.
- Punto de devolucion.
- Fecha y hora de inicio.
- Fecha y hora de fin.
- Vehiculo reservado.
- Monto base.
- Estado de la reserva.
- Estado de firma del contrato.
- Fecha de firma del contrato, si corresponde.

### Alquiler

Representa el ciclo operativo del servicio desde la entrega hasta la devolucion.

Debe generarse a partir de una reserva en estado `LISTA_PARA_ENTREGA` y controlar:

- Fecha real de entrega.
- Fecha real de devolucion.
- Kilometraje de salida.
- Kilometraje de retorno.
- Combustible de salida.
- Combustible de retorno.
- Estado del vehiculo al entregar y devolver.
- Danios o incidencias.
- Cargos adicionales.
- Cierre formal del alquiler.

### Reporte

Representa reportes operativos del microservicio.

Debe permitir consultar informacion sobre:

- Reservas por estado.
- Alquileres por estado.
- Vehiculos disponibles, reservados, alquilados o en mantenimiento.
- Utilizacion de la flota.
- Operaciones finalizadas.

### Notificacion

Representa notificaciones internas relacionadas con el proceso de alquiler.

Debe manejar:

- Usuario destinatario externo mediante `usuario_id`.
- Tipo.
- Mensaje.
- Canal.
- Estado.
- Fecha de envio.

## Estados Permitidos

### Estado de Vehiculo

- `DISPONIBLE`
- `RESERVADO`
- `ALQUILADO`
- `MANTENIMIENTO`
- `INACTIVO`

### Estado de Reserva

- `PENDIENTE`
- `CONFIRMADA`
- `LISTA_PARA_ENTREGA`
- `CANCELADA`
- `VENCIDA`

### Estado de Alquiler

- `PENDIENTE_ENTREGA`
- `EN_CURSO`
- `FINALIZADO`
- `OBSERVADO`
- `CANCELADO`

### Estado de Notificacion

- `PENDIENTE`
- `ENVIADA`
- `LEIDA`

### Estado de Firma de Contrato

Campo operativo recomendado para que la app, n8n y el administrador puedan consultar el avance de la firma sin agregar logica documental dentro de este microservicio.

- `PENDIENTE_FIRMA`
- `FIRMADO`
- `ESCALADO_ADMIN`

## Flujo Principal del Negocio

1. El cliente abre la aplicacion.
2. Selecciona punto de recogida.
3. Selecciona punto de devolucion.
4. Selecciona fecha y hora de recogida.
5. Selecciona fecha y hora de devolucion.
6. Elige categoria de vehiculo.
7. El sistema muestra vehiculos disponibles.
8. El cliente selecciona un vehiculo.
9. El sistema verifica documentos del cliente mediante otros microservicios.
10. Si los documentos estan validados y vigentes, continua al pago.
11. Si los documentos estan pendientes, rechazados o vencidos, el cliente carga CI, licencia y selfie en otros microservicios.
12. El MS Inteligencia Artificial valida documentos fuera de este microservicio.
13. El cliente realiza el pago mediante el MS Pagos y Facturacion.
14. El MS Pagos genera la factura o comprobante del pago.
15. El MS Pagos envia el evento `PAGO_APROBADO`.
16. n8n envia un correo al cliente indicando que el pago fue realizado correctamente, adjuntando o enlazando la factura.
17. El MS Alquiler confirma la reserva.
18. La reserva pasa a `CONFIRMADA`.
19. La app muestra el contrato como una vista HTML firmable.
20. El cliente firma digitalmente de forma manual sobre la pantalla.
21. La app envia la firma al MS Gestion Documental.
22. El MS Gestion Documental genera el PDF final firmado.
23. El MS Alquiler guarda `contrato_documento_id`.
24. La reserva pasa a `LISTA_PARA_ENTREGA`.
25. En la fecha indicada, el administrador registra la entrega del vehiculo.
26. El alquiler pasa a `EN_CURSO`.
27. El cliente devuelve el vehiculo.
28. El administrador registra la devolucion.
29. Se registran kilometraje, combustible, danios, incidencias y cargos adicionales si existen.
30. El alquiler queda `FINALIZADO` u `OBSERVADO`.
31. El vehiculo vuelve a `DISPONIBLE`, salvo que tenga danios o requiera mantenimiento.

## Flujo de Pago, Facturacion y Firma de Contrato de Alquiler

Este flujo inicia cuando el pago fue aprobado por el MS Pagos y Facturacion.

```text
Pago aprobado
|
v
MS Pagos genera factura/comprobante del pago
|
v
MS Pagos envia evento PAGO_APROBADO
|
v
n8n envia correo al cliente: "Pago realizado correctamente" + adjunta o enlaza la factura
|
v
MS Alquiler confirma la reserva
|
v
Reserva queda CONFIRMADA
|
v
App muestra contrato HTML
|
v
Cliente firma?
|-- Si:
|   |
|   v
|   App envia firma al MS Documental
|   |
|   v
|   MS Documental genera PDF firmado
|   |
|   v
|   MS Alquiler guarda contrato_documento_id
|   |
|   v
|   Reserva queda LISTA_PARA_ENTREGA
|
|-- No:
    |
    v
    n8n espera 24 horas
    |
    v
    n8n consulta estado de firma
    |
    v
    n8n envia recordatorio por Telegram
    |
    v
    Si sigue pendiente, avisa al administrador
```

Responsabilidades del flujo:

- La app presenta el contrato HTML y captura la firma manual digital sobre la pantalla.
- La app envia la firma capturada al MS Gestion Documental.
- El MS Pagos genera la factura o comprobante y publica el evento `PAGO_APROBADO`.
- n8n envia el correo de pago realizado correctamente, adjuntando o enlazando la factura.
- El MS Gestion Documental genera y almacena el PDF final firmado.
- El MS Alquiler no genera ni almacena el archivo PDF; solo guarda `contrato_documento_id`.
- El MS Alquiler confirma la reserva al recibir o procesar el evento `PAGO_APROBADO`.
- El MS Alquiler cambia la reserva a `LISTA_PARA_ENTREGA` cuando el contrato firmado queda referenciado.
- n8n gestiona la espera de 24 horas, la consulta del estado de firma, el recordatorio por Telegram y la alerta al administrador.

## Flujo Automatizado de Seguimiento y Control de Devolucion

Este flujo aplica cuando el alquiler ya esta activo, es decir, cuando el estado del alquiler es `EN_CURSO` y el vehiculo esta en estado `ALQUILADO`.

```text
Alquiler activo
|
v
Recordatorio 24h antes
|
v
Recordatorio 2h antes
|
v
Vehiculo devuelto?
|-- Si:
|   |
|   v
|   Fin
|
|-- No:
    |
    v
    Telegram cliente
    |
    v
    Aviso administrador
    |
    v
    Registrar cargo adicional
    |
    v
    Notificar cargo
```

Responsabilidades del flujo:

- n8n gestiona la programacion de recordatorios 24 horas antes y 2 horas antes de la fecha/hora de devolucion.
- n8n consulta el estado del alquiler en el MS Alquiler para verificar si el vehiculo fue devuelto.
- Si el vehiculo no fue devuelto, n8n envia un mensaje por Telegram al cliente.
- El MS Alquiler registra la notificacion interna para el administrador.
- El MS Alquiler registra el cargo adicional cuando corresponda, sin procesar el pago.
- El MS Alquiler notifica el cargo adicional registrado.
- El cobro efectivo del cargo adicional pertenece al MS Pagos y Facturacion.

## Reglas de Negocio

- No permitir reservas si el vehiculo ya esta reservado o alquilado en el mismo rango de fechas.
- Una reserva nueva siempre inicia en estado `PENDIENTE`.
- Una reserva puede pasar a `CONFIRMADA` cuando el MS Pagos emite el evento `PAGO_APROBADO`.
- Una reserva `CONFIRMADA` puede pasar a `LISTA_PARA_ENTREGA` cuando el contrato fue firmado y existe `contrato_documento_id`.
- Solo una reserva `LISTA_PARA_ENTREGA` puede generar un alquiler.
- Un alquiler generado desde una reserva lista para entrega inicia en estado `PENDIENTE_ENTREGA`.
- El contrato no debe generarse como PDF pendiente antes de la firma del cliente.
- La firma del contrato es manual digital sobre la pantalla y debe ocurrir antes de la entrega del vehiculo.
- Al iniciar el alquiler, el vehiculo pasa a estado `ALQUILADO`.
- Al cerrar el alquiler, el vehiculo vuelve a `DISPONIBLE` si no tiene danios ni requiere mantenimiento.
- Si al cerrar el alquiler existen danios o mantenimiento requerido, el vehiculo debe pasar a `MANTENIMIENTO`.
- Si un alquiler activo supera la fecha/hora de devolucion sin registrar devolucion, debe poder identificarse como retrasado operativamente.
- Los recordatorios de devolucion son automatizados por n8n, pero el MS Alquiler debe exponer la informacion necesaria para consultar alquileres activos y su fecha/hora de devolucion.
- El MS Alquiler puede registrar cargos adicionales por retraso, danios u otras incidencias, pero no debe procesar el cobro.
- Todo cargo adicional registrado debe generar una notificacion interna y quedar disponible para ser referenciado por el MS Pagos y Facturacion.
- Una reserva cancelada no debe generar alquiler.
- Una reserva vencida no debe generar alquiler.
- No se deben modificar reglas internas de pagos, usuarios, documentos o inteligencia artificial.

## Operaciones GraphQL Requeridas

### Categorias

- Crear categoria.
- Listar categorias.
- Consultar categoria por ID.
- Actualizar categoria.

### Vehiculos

- Crear vehiculo.
- Listar vehiculos.
- Consultar vehiculo por ID.
- Actualizar vehiculo.
- Consultar vehiculos disponibles por rango de fechas, punto y categoria.

### Puntos de Entrega

- Crear punto de entrega.
- Listar puntos de entrega.
- Consultar punto de entrega por ID.
- Actualizar punto de entrega.

### Reservas

- Crear reserva.
- Listar reservas.
- Consultar reserva por ID.
- Actualizar reserva.
- Confirmar reserva por evento `PAGO_APROBADO`.
- Cancelar reserva.
- Validar disponibilidad del vehiculo.
- Consultar estado de firma de contrato.
- Registrar referencia de contrato firmado mediante `contrato_documento_id`.
- Cambiar reserva a `LISTA_PARA_ENTREGA` cuando el contrato firmado quede referenciado.

### Alquileres

- Crear alquiler desde una reserva `LISTA_PARA_ENTREGA`.
- Listar alquileres.
- Consultar alquiler por ID.
- Iniciar alquiler.
- Cerrar alquiler.
- Registrar datos de entrega.
- Registrar datos de devolucion.
- Consultar alquileres activos proximos a devolucion.
- Consultar alquileres activos retrasados.
- Registrar cargo adicional operativo.

### Reportes

- Consultar reportes operativos.
- Consultar resumen de reservas.
- Consultar resumen de alquileres.
- Consultar resumen de flota.
- Consultar resumen de alquileres retrasados.
- Consultar cargos adicionales registrados.

### Notificaciones

- Listar notificaciones.
- Consultar notificaciones por usuario.
- Marcar notificacion como leida.
- Crear notificaciones internas por recordatorio, retraso, aviso al administrador o cargo adicional.

## Exclusiones del Microservicio

No se debe implementar:

- Autenticacion.
- Registro/login de usuarios.
- Roles y permisos.
- Procesamiento real de pagos.
- Integracion directa con pasarelas de pago.
- Almacenamiento fisico de archivos.
- Generacion real de contratos.
- Validacion documental con IA.
- OCR.
- Comparacion facial.
- Recomendaciones inteligentes de vehiculos.

Este microservicio solo debe guardar referencias externas como:

- `cliente_id`
- `pago_id`
- `contrato_documento_id`

## Arquitectura Sugerida en NestJS

La implementacion debe seguir una arquitectura limpia por capas.

Estructura base sugerida:

```text
src/
  config/
  models/
  graphql/
    typeDefs/
    resolvers/
  services/
  validators/
  utils/
  index.js
```

Adaptacion recomendada para NestJS:

```text
src/
  config/
  common/
    errors/
    enums/
    utils/
  graphql/
    inputs/
    types/
  modules/
    categorias/
    vehiculos/
    puntos-entrega/
    reservas/
    alquileres/
    reportes/
    notificaciones/
  validators/
  app.module.ts
  main.ts
```

Cada modulo debe separar:

- Resolver GraphQL.
- Servicio de negocio.
- Modelo o entidad.
- DTO/Input GraphQL.
- Validaciones.

## Criterios de Respuesta GraphQL

Las respuestas deben ser consistentes y claras.

Se recomienda:

- Usar errores controlados para reglas de negocio.
- Validar entradas antes de ejecutar operaciones.
- Devolver entidades actualizadas despues de mutations.
- Evitar exponer errores internos de base de datos al cliente GraphQL.
- Usar enums GraphQL para estados.

## Plan de Desarrollo por Fases

### Fase 1 - Preparacion del Proyecto

Objetivo: dejar la base tecnica lista para desarrollar el microservicio.

Actividades:

- Crear o revisar proyecto NestJS.
- Instalar y configurar GraphQL.
- Configurar variables de entorno.
- Definir estructura de carpetas.
- Configurar conexion a base de datos si aplica.
- Crear enums compartidos de estados.
- Crear manejo base de errores.

Resultado esperado:

- Aplicacion NestJS ejecutando correctamente.
- GraphQL disponible.
- Estructura inicial lista.

### Fase 2 - Modelado del Dominio

Objetivo: definir las entidades centrales del microservicio.

Actividades:

- Crear modelos o entidades de `CategoriaVehiculo`.
- Crear modelos o entidades de `Vehiculo`.
- Crear modelos o entidades de `PuntoEntrega`.
- Crear modelos o entidades de `Reserva`.
- Crear modelos o entidades de `Alquiler`.
- Crear modelos o entidades de `Reporte`.
- Crear modelos o entidades de `Notificacion`.
- Definir relaciones internas entre entidades.

Resultado esperado:

- Dominio principal representado en codigo.
- Estados y relaciones listos para usarse desde servicios y resolvers.

### Fase 3 - GraphQL Base

Objetivo: exponer el contrato GraphQL del microservicio.

Actividades:

- Crear types GraphQL.
- Crear inputs GraphQL.
- Crear queries principales.
- Crear mutations principales.
- Registrar resolvers por modulo.
- Validar que el esquema GraphQL compile correctamente.

Resultado esperado:

- Esquema GraphQL navegable.
- Operaciones base disponibles para categorias, vehiculos, puntos, reservas y alquileres.

### Fase 4 - Gestion de Catalogos Operativos

Objetivo: implementar operaciones CRUD de datos base.

Actividades:

- Crear, listar, consultar y actualizar categorias.
- Crear, listar, consultar y actualizar vehiculos.
- Crear, listar, consultar y actualizar puntos de entrega.
- Validar campos obligatorios.
- Validar estados permitidos.

Resultado esperado:

- Catalogos operativos funcionales.
- Vehiculos y puntos disponibles para reservas.

### Fase 5 - Gestion de Disponibilidad y Reservas

Objetivo: implementar el nucleo de reservas.

Actividades:

- Consultar vehiculos disponibles por categoria, fechas y puntos.
- Crear reservas en estado `PENDIENTE`.
- Validar conflictos de fechas.
- Validar que el vehiculo no este reservado o alquilado en el mismo rango.
- Confirmar reservas cuando se reciba o procese el evento `PAGO_APROBADO`.
- Cancelar reservas.
- Registrar referencia de contrato documental firmado cuando corresponda.
- Cambiar reservas a `LISTA_PARA_ENTREGA` cuando exista `contrato_documento_id`.

Resultado esperado:

- Flujo de reserva funcional.
- Reglas de disponibilidad aplicadas.

### Fase 6 - Gestion de Alquileres

Objetivo: implementar el ciclo completo de entrega y devolucion.

Actividades:

- Crear alquiler desde reserva `LISTA_PARA_ENTREGA`.
- Iniciar alquiler registrando entrega.
- Cambiar vehiculo a `ALQUILADO`.
- Registrar kilometraje y combustible de salida.
- Cerrar alquiler registrando devolucion.
- Registrar kilometraje y combustible de retorno.
- Registrar danios, incidencias y cargos adicionales.
- Cambiar vehiculo a `DISPONIBLE` o `MANTENIMIENTO` segun corresponda.
- Consultar alquileres activos proximos a devolucion para automatizaciones externas.
- Consultar alquileres activos retrasados.
- Registrar cargos adicionales por retraso o incidencias sin procesar pagos.

Resultado esperado:

- Ciclo operativo de alquiler completo.
- Estados de reserva, alquiler y vehiculo sincronizados.
- Informacion disponible para que n8n ejecute recordatorios y escalamiento por retraso.

### Fase 7 - Reportes y Notificaciones

Objetivo: agregar soporte operativo para seguimiento interno.

Actividades:

- Crear consultas de reportes operativos.
- Generar resumen de reservas por estado.
- Generar resumen de alquileres por estado.
- Generar resumen de flota por estado.
- Generar resumen de alquileres retrasados.
- Crear notificaciones internas en eventos relevantes.
- Crear notificaciones internas por recordatorios, retrasos, avisos al administrador y cargos adicionales.
- Marcar notificaciones como `LEIDA`.

Resultado esperado:

- Informacion operativa disponible.
- Notificaciones internas manejables desde GraphQL.
- Flujo automatizado de devolucion soportado mediante consultas y registros del MS Alquiler.

### Fase 8 - Validaciones, Errores y Pruebas

Objetivo: robustecer el microservicio.

Actividades:

- Centralizar validaciones de entrada.
- Centralizar errores de negocio.
- Probar reglas de solapamiento de fechas.
- Probar transiciones de estados.
- Probar creacion, confirmacion y cancelacion de reservas.
- Probar inicio y cierre de alquileres.
- Probar reportes y notificaciones.

Resultado esperado:

- Microservicio estable.
- Reglas principales cubiertas por pruebas.
- Errores claros para el consumidor GraphQL.

### Fase 9 - Documentacion y Entrega

Objetivo: preparar el microservicio para revision y uso.

Actividades:

- Documentar queries y mutations principales.
- Agregar ejemplos de operaciones GraphQL.
- Documentar variables de entorno.
- Documentar reglas de negocio aplicadas.
- Revisar exclusiones del alcance.

Resultado esperado:

- Microservicio listo para integrarse con los demas servicios.
- Documentacion suficiente para desarrollo, pruebas y demostracion.

## Orden Recomendado de Implementacion

1. Configuracion base de NestJS y GraphQL.
2. Enums y errores comunes.
3. Modelos de catalogos: categorias, vehiculos y puntos.
4. Resolvers y servicios CRUD de catalogos.
5. Modelo y servicio de reservas.
6. Validacion de disponibilidad.
7. Confirmacion y cancelacion de reservas.
8. Modelo y servicio de alquileres.
9. Inicio y cierre de alquileres.
10. Reportes operativos.
11. Notificaciones internas.
12. Pruebas y documentacion final.

## Criterio de Finalizacion

La implementacion se considera completa cuando:

- El microservicio expone operaciones GraphQL funcionales.
- Las entidades principales estan implementadas.
- Las reglas de negocio de reservas y alquileres se cumplen.
- No se implementa logica perteneciente a otros microservicios.
- Las referencias externas se guardan correctamente.
- Los estados se manejan mediante enums.
- Los errores de negocio son claros.
- Existen pruebas o verificaciones para el flujo principal.
