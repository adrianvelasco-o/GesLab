/**
 * Genera una respuesta estándar de éxito para la API REST.
 * @param {import('express').Response} res
 * @param {number} codigoHttp
 * @param {string} mensaje
 * @param {any} datos
 */
export function responderExito(res, codigoHttp = 200, mensaje = 'Operación realizada correctamente', datos = {}) {
  return res.status(codigoHttp).json({
    exito: true,
    mensaje,
    datos
  });
}

/**
 * Genera una respuesta estándar de error para la API REST.
 * @param {import('express').Response} res
 * @param {number} codigoHttp
 * @param {string} mensaje
 * @param {string} codigoError
 * @param {any} detalles
 */
export function responderError(res, codigoHttp = 400, mensaje = 'No se puede realizar la operación', codigoError = 'ERROR_GENERAL', detalles = null) {
  const cuerpoRespuesta = {
    exito: false,
    mensaje,
    error: {
      codigo: codigoError
    }
  };

  if (detalles) {
    cuerpoRespuesta.error.detalles = detalles;
  }

  return res.status(codigoHttp).json(cuerpoRespuesta);
}
