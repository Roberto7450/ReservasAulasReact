import axios from 'axios';

// Determinar dinámicamente la URL del API basado en el host actual
const getApiBaseUrl = () => {
  // Si estamos en localhost, usar localhost:8080
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8080';
  }
  
  // Si estamos en un dominio remoto (GitHub Codespaces, etc), usar el mismo host con puerto 8080
  // y el mismo protocolo (https)
  const protocol = window.location.protocol; // 'https:' o 'http:'
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:8080`;
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para convertir fecha ISO a dd/MM/yyyy
export const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Función para convertir dd/MM/yyyy a ISO yyyy-MM-dd (para input date)
export const formatDateToISO = (dateString) => {
  if (!dateString) return '';
  if (dateString.includes('-')) {
    // Ya está en formato ISO
    return dateString;
  }
  // Convertir de dd/MM/yyyy a yyyy-MM-dd
  const parts = dateString.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateString;
};

// Función para convertir hora HH:mm a HH:mm:ss
export const formatTimeToHHmmss = (timeString) => {
  if (!timeString) return '';
  if (timeString.includes(':') && timeString.split(':').length === 2) {
    return `${timeString}:00`;
  }
  return timeString;
};

// Función para convertir HH:mm:ss a HH:mm (para input time)
export const formatTimeToHHmm = (timeString) => {
  if (!timeString) return '';
  if (timeString.includes(':') && timeString.split(':').length === 3) {
    return timeString.substring(0, 5); // Tomar solo HH:mm
  }
  return timeString;
};

// Interceptor para agregar token JWT a las solicitudes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
