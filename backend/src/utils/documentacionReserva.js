/**
 * Documentación obligatoria para poder solicitar y aprobar una reserva de laboratorio.
 * Complementarios (no bloquean): GUIA_ACTIVIDAD, EVIDENCIA, etc.
 */
export const DOCUMENTOS_OBLIGATORIOS_RESERVA = Object.freeze(['CONSENTIMIENTO_INFORMADO', 'PROTOCOLO_PRUEBA']);

export const ETIQUETA_DOCUMENTO = Object.freeze({
  CONSENTIMIENTO_INFORMADO: 'Consentimiento informado',
  PROTOCOLO_PRUEBA: 'Protocolo de prueba'
});

export function evaluarDocumentacion(documentos = []) {
  const tiposPresentes = new Set((documentos || []).map((d) => d.tipo));
  const presentes = DOCUMENTOS_OBLIGATORIOS_RESERVA.filter((t) => tiposPresentes.has(t));
  const faltantes = DOCUMENTOS_OBLIGATORIOS_RESERVA.filter((t) => !tiposPresentes.has(t));

  return {
    requeridos: DOCUMENTOS_OBLIGATORIOS_RESERVA.length,
    presentes: presentes.length,
    faltantes,
    completa: faltantes.length === 0
  };
}

export function describirFaltantes(faltantes) {
  return faltantes.map((tipo) => ETIQUETA_DOCUMENTO[tipo] || tipo).join(', ');
}
