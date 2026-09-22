import app from './app.js';
import { CONFIG } from './config/ambiente.js';
import { prisma } from './config/prisma.js';

const puerto = CONFIG.PUERTO;

async function iniciarServidor() {
  // Intentar conectar a PostgreSQL mediante Prisma
  try {
    await prisma.$connect();
    console.log('Conexión exitosa a la base de datos PostgreSQL mediante Prisma.');
  } catch (error) {
    console.warn('ADVERTENCIA: No se pudo conectar al servidor PostgreSQL en localhost:5432.');
    console.warn('   Por favor asegúrate de iniciar el servicio de PostgreSQL o verificar DATABASE_URL en tu archivo .env.');
  }

  // Iniciar servidor Express
  const servidor = app.listen(puerto, () => {
    console.log(` Servidor GesLab backend escuchando en el puerto ${puerto} [Entorno: ${CONFIG.NODE_ENV}]`);
    console.log(`Endpoint de salud: http://localhost:${puerto}/api/salud`);
  });

  const cerrarServidor = async () => {
    console.log('\nCerrando servidor HTTP y desconectando Prisma...');
    servidor.close(async () => {
      await prisma.$disconnect();
      console.log('Servidor y base de datos desconectados de forma limpia.');
      process.exit(0);
    });
  };

  process.on('SIGINT', cerrarServidor);
  process.on('SIGTERM', cerrarServidor);
}

iniciarServidor();
