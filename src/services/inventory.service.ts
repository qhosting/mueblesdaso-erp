import api from './api';
import { InventoryItem } from '../../types';
import { MOCK_INVENTORY } from '../../constants';
import { ENV } from '../config/env';
import { wahaService } from './waha.service';

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

    // Alerta de stock bajo vía n8n (umbral de 5 unidades)
    if (quantity <= 5) {
      await wahaService.sendNotificationToN8n('LOW_STOCK_ALERT', {
        productId: id,
        currentStock: quantity,
        timestamp: new Date().toISOString()
      });
    }

    return response.data;
  }
};

