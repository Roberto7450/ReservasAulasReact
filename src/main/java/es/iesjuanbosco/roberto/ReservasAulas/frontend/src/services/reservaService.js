// Servicio CRUD de Reservas
import apiClient, { formatDateToDDMMYYYY } from '../utils/api';

export const reservaService = {
  // GET: Obtener todas las reservas
  obtenerTodas: async () => {
    const response = await apiClient.get('/reservas');
    return response.data;
  },

  // GET: Obtener reserva por ID
  obtenerPorId: async (id) => {
    const response = await apiClient.get(`/reservas/${id}`);
    return response.data;
  },

  // POST: Crear reserva
  crear: async (reserva) => {
    const payload = {
      ...reserva,
      fecha: formatDateToDDMMYYYY(reserva.fecha),
    };
    const response = await apiClient.post('/reservas', payload);
    return response.data;
  },

  // PUT: Actualizar reserva
  actualizar: async (id, reserva) => {
    const payload = {
      ...reserva,
      fecha: formatDateToDDMMYYYY(reserva.fecha),
    };
    const response = await apiClient.put(`/reservas/${id}`, payload);
    return response.data;
  },

  // DELETE: Eliminar reserva
  eliminar: async (id) => {
    const response = await apiClient.delete(`/reservas/${id}`);
    return response.data;
  },
};