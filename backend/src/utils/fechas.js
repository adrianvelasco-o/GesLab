/**
 * Utilidades de fechas y horas para reservas.
 * Las fechas de reserva se tratan siempre como fechas de calendario (AAAA-MM-DD) en UTC,
 * y las horas de las franjas como TIME en UTC, de forma independiente de la zona horaria del servidor.
 */

const ZONA_HORARIA_INSTITUCION = 'America/Bogota';

/** Fecha de hoy (AAAA-MM-DD) en la zona horaria de la institución. */
export function fechaHoyColombia() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA_HORARIA_INSTITUCION,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}

/** Verifica que el texto AAAA-MM-DD sea una fecha real (rechaza 2026-02-31, 2026-13-01, etc.). */
export function esFechaCalendarioValida(texto) {
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto || '');
  if (!coincidencia) return false;
  const [anio, mes, dia] = coincidencia.slice(1).map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  return (
    fecha.getUTCFullYear() === anio &&
    fecha.getUTCMonth() === mes - 1 &&
    fecha.getUTCDate() === dia
  );
}

/** Convierte 'HH:MM' en un Date UTC (1970-01-01) apto para columnas TIME de Postgres vía Prisma. */
export function horaATiempoUtc(horaTexto) {
  const [horas, minutos] = horaTexto.split(':').map(Number);
  return new Date(Date.UTC(1970, 0, 1, horas, minutos, 0));
}
