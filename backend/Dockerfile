FROM node:20-slim

# Instalar OpenSSL para compatibilidad nativa con el motor de Prisma (OpenSSL 3.0 en Debian)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar manifiestos de dependencias y esquema de Prisma
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias del proyecto y generar cliente de Prisma
RUN npm ci && npx prisma generate

# Copiar el código fuente, recursos estáticos y script de inicio
COPY src ./src
COPY public ./public
COPY docker-entrypoint.sh ./

# Crear directorio para subida de archivos físicos (Multer) y asignar permisos
RUN mkdir -p uploads && chmod +x ./docker-entrypoint.sh && chown -R node:node /app

# Puerto en el que escucha Express
EXPOSE 3000

# Usuario no privilegiado para mayor seguridad
USER node

# Comando de inicio del servidor en producción aplicando migraciones y seed
ENTRYPOINT ["./docker-entrypoint.sh"]

