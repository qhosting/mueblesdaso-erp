import api from './api';
import { Client } from '../../types';
import { MOCK_CLIENTS } from '../../constants';
import { ENV } from '../config/env';
import { wahaService } from './waha.service';


export const clientsService = {
  getAll: async (): Promise<Client[]> => {
    try {
      const response = await api.get<Client[]>('/clientes');
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      // Fallback a Mock si estamos en modo desarrollo y falla la API
      if (ENV.IS_DEV) {
        console.warn('⚠️ Usando MOCK_DATA para Clientes (API no disponible)');
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_CLIENTS), 800));
      }
      throw error;
    }
  },

  getById: async (id: string | number): Promise<Client> => {
    try {
      const response = await api.get<Client>(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      if (ENV.IS_DEV) {
        const mock = MOCK_CLIENTS.find(c => c.id_cliente.toString() === id.toString());
        if (mock) return Promise.resolve(mock);
      }
      throw error;
    }
  },

  update: async (id: number, data: Partial<Client>): Promise<Client> => {
    const response = await api.put<Client>(`/clientes/${id}`, data);

    // Notificar a n8n el cambio de datos del cliente
    await wahaService.sendNotificationToN8n('CLIENT_UPDATED', {
      id_cliente: id,
      ...data
    });

    return response.data;
  },

  create: async (data: Partial<Client>): Promise<Client> => {
    try {
      const response = await api.post<Client>('/clientes', data);

      // Notificar a n8n nuevo cliente (para mensaje de bienvenida)
      await wahaService.sendNotificationToN8n('CLIENT_CREATED', {
        ...data,
        id_cliente: response.data.id_cliente
      });

      return response.data;
    } catch (error) {
      if (ENV.IS_DEV) {
        const mockId = Math.floor(Math.random() * 1000);
        console.warn('⚠️ Mocking client creation');

        await wahaService.sendNotificationToN8n('CLIENT_CREATED_MOCK', {
          ...data,
          id_cliente: mockId
        });

        return { ...data, id_cliente: mockId } as Client;
      }
      throw error;
    }
  }
};

