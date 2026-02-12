// Servicio CRUD de Horarios
import apiClient, { formatTimeToHHmmss } from '../utils/api';

export const horarioService = {
  // GET: Obtener todos los horarios
  obtenerTodos: async () => {
    const response = await apiClient.get('/horarios');
    return response.data;
  },

  // GET: Obtener horario por ID
  obtenerPorId: async (id) => {
    const response = await apiClient.get(`/horarios/${id}`);
    return response.data;
  },

  // POST: Crear horario
  crear: async (horario) => {
    const payload = {
      ...horario,
      horaInicio: formatTimeToHHmmss(horario.horaInicio),
      horaFin: formatTimeToHHmmss(horario.horaFin),
    };
    const response = await apiClient.post('/horarios', payload);
    return response.data;
  },

  // PUT: Actualizar horario
  actualizar: async (id, horario) => {
    const payload = {
      ...horario,
      horaInicio: formatTimeToHHmmss(horario.horaInicio),
      horaFin: formatTimeToHHmmss(horario.horaFin),
    };
    const response = await apiClient.put(`/horarios/${id}`, payload);
    return response.data;
  },

  // DELETE: Eliminar horario
  eliminar: async (id) => {
    const response = await apiClient.delete(`/horarios/${id}`);
    return response.data;
  },
};