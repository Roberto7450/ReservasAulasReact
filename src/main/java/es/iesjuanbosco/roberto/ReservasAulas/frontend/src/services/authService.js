// Servicio de autenticación: login, registro, cambio contraseña
import apiClient from '../utils/api';

export const authService = {
  // POST: Iniciar sesión
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  // POST: Registrar usuario
  register: async (email, password, role = 'ROLE_PROFESOR') => {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      role,
    });
    return response.data;
  },

  // PATCH: Cambiar contraseña
  changePassword: async (passwordActual, nuevaPassword) => {
    const response = await apiClient.patch('/auth/cambiar-pass', {
      passwordActual,
      nuevaPassword,
    });
    return response.data;
  },
};