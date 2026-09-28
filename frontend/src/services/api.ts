import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Instancia global de Axios con la URL base
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaz para respuestas estandarizadas del Backend
export interface RespuestaApi<T = any> {
  exito: boolean;
  mensaje?: string;
  datos?: T;
  error?: any;
}

// -------------------------------------------------------------
// INTERFACES
// -------------------------------------------------------------

// Autenticación
export interface CredencialesLogin {
  usuario?: string;
  email?: string;
  contrasena: string;
}

export interface RespuestaLogin {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
  };
}

// HU14 (Tareas)
export interface Tarea {
  id?: number;
  titulo: string;
  descripcion: string;
  duracion_estimada_min: number;
  creado_en?: string;
}

// HU15 (PreTest)
export interface PreTest {
  id?: number;
  nombre_participante: string;
  edad: number;
  experiencia_tecnologica: string;
  observaciones: string;
  creado_en?: string;
}

// -------------------------------------------------------------
// SERVICIOS DEL SISTEMA
// -------------------------------------------------------------

// 1. Estado de Salud de la API
export const getSalud = () => api.get<RespuestaApi>('/salud');

// 2. Autenticación (Login)
export const login = (credenciales: CredencialesLogin) =>
  api.post<RespuestaApi<RespuestaLogin>>('/autenticacion/login', credenciales);

// -------------------------------------------------------------
// SERVICIOS HU14 (Tareas)
// -------------------------------------------------------------
export const getTareas = () => api.get<Tarea[]>('/tareas');
export const createTarea = (tarea: Omit<Tarea, 'id' | 'creado_en'>) => api.post<Tarea>('/tareas', tarea);
export const updateTarea = (id: number, tarea: Omit<Tarea, 'id' | 'creado_en'>) => api.put<Tarea>(`/tareas/${id}`, tarea);
export const deleteTarea = (id: number) => api.delete(`/tareas/${id}`);

// -------------------------------------------------------------
// SERVICIOS HU15 (PreTest)
// -------------------------------------------------------------
export const getPreTests = () => api.get<PreTest[]>('/pretests');
export const createPreTest = (pretest: Omit<PreTest, 'id' | 'creado_en'>) => api.post<PreTest>('/pretests', pretest);
export const updatePreTest = (id: number, pretest: Omit<PreTest, 'id' | 'creado_en'>) => api.put<PreTest>(`/pretests/${id}`, pretest);
export const deletePreTest = (id: number) => api.delete(`/pretests/${id}`);

// -------------------------------------------------------------
// SERVICIO DE SUBIDA DE ARCHIVOS (PDFs)
// -------------------------------------------------------------
export const subirDocumentoPdf = (archivo: File, practicaId: number = 1) => {
  const formData = new FormData();
  formData.append('archivo', archivo);
  formData.append('practicaId', practicaId.toString()); // <-- Se envía el ID requerido por el backend

  return api.post<RespuestaApi>('/documentos/subir', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};