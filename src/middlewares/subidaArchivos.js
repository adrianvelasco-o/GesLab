import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from '../errors/AppError.js';
import { CODIGOS_ERROR } from '../constants/codigosError.js';
import { CONFIG } from '../config/ambiente.js';

// Asegurar que el directorio de subidas exista en disco
const directorioSubidas = path.resolve(CONFIG.DIRECTORIO_SUBIDAS);
if (!fs.existsSync(directorioSubidas)) {
  fs.mkdirSync(directorioSubidas, { recursive: true });
}

// Configuración de almacenamiento en disco con nombres únicos UUID/timestamp
const almacenamiento = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, directorioSubidas);
  },
  filename: (_req, file, cb) => {
    const sufijoUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `doc-${sufijoUnico}${extension}`);
  }
});

// Filtro estricto: Solo permitir archivos con formato PDF
const filtroArchivos = (_req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const esPdf = file.mimetype === 'application/pdf' && extension === '.pdf';

  if (!esPdf) {
    return cb(
      new AppError(
        'Solo se permiten archivos en formato PDF (.pdf)',
        400,
        CODIGOS_ERROR.DATOS_INVALIDOS
      ),
      false
    );
  }

  cb(null, true);
};

export const subirPdf = multer({
  storage: almacenamiento,
  limits: {
    fileSize: CONFIG.TAMANO_MAXIMO_DOCUMENTO_MB * 1024 * 1024 // Límite en Bytes (20 MB)
  },
  fileFilter: filtroArchivos
});
