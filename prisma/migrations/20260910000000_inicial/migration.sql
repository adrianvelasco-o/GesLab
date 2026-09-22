-- ==========================================
-- Motor: PostgreSQL 15+
-- ==========================================

-- CreateEnum
CREATE TYPE "nombre_rol" AS ENUM ('ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE', 'ENCARGADO');

-- CreateEnum
CREATE TYPE "dia_semana" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO');

-- CreateEnum
CREATE TYPE "estado_practica" AS ENUM ('BORRADOR', 'EN_REVISION', 'RECHAZADA', 'APROBADA', 'EN_EJECUCION', 'FINALIZADA', 'CERRADA');

-- CreateEnum
CREATE TYPE "tipo_instrumento" AS ENUM ('GUIA_OBSERVACION', 'CUESTIONARIO_PRE_TEST', 'BANCO_TAREAS', 'CUESTIONARIO_POST_TEST');

-- CreateEnum
CREATE TYPE "tipo_documento" AS ENUM ('CONSENTIMIENTO_INFORMADO', 'PROTOCOLO_PRUEBA', 'GUIA_ACTIVIDAD', 'REPORTE_FINAL', 'EVIDENCIA', 'OTRO');

-- CreateEnum
CREATE TYPE "resultado_revision" AS ENUM ('APROBADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "estado_reserva" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA', 'CANCELADA');

-- CreateTable: roles
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "nombre" "nombre_rol" NOT NULL,
    "descripcion" VARCHAR(255),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable: usuarios
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "correo_institucional" VARCHAR(150) NOT NULL,
    "contrasena_hash" VARCHAR(255) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable: laboratorios
CREATE TABLE "laboratorios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "ubicacion" VARCHAR(150) NOT NULL,
    "capacidad" INTEGER NOT NULL DEFAULT 1,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "laboratorios_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "laboratorios_capacidad_check" CHECK ("capacidad" > 0)
);

-- CreateTable: horarios
CREATE TABLE "horarios" (
    "id" SERIAL NOT NULL,
    "laboratorio_id" INTEGER NOT NULL,
    "dia_semana" "dia_semana" NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "horarios_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "horarios_rango_check" CHECK ("hora_inicio" < "hora_fin")
);

