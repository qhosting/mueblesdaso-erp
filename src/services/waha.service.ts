import api from './api';
import { ENV } from '../config/env';

export const wahaService = {
  sendMessage: async (chatId: string, text: string): Promise<{ success: boolean; messageId?: string }> => {
    try {
      // Formato de chatId para Waha suele ser '5214421234567@c.us'
      // Limpiamos el número por si viene sucio
      const cleanPhone = chatId.replace(/\D/g, '');
      const formattedChatId = `${cleanPhone}@c.us`;

      const response = await api.post<{ id: string; timestamp: number }>('/waha/api/sendText', {
        chatId: formattedChatId,
        text: text,
        session: 'default'
      });

      return { success: true, messageId: response.data.id };
    } catch (error) {
      console.error('Error sending WhatsApp:', error);

      if (ENV.IS_DEV) {
        console.warn(`⚠️ [MOCK WAHA] Enviando a ${chatId}: "${text}"`);
        return new Promise((resolve) =>
          setTimeout(() => resolve({ success: true, messageId: `MOCK-WA-${Date.now()}` }), 500)
        );
      }
      throw error;
    }
  },

  sendMedia: async (chatId: string, caption: string, mediaUrl: string): Promise<{ success: boolean }> => {
      // Implementación futura para enviar recibos como imagen
      console.log('Sending media not implemented yet');
      return { success: false };
  }
};
