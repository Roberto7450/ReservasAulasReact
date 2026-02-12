// Servicio CRUD de Aulas
import apiClient from '../utils/api';

export const aulaService = {
  // GET: Obtener todas las aulas
  obtenerTodas: async (params = {}) => {
    const response = await apiClient.get('/aulas', { params });
    return response.data;
  },

  // GET: Obtener aula por ID
  obtenerPorId: async (id) => {
    const response = await apiClient.get(`/aulas/${id}`);
    return response.data;
  },

  // POST: Crear aula
  crear: async (aula) => {
    const response = await apiClient.post('/aulas', aula);
    return response.data;
  },

  // PUT: Actualizar aula
  actualizar: async (id, aula) => {
    const response = await apiClient.put(`/aulas/${id}`, aula);
    return response.data;
  },

  // DELETE: Eliminar aula
  eliminar: async (id) => {
    const response = await apiClient.delete(`/aulas/${id}`);
    return response.data;
  },
};