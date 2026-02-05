import apiClient, { formatDateToDDMMYYYY } from '../utils/api';

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
    // Convertir fecha a formato dd/MM/yyyy que espera el servidor
    const payload = {
      ...reserva,
      fecha: formatDateToDDMMYYYY(reserva.fecha),
    };
    const response = await apiClient.post('/reservas', payload);
    return response.data;
  },

  actualizar: async (id, reserva) => {
    // Convertir fecha a formato dd/MM/yyyy que espera el servidor
    const payload = {
      ...reserva,
      fecha: formatDateToDDMMYYYY(reserva.fecha),
    };
    const response = await apiClient.put(`/reservas/${id}`, payload);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await apiClient.delete(`/reservas/${id}`);
    return response.data;
  },
};
