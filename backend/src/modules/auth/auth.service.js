import * as authRepository from './auth.repository.js';
import { generarHashContrasena, compararContrasena } from '../../utils/hashContrasena.js';
import { generarTokenJwt } from '../../utils/tokenJwt.js';
import { AppError } from '../../errors/AppError.js';
import { CODIGOS_ERROR } from '../../constants/codigosError.js';

/**
 * Registra un nuevo usuario (por defecto rol ESTUDIANTE) con contraseña hasheada.
 */
export async function registrarUsuario({ nombres, apellidos, correoInstitucional, contrasena, rolNombre = 'ESTUDIANTE' }) {
  // 1. Verificar si el correo ya está registrado
  const usuarioExistente = await authRepository.buscarUsuarioPorCorreo(correoInstitucional);
  if (usuarioExistente) {
    throw new AppError('El correo institucional ya se encuentra registrado', 409, CODIGOS_ERROR.CORREO_YA_REGISTRADO);
  }

  // 2. Buscar el ID del rol solicitado
  let rol = await authRepository.buscarRolPorNombre(rolNombre);
  if (!rol) {
    // Si el rol aún no existe en BD, usar o crear rol por defecto
    rol = { id: 3, nombre: rolNombre }; // fallback
  }

  // 3. Hashear la contraseña con bcryptjs
  const contrasenaHash = await generarHashContrasena(contrasena);

  // 4. Crear el usuario en PostgreSQL
  const nuevoUsuario = await authRepository.crearUsuario({
    nombres,
    apellidos,
    correoInstitucional,
    contrasenaHash,
    rolId: rol.id,
    activo: true
  });

  // 5. Generar token JWT de bienvenida
  const token = generarTokenJwt({
    usuarioId: nuevoUsuario.id,
    rolNombre: nuevoUsuario.rol?.nombre || rolNombre
  });

  return {
    token,
    usuario: {
      id: nuevoUsuario.id,
      nombres: nuevoUsuario.nombres,
      apellidos: nuevoUsuario.apellidos,
      correoInstitucional: nuevoUsuario.correoInstitucional,
      rol: nuevoUsuario.rol?.nombre || rolNombre
    }
  };
}

/**
 * Inicia sesión validando credenciales y estado activo del usuario.
 */
export async function iniciarSesion(correoInstitucional, contrasena) {
  const usuario = await authRepository.buscarUsuarioPorCorreo(correoInstitucional);

  if (!usuario) {
    throw new AppError('Credenciales de acceso inválidas', 401, CODIGOS_ERROR.CREDENCIALES_INVALIDAS);
  }

  if (!usuario.activo) {
    throw new AppError('La cuenta de usuario se encuentra inactiva', 403, CODIGOS_ERROR.USUARIO_INACTIVO);
  }

  const contrasenaValida = await compararContrasena(contrasena, usuario.contrasenaHash);
  if (!contrasenaValida) {
    throw new AppError('Credenciales de acceso inválidas', 401, CODIGOS_ERROR.CREDENCIALES_INVALIDAS);
  }

  const token = generarTokenJwt({
    usuarioId: usuario.id,
    rolNombre: usuario.rol.nombre
  });

  return {
    token,
    usuario: {
      id: usuario.id,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      correoInstitucional: usuario.correoInstitucional,
      rol: usuario.rol.nombre
    }
  };
}

/**
 * Obtiene los datos del perfil del usuario autenticado.
 */
export async function obtenerPerfil(usuarioId) {
  const usuario = await authRepository.buscarUsuarioPorId(usuarioId);
  if (!usuario) {
    throw new AppError('Usuario no encontrado', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }
  return usuario;
}
