import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/ambiente.js';

/**
 * Genera un token JWT firmado.
 * @param {object} payload
 * @returns {string}
 */
export function generarTokenJwt(payload) {
  return jwt.sign(payload, CONFIG.JWT_SECRETO, {
    expiresIn: CONFIG.JWT_EXPIRACION
  });
}

/**
 * Verifica y decodifica un token JWT.
 * @param {string} token
 * @returns {object}
 */
export function verificarTokenJwt(token) {
  return jwt.verify(token, CONFIG.JWT_SECRETO);
}
