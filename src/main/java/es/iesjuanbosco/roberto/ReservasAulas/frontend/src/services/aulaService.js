import apiClient from '../utils/api';

export const aulaService = {
  obtenerTodas: async (params = {}) => {
    const response = await apiClient.get('/aulas', { params });
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await apiClient.get(`/aulas/${id}`);
    return response.data;
  },

  crear: async (aula) => {
    const response = await apiClient.post('/aulas', aula);
    return response.data;
  },

  actualizar: async (id, aula) => {
    const response = await apiClient.put(`/aulas/${id}`, aula);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await apiClient.delete(`/aulas/${id}`);
    return response.data;
  },
};
