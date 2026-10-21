import dotenv from 'dotenv';

dotenv.config();

const variablesRequeridas = ['DATABASE_URL', 'JWT_SECRETO'];

variablesRequeridas.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Variable de entorno requerida NO configurada: ${variable}`);
  }
});

const SECRETOS_DEBILES = ['clave_segura_jwt_Ux_2026', 'clave_segura_jwt_Ux_2026_produccion', 'secreto', 'changeme'];

if (process.env.NODE_ENV === 'production') {
  const secreto = process.env.JWT_SECRETO;
  if (secreto.length < 32 || SECRETOS_DEBILES.includes(secreto)) {
    throw new Error('JWT_SECRETO es débil: en producción debe tener al menos 32 caracteres y no ser un valor de ejemplo');
  }
}

export const CONFIG = Object.freeze({

  PUERTO: parseInt(process.env.PUERTO || '3000', 10),
  
  NODE_ENV: process.env.NODE_ENV || 'development',

  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRETO: process.env.JWT_SECRETO,
  
  JWT_EXPIRACION: process.env.JWT_EXPIRACION || '8h',
  
  DIRECTORIO_SUBIDAS: process.env.DIRECTORIO_SUBIDAS || './uploads',
  TAMANO_MAXIMO_DOCUMENTO_MB: parseInt(process.env.TAMANO_MAXIMO_DOCUMENTO_MB || '20', 10),
  
  CORS_ORIGEN: process.env.CORS_ORIGEN
    ? process.env.CORS_ORIGEN.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
});
import dotenv from 'dotenv';

dotenv.config();

const variablesRequeridas = ['DATABASE_URL', 'JWT_SECRETO'];

variablesRequeridas.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Variable de entorno requerida NO configurada: ${variable}`);
  }
});

export const CONFIG = Object.freeze({

  PUERTO: parseInt(process.env.PUERTO || '3000', 10),
  
  NODE_ENV: process.env.NODE_ENV || 'development',

  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRETO: process.env.JWT_SECRETO,
  
  JWT_EXPIRACION: process.env.JWT_EXPIRACION || '8h',
  
  DIRECTORIO_SUBIDAS: process.env.DIRECTORIO_SUBIDAS || './uploads',
  TAMANO_MAXIMO_DOCUMENTO_MB: parseInt(process.env.TAMANO_MAXIMO_DOCUMENTO_MB || '20', 10),
  
  CORS_ORIGEN: process.env.CORS_ORIGEN
    ? process.env.CORS_ORIGEN.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
});
