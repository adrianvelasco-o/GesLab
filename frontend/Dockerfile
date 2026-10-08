# Etapa 1: Compilación de la aplicación React con Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar manifiesto de dependencias para aprovechar caché
COPY package*.json ./
RUN npm ci

# Copiar el código fuente del frontend
COPY . .

# Argumento para configurar la URL base de la API durante el build de Vite
# Por defecto se utiliza /api para aprovechar el proxy inverso de Nginx sin problemas de CORS
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Compilar para producción (genera directorio dist/)
RUN npm run build

# Etapa 2: Servidor web de producción Nginx ligero
FROM nginx:alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar artefactos estáticos compilados desde la etapa de construcción
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto HTTP interno
EXPOSE 80

# Comando para ejecutar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
