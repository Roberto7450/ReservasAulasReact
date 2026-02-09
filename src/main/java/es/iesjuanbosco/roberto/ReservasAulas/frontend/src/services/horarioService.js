import apiClient, { formatTimeToHHmmss } from '../utils/api';

export const horarioService = {

  obtenerTodos: async () => {
    const response = await apiClient.get('/horarios');
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await apiClient.get(`/horarios/${id}`);
    return response.data;
  },

  crear: async (horario) => {
    // Convertir horas a formato HH:mm:ss que Jackson puede deserializar
    const payload = {
      ...horario,
      horaInicio: formatTimeToHHmmss(horario.horaInicio),
      horaFin: formatTimeToHHmmss(horario.horaFin),
    };
    const response = await apiClient.post('/horarios', payload);
    return response.data;
  },

  actualizar: async (id, horario) => {
    // Convertir horas a formato HH:mm:ss que Jackson puede deserializar
    const payload = {
      ...horario,
      horaInicio: formatTimeToHHmmss(horario.horaInicio),
      horaFin: formatTimeToHHmmss(horario.horaFin),
    };
    const response = await apiClient.put(`/horarios/${id}`, payload);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await apiClient.delete(`/horarios/${id}`);
    return response.data;
  },
};
