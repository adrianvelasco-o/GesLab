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
    console.error('ERROR: No se pudo conectar a PostgreSQL. Verifica que el servicio esté activo y revisa DATABASE_URL.');
    console.error(error.message);
    process.exit(1);
  }

  // Iniciar servidor Express escuchando en todas las interfaces de red para Docker
  const servidor = app.listen(puerto, '0.0.0.0', () => {
    console.log(` Servidor Ux backend escuchando en http://0.0.0.0:${puerto} [Entorno: ${CONFIG.NODE_ENV}]`);
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
