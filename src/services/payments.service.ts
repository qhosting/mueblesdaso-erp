import api from './api';
import { ENV } from '../config/env';

export interface PaymentRequest {
  clientId: number | string;
  amount: number;
  paymentMethod: 'EFECTIVO' | 'TRANSFERENCIA';
  collectorId?: string; // ID del gestor que cobra
  location?: { lat: number; lng: number }; // Geolocalización del cobro
}

export const paymentsService = {
  registerPayment: async (paymentData: PaymentRequest): Promise<{ success: boolean; paymentId: string }> => {
    try {
      const response = await api.post<{ success: boolean; paymentId: string }>('/pagos', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error registering payment:', error);
      if (ENV.IS_DEV) {
         console.warn('⚠️ Usando MOCK_RESPONSE para Pago (API no disponible)');
         return new Promise((resolve) =>
           setTimeout(() => resolve({ success: true, paymentId: `MOCK-PAY-${Date.now()}` }), 800)
         );
      }
      throw error;
    }
  },

  getTodaysRoute: async (collectorId: string): Promise<any[]> => {
     // Obtener la ruta de cobro del día para un gestor
     try {
         const response = await api.get(`/rutas/${collectorId}/hoy`);
         return response.data;
     } catch (error) {
         if (ENV.IS_DEV) return []; // Fallback empty
         throw error;
     }
  }
};
