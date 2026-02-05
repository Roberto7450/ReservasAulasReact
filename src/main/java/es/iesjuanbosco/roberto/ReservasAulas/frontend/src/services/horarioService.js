import apiClient from '../utils/api';

export const horarioService = {
  obtenerTodas: async () => {
    const response = await apiClient.get('/horarios');
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await apiClient.get(`/horarios/${id}`);
    return response.data;
  },

  crear: async (horario) => {
    const response = await apiClient.post('/horarios', horario);
    return response.data;
  },

  actualizar: async (id, horario) => {
    const response = await apiClient.put(`/horarios/${id}`, horario);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await apiClient.delete(`/horarios/${id}`);
    return response.data;
  },
};
