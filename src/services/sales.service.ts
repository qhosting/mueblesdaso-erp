import api from './api';
import { ENV } from '../config/env';

export interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface SaleRequest {
  clientId: number | string;
  items: SaleItem[];
  total: number;
  paymentMethod: 'CONTADO' | 'CREDITO';
  enganche?: number;
}

export const salesService = {
  createSale: async (saleData: SaleRequest): Promise<{ success: boolean; saleId: string }> => {
    try {
      const response = await api.post<{ success: boolean; saleId: string }>('/ventas', saleData);
      return response.data;
    } catch (error) {
      console.error('Error creating sale:', error);
      if (ENV.IS_DEV) {
        console.warn('⚠️ Usando MOCK_RESPONSE para Venta (API no disponible)');
        return new Promise((resolve) =>
          setTimeout(() => resolve({ success: true, saleId: `MOCK-SALE-${Date.now()}` }), 1000)
        );
      }
      throw error;
    }
  },

  validateStock: async (productId: string, quantity: number): Promise<boolean> => {
     // Endpoint teórico para verificar stock antes de añadir al carrito
     try {
         const response = await api.get<{ available: boolean }>(`/inventario/check/${productId}?qty=${quantity}`);
         return response.data.available;
     } catch (error) {
         if (ENV.IS_DEV) return true; // En dev asumimos siempre hay stock
         throw error;
     }
  }
};
