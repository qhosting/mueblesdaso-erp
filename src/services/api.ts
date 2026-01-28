import axios from 'axios';
import { ENV } from '../config/env';

const api = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globales (ej. 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si el token expiró o es inválido, cerrar sesión
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/'; // O recargar la página para que AuthContext detecte el cambio
    }
    return Promise.reject(error);
  }
);

export default api;
