-- Alinea la base de datos con schema.prisma.
-- El schema ya definía notificaciones.tipo como ENUM, notificaciones.leida_en y la tabla
-- dispositivos_usuarios, pero la migración inicial no los creaba. Añade además tareas y pretests.

-- CreateEnum
CREATE TYPE "tipo_notificacion" AS ENUM (
  'PRACTICA_ENVIADA_REVISION',
  'PRACTICA_APROBADA',
  'PRACTICA_RECHAZADA',
  'PRACTICA_CERRADA',
  'RESERVA_SOLICITADA',
  'RESERVA_APROBADA',
  'RESERVA_RECHAZADA',
  'RESERVA_DOCUMENTACION_FALTANTE'
);

-- CreateEnum
CREATE TYPE "tipo_dispositivo" AS ENUM ('ANDROID', 'IOS');

-- AlterTable: notificaciones
ALTER TABLE "notificaciones" ADD COLUMN "leida_en" TIMESTAMP(3);
ALTER TABLE "notificaciones" ALTER COLUMN "tipo" TYPE "tipo_notificacion" USING ("tipo"::"tipo_notificacion");

-- CreateTable
CREATE TABLE "dispositivos_usuarios" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "token_firebase" VARCHAR(255) NOT NULL,
    "tipo_dispositivo" "tipo_dispositivo" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "ultimo_uso_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dispositivos_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tareas" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "duracion_estimada_min" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tareas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pretests" (
    "id" SERIAL NOT NULL,
    "nombre_participante" VARCHAR(120) NOT NULL,
    "edad" INTEGER NOT NULL,
    "experiencia_tecnologica" VARCHAR(20) NOT NULL,
    "observaciones" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pretests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dispositivos_usuarios_token_firebase_key" ON "dispositivos_usuarios"("token_firebase");

-- CreateIndex
CREATE INDEX "dispositivos_usuarios_usuario_id_activo_idx" ON "dispositivos_usuarios"("usuario_id", "activo");

-- AddForeignKey
ALTER TABLE "dispositivos_usuarios" ADD CONSTRAINT "dispositivos_usuarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
