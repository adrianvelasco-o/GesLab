import bcrypt from 'bcryptjs';

/**
 * Genera el hash seguro de una contraseña.
 * @param {string} contrasena
 * @returns {Promise<string>}
 */
export async function generarHashContrasena(contrasena) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(contrasena, salt);
}

/**
 * Compara una contraseña en texto plano con un hash guardado.
 * @param {string} contrasena
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export async function compararContrasena(contrasena, hash) {
  return bcrypt.compare(contrasena, hash);
}
