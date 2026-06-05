-- CreateEnum
CREATE TYPE "VehiculoEstado" AS ENUM ('DISPONIBLE', 'RESERVADO', 'ALQUILADO', 'MANTENIMIENTO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "ReservaEstado" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'LISTA_PARA_ENTREGA', 'CANCELADA', 'VENCIDA');

-- CreateEnum
CREATE TYPE "AlquilerEstado" AS ENUM ('PENDIENTE_ENTREGA', 'EN_CURSO', 'FINALIZADO', 'OBSERVADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "NotificacionEstado" AS ENUM ('PENDIENTE', 'ENVIADA', 'LEIDA');

-- CreateEnum
CREATE TYPE "FirmaContratoEstado" AS ENUM ('PENDIENTE_FIRMA', 'FIRMADO', 'ESCALADO_ADMIN');

-- CreateEnum
CREATE TYPE "CargoAdicionalEstado" AS ENUM ('PENDIENTE_FACTURACION', 'FACTURADO', 'ANULADO');

-- CreateTable
CREATE TABLE "categorias_vehiculo" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorias_vehiculo_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "vehiculos" (
    "id_vehiculo" SERIAL NOT NULL,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "imagen_url" TEXT,
    "precio_dia" DECIMAL(10,2) NOT NULL,
    "estado" "VehiculoEstado" NOT NULL DEFAULT 'DISPONIBLE',
    "id_categoria" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehiculos_pkey" PRIMARY KEY ("id_vehiculo")
);

-- CreateTable
CREATE TABLE "puntos_entrega" (
    "id_punto_entrega" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "puntos_entrega_pkey" PRIMARY KEY ("id_punto_entrega")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id_reserva" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "id_vehiculo" INTEGER NOT NULL,
    "pago_id" INTEGER,
    "factura_comprobante_id" TEXT,
    "contrato_documento_id" TEXT,
    "id_punto_recogida" INTEGER NOT NULL,
    "id_punto_devolucion" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "estado" "ReservaEstado" NOT NULL DEFAULT 'PENDIENTE',
    "estado_firma_contrato" "FirmaContratoEstado" NOT NULL DEFAULT 'PENDIENTE_FIRMA',
    "fecha_firma_contrato" TIMESTAMP(3),
    "monto_base" DECIMAL(10,2) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id_reserva")
);

-- CreateTable
CREATE TABLE "alquileres" (
    "id_alquiler" SERIAL NOT NULL,
    "id_reserva" INTEGER NOT NULL,
    "id_vehiculo" INTEGER NOT NULL,
    "fecha_entrega_programada" TIMESTAMP(3) NOT NULL,
    "fecha_devolucion_programada" TIMESTAMP(3) NOT NULL,
    "fecha_entrega_real" TIMESTAMP(3),
    "fecha_devolucion_real" TIMESTAMP(3),
    "kilometraje_salida" INTEGER,
    "kilometraje_retorno" INTEGER,
    "combustible_salida" TEXT,
    "combustible_retorno" TEXT,
    "estado_vehiculo_entrega" TEXT,
    "estado_vehiculo_devolucion" TEXT,
    "danios" TEXT,
    "incidencias" TEXT,
    "cargos_adicionales_total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "estado" "AlquilerEstado" NOT NULL DEFAULT 'PENDIENTE_ENTREGA',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alquileres_pkey" PRIMARY KEY ("id_alquiler")
);

-- CreateTable
CREATE TABLE "cargos_adicionales" (
    "id_cargo_adicional" SERIAL NOT NULL,
    "id_alquiler" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "estado" "CargoAdicionalEstado" NOT NULL DEFAULT 'PENDIENTE_FACTURACION',
    "pago_id" INTEGER,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cargos_adicionales_pkey" PRIMARY KEY ("id_cargo_adicional")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id_notificacion" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "id_reserva" INTEGER,
    "id_alquiler" INTEGER,
    "tipo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "canal" TEXT NOT NULL,
    "estado" "NotificacionEstado" NOT NULL DEFAULT 'PENDIENTE',
    "fecha_envio" TIMESTAMP(3),
    "fecha_lectura" TIMESTAMP(3),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id_notificacion")
);

-- CreateTable
CREATE TABLE "reportes" (
    "id_reporte" SERIAL NOT NULL,
    "tipo_reporte" TEXT NOT NULL,
    "fecha_generacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT,
    "datos_resumen" JSONB NOT NULL,

    CONSTRAINT "reportes_pkey" PRIMARY KEY ("id_reporte")
);

-- CreateIndex
CREATE UNIQUE INDEX "categorias_vehiculo_nombre_key" ON "categorias_vehiculo"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_placa_key" ON "vehiculos"("placa");

-- CreateIndex
CREATE INDEX "vehiculos_estado_idx" ON "vehiculos"("estado");

-- CreateIndex
CREATE INDEX "vehiculos_id_categoria_estado_idx" ON "vehiculos"("id_categoria", "estado");

-- CreateIndex
CREATE INDEX "puntos_entrega_ciudad_estado_idx" ON "puntos_entrega"("ciudad", "estado");

-- CreateIndex
CREATE INDEX "reservas_cliente_id_idx" ON "reservas"("cliente_id");

-- CreateIndex
CREATE INDEX "reservas_estado_idx" ON "reservas"("estado");

-- CreateIndex
CREATE INDEX "reservas_estado_firma_contrato_idx" ON "reservas"("estado_firma_contrato");

-- CreateIndex
CREATE INDEX "reservas_pago_id_idx" ON "reservas"("pago_id");

-- CreateIndex
CREATE INDEX "reservas_contrato_documento_id_idx" ON "reservas"("contrato_documento_id");

-- CreateIndex
CREATE INDEX "reservas_id_vehiculo_fecha_inicio_fecha_fin_idx" ON "reservas"("id_vehiculo", "fecha_inicio", "fecha_fin");

-- CreateIndex
CREATE UNIQUE INDEX "alquileres_id_reserva_key" ON "alquileres"("id_reserva");

-- CreateIndex
CREATE INDEX "alquileres_estado_idx" ON "alquileres"("estado");

-- CreateIndex
CREATE INDEX "alquileres_id_vehiculo_estado_idx" ON "alquileres"("id_vehiculo", "estado");

-- CreateIndex
CREATE INDEX "alquileres_fecha_devolucion_programada_estado_idx" ON "alquileres"("fecha_devolucion_programada", "estado");

-- CreateIndex
CREATE INDEX "cargos_adicionales_id_alquiler_idx" ON "cargos_adicionales"("id_alquiler");

-- CreateIndex
CREATE INDEX "cargos_adicionales_estado_idx" ON "cargos_adicionales"("estado");

-- CreateIndex
CREATE INDEX "cargos_adicionales_pago_id_idx" ON "cargos_adicionales"("pago_id");

-- CreateIndex
CREATE INDEX "notificaciones_usuario_id_estado_idx" ON "notificaciones"("usuario_id", "estado");

-- CreateIndex
CREATE INDEX "notificaciones_id_reserva_idx" ON "notificaciones"("id_reserva");

-- CreateIndex
CREATE INDEX "notificaciones_id_alquiler_idx" ON "notificaciones"("id_alquiler");

-- CreateIndex
CREATE INDEX "notificaciones_estado_idx" ON "notificaciones"("estado");

-- CreateIndex
CREATE INDEX "reportes_tipo_reporte_fecha_generacion_idx" ON "reportes"("tipo_reporte", "fecha_generacion");

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias_vehiculo"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_id_vehiculo_fkey" FOREIGN KEY ("id_vehiculo") REFERENCES "vehiculos"("id_vehiculo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_id_punto_recogida_fkey" FOREIGN KEY ("id_punto_recogida") REFERENCES "puntos_entrega"("id_punto_entrega") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_id_punto_devolucion_fkey" FOREIGN KEY ("id_punto_devolucion") REFERENCES "puntos_entrega"("id_punto_entrega") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alquileres" ADD CONSTRAINT "alquileres_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reservas"("id_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alquileres" ADD CONSTRAINT "alquileres_id_vehiculo_fkey" FOREIGN KEY ("id_vehiculo") REFERENCES "vehiculos"("id_vehiculo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargos_adicionales" ADD CONSTRAINT "cargos_adicionales_id_alquiler_fkey" FOREIGN KEY ("id_alquiler") REFERENCES "alquileres"("id_alquiler") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reservas"("id_reserva") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_id_alquiler_fkey" FOREIGN KEY ("id_alquiler") REFERENCES "alquileres"("id_alquiler") ON DELETE SET NULL ON UPDATE CASCADE;
