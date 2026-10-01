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
    ? process.env.CORS_ORIGEN.split(',')
    : ['http://localhost:3000', 'http://localhost:5173'],
});
