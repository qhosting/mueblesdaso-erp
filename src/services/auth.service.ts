import api from './api';
import { User } from '../../types';

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    // NOTA: Endpoint teórico basado en el análisis
    const response = await api.post<LoginResponse>('/auth/login', { username, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }
};
