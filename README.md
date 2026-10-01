# GesLab - Sistema de Gestión de Laboratorios

GesLab es una plataforma integral para la gestión de laboratorios académicos, que facilita la planificación de prácticas, reservas de espacios y colaboración docente.

## 📋 Características Principales

### Gestión de Prácticas
- **Creación y Edición**: Los docentes pueden crear y actualizar prácticas académicas detalladas.
- **Revisión Docente**: Workflow para enviar prácticas a revisión y registrar comentarios o aprobaciones.
- **Documentación**: Carga y gestión de documentos asociados a cada práctica.

### Reservas de Laboratorios
- **Disponibilidad**: Visualización en tiempo real de la disponibilidad de laboratorios.
- **Solicitudes**: Los estudiantes pueden solicitar reserva de laboratorios para sus prácticas.
- **Aprobaciones**: Gestión de solicitudes de reserva con estados Pendiente, Aprobada o Rechazada.

### Usuarios y Roles
- **Autenticación**: Registro e inicio de sesión seguro.
- **Roles**: Soporte para roles de Estudiante y Docente.
- **Perfil**: Gestión del perfil de usuario y recuperación de contraseña.

## 🚀 Instalación

Sigue estos pasos para desplegar la aplicación localmente:

1. **Clonar el repositorio** (o descargar el código fuente).

2. **Instalar Dependencias**:
   Abre una terminal en la raíz del proyecto y ejecuta:
   ```bash
   npm install
   ```

3. **Configuración de Entorno**:
   - Crea un archivo `.env` en la raíz del proyecto (si no existe).
   - Configura las variables de entorno necesarias (consultar `.env.example` si está disponible o la documentación del backend).

4. **Ejecutar la Aplicación**:
   ```bash
   npm start
   ```

   La aplicación estará disponible en `http://localhost:3000`.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React.js
- **Backend**: Node.js / Express (según el código fuente proporcionado).
- **Autenticación**: JWT (JSON Web Tokens).
- **Base de Datos**: PostgreSQL (configurada en `backend/config/db.js`).
- **Almacenamiento de Archivos**: Multer (para carga de documentos).

## 📂 Estructura del Proyecto

- `backend/`: Lógica del servidor, API y base de datos.
- `frontend/`: Interfaz de usuario y componentes de React.
- `peticiones.txt`: Documentación de endpoints de la API.

