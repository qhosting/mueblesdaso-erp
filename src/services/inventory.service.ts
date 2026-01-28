import api from './api';
import { InventoryItem } from '../../types';
import { MOCK_INVENTORY } from '../../constants';
import { ENV } from '../config/env';

export const inventoryService = {
  getAll: async (): Promise<InventoryItem[]> => {
    try {
      const response = await api.get<InventoryItem[]>('/inventario');
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      if (ENV.IS_DEV) {
        console.warn('⚠️ Usando MOCK_DATA para Inventario (API no disponible)');
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_INVENTORY), 600));
      }
      throw error;
    }
  },

  updateStock: async (id: string, quantity: number): Promise<InventoryItem> => {
      const response = await api.patch<InventoryItem>(`/inventario/${id}`, { stock_actual: quantity });
      return response.data;
  }
};
