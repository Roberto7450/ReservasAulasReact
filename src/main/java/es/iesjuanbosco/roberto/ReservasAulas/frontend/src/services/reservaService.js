import apiClient from '../utils/api';

export const reservaService = {
  obtenerTodas: async () => {
    const response = await apiClient.get('/reservas');
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await apiClient.get(`/reservas/${id}`);
    return response.data;
  },

  crear: async (reserva) => {
    const response = await apiClient.post('/reservas', reserva);
    return response.data;
  },

  actualizar: async (id, reserva) => {
    const response = await apiClient.put(`/reservas/${id}`, reserva);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await apiClient.delete(`/reservas/${id}`);
    return response.data;
  },
};
