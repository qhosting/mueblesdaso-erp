import api from './api';
import { ENV } from '../config/env';

export interface DashboardStats {
  totalBalance: number;
  totalOverdue: number;
  totalClients: number;
  collectionEfficiency: number;
  projectedCollection: any[];
  portfolioDistribution: any[];
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get<DashboardStats>('/stats/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      if (ENV.IS_DEV) {
          // Fallback MOCK data matching the original component logic
          const { MOCK_CLIENTS } = await import('../../constants');
          const totalBalance = MOCK_CLIENTS.reduce((acc, c) => acc + c.saldo_actualcli, 0);
          const totalOverdue = MOCK_CLIENTS.reduce((acc, c) => acc + c.semdv, 0);

          return {
              totalBalance,
              totalOverdue,
              totalClients: MOCK_CLIENTS.length,
              collectionEfficiency: 88.5,
              projectedCollection: [
                { name: 'Sem 1', value: 12400, real: 11000 },
                { name: 'Sem 2', value: 15000, real: 14500 },
                { name: 'Sem 3', value: 11800, real: 10200 },
                { name: 'Sem 4', value: 19000, real: 17800 },
              ],
              portfolioDistribution: [
                { name: 'Al Corriente', value: 70 },
                { name: 'Mora 30d', value: 20 },
                { name: 'Mora Crítica 90d+', value: 10 },
              ]
          };
      }
      throw error;
    }
  }
};
