export class AppError extends Error {
  constructor(mensaje, codigoHttp = 400, codigoError = 'ERROR_GENERAL', detalles = null) {
    super(mensaje);
    this.codigoHttp = codigoHttp;
    this.codigoError = codigoError;
    this.detalles = detalles;
    this.esOperacional = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
