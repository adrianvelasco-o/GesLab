#!/bin/sh
set -e

echo "================================================="
echo "  GESLAB BACKEND - INICIANDO ENTORNO DOCKER"
echo "================================================="

echo "==> Aplicando migraciones de Prisma en PostgreSQL..."
npx prisma migrate deploy

echo "==> Ejecutando seed inicial de base de datos..."
node prisma/seed.js || echo "Aviso: Error menor en seed o registros ya existentes."

echo "==> Iniciando servidor Express..."
exec node src/server.js