-- CreateTable: practicas
CREATE TABLE "practicas" (
    "id" SERIAL NOT NULL,
    "estudiante_id" INTEGER NOT NULL,
    "docente_id" INTEGER,
    "titulo" VARCHAR(200) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,
    "estado" "estado_practica" NOT NULL DEFAULT 'BORRADOR',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "eliminado_en" TIMESTAMP(3),

    CONSTRAINT "practicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable: instrumentos
CREATE TABLE "instrumentos" (
    "id" SERIAL NOT NULL,
    "practica_id" INTEGER NOT NULL,
    "tipo" "tipo_instrumento" NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "instrucciones" TEXT,
    "contenido" JSONB,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instrumentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable: participantes
CREATE TABLE "participantes" (
    "id" SERIAL NOT NULL,
    "practica_id" INTEGER NOT NULL,
    "codigo_anonimo" VARCHAR(50) NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "edad" INTEGER,
    "genero" VARCHAR(30),
    "ocupacion" VARCHAR(100),
    "experiencia_previa" TEXT,
    "consentimiento_firmado" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participantes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "participantes_edad_check" CHECK ("edad" IS NULL OR "edad" >= 0)
);

-- CreateTable: documentos
CREATE TABLE "documentos" (
    "id" SERIAL NOT NULL,
    "practica_id" INTEGER NOT NULL,
    "subido_por_usuario_id" INTEGER NOT NULL,
    "tipo" "tipo_documento" NOT NULL,
    "nombre_original" VARCHAR(255) NOT NULL,
    "nombre_almacenamiento" VARCHAR(255) NOT NULL,
    "ruta" VARCHAR(500) NOT NULL,
    "tipo_mime" VARCHAR(100) NOT NULL,
    "tamano_bytes" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "documentos_tamano_check" CHECK ("tamano_bytes" > 0)
);

-- CreateTable: revisiones
CREATE TABLE "revisiones" (
    "id" SERIAL NOT NULL,
    "practica_id" INTEGER NOT NULL,
    "docente_id" INTEGER NOT NULL,
    "resultado" "resultado_revision" NOT NULL,
    "comentarios_generales" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revisiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable: observaciones
CREATE TABLE "observaciones" (
    "id" SERIAL NOT NULL,
    "revision_id" INTEGER NOT NULL,
    "seccion" VARCHAR(50) NOT NULL,
    "detalle" TEXT NOT NULL,
    "resuelta" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "observaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable: reservas
CREATE TABLE "reservas" (
    "id" SERIAL NOT NULL,
    "practica_id" INTEGER NOT NULL,
    "laboratorio_id" INTEGER NOT NULL,
    "horario_id" INTEGER NOT NULL,
    "solicitante_id" INTEGER NOT NULL,
    "revisor_id" INTEGER,
    "fecha_reserva" DATE NOT NULL,
    "estado" "estado_reserva" NOT NULL DEFAULT 'PENDIENTE',
    "motivo_rechazo_cancelacion" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable: notificaciones
CREATE TABLE "notificaciones" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "referencia_entidad" VARCHAR(50),
    "referencia_id" INTEGER,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- ==========================================
-- ÍNDICES Y RESTRICCIONES DE UNICIDAD
-- ==========================================

-- Roles
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");

-- Usuarios
CREATE UNIQUE INDEX "usuarios_correo_institucional_key" ON "usuarios"("correo_institucional");
CREATE INDEX "usuarios_correo_institucional_idx" ON "usuarios"("correo_institucional");
CREATE INDEX "usuarios_rol_id_activo_idx" ON "usuarios"("rol_id", "activo");

-- Horarios
CREATE UNIQUE INDEX "horarios_laboratorio_id_dia_semana_hora_inicio_hora_fin_key" ON "horarios"("laboratorio_id", "dia_semana", "hora_inicio", "hora_fin");

-- Prácticas
CREATE INDEX "practicas_estudiante_id_estado_idx" ON "practicas"("estudiante_id", "estado");
CREATE INDEX "practicas_docente_id_estado_idx" ON "practicas"("docente_id", "estado");

-- Instrumentos
CREATE INDEX "instrumentos_practica_id_tipo_idx" ON "instrumentos"("practica_id", "tipo");

-- Participantes
CREATE UNIQUE INDEX "participantes_practica_id_codigo_anonimo_key" ON "participantes"("practica_id", "codigo_anonimo");

-- Documentos
CREATE INDEX "documentos_practica_id_tipo_idx" ON "documentos"("practica_id", "tipo");

-- Revisiones y Observaciones
CREATE INDEX "revisiones_practica_id_creado_en_idx" ON "revisiones"("practica_id", "creado_en");
CREATE INDEX "observaciones_revision_id_resuelta_idx" ON "observaciones"("revision_id", "resuelta");

-- Reservas
CREATE INDEX "reservas_laboratorio_id_fecha_reserva_estado_idx" ON "reservas"("laboratorio_id", "fecha_reserva", "estado");
CREATE INDEX "reservas_solicitante_id_estado_idx" ON "reservas"("solicitante_id", "estado");

-- PREVENCIÓN DE DUPLICADOS EN POSTGRESQL (PENDIENTE, APROBADA)
CREATE UNIQUE INDEX "uq_reserva_activa_laboratorio_horario" 
ON "reservas" ("laboratorio_id", "fecha_reserva", "horario_id") 
WHERE "estado" IN ('PENDIENTE', 'APROBADA');

-- Notificaciones
CREATE INDEX "notificaciones_usuario_id_leida_idx" ON "notificaciones"("usuario_id", "leida");

-- ==========================================
-- CLAVES FORÁNEAS (FOREIGN KEYS)
-- ==========================================

ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "horarios" ADD CONSTRAINT "horarios_laboratorio_id_fkey" FOREIGN KEY ("laboratorio_id") REFERENCES "laboratorios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "practicas" ADD CONSTRAINT "practicas_estudiante_id_fkey" FOREIGN KEY ("estudiante_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "practicas" ADD CONSTRAINT "practicas_docente_id_fkey" FOREIGN KEY ("docente_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "instrumentos" ADD CONSTRAINT "instrumentos_practica_id_fkey" FOREIGN KEY ("practica_id") REFERENCES "practicas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "participantes" ADD CONSTRAINT "participantes_practica_id_fkey" FOREIGN KEY ("practica_id") REFERENCES "practicas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "documentos" ADD CONSTRAINT "documentos_practica_id_fkey" FOREIGN KEY ("practica_id") REFERENCES "practicas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_subido_por_usuario_id_fkey" FOREIGN KEY ("subido_por_usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "revisiones" ADD CONSTRAINT "revisiones_practica_id_fkey" FOREIGN KEY ("practica_id") REFERENCES "practicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "revisiones" ADD CONSTRAINT "revisiones_docente_id_fkey" FOREIGN KEY ("docente_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "observaciones" ADD CONSTRAINT "observaciones_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "revisiones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "reservas" ADD CONSTRAINT "reservas_practica_id_fkey" FOREIGN KEY ("practica_id") REFERENCES "practicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_laboratorio_id_fkey" FOREIGN KEY ("laboratorio_id") REFERENCES "laboratorios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_horario_id_fkey" FOREIGN KEY ("horario_id") REFERENCES "horarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_solicitante_id_fkey" FOREIGN KEY ("solicitante_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_revisor_id_fkey" FOREIGN KEY ("revisor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
