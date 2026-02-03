import axios from 'axios';
import { ENV } from '../config/env';

// Cliente axios específico para WAHA si es externo
const wahaApi = axios.create({
  baseURL: ENV.WAHA_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(ENV.WAHA_API_KEY ? { 'X-Api-Key': ENV.WAHA_API_KEY } : {}),
  },
});

export const wahaService = {
  /**
   * Envía un mensaje directamente vía API de WAHA
   */
  sendMessage: async (chatId: string, text: string): Promise<{ success: boolean; messageId?: string }> => {
    try {
      const cleanPhone = chatId.replace(/\D/g, '');
      const formattedChatId = `${cleanPhone}@c.us`;

      const response = await wahaApi.post('/api/sendText', {
        chatId: formattedChatId,
        text: text,
        session: 'default'
      });

      return { success: true, messageId: response.data.id };
    } catch (error) {
      console.error('Error sending WhatsApp via WAHA:', error);

      if (ENV.IS_DEV) {
        console.warn(`⚠️ [MOCK WAHA] Enviando a ${chatId}: "${text}"`);
        return new Promise((resolve) =>
          setTimeout(() => resolve({ success: true, messageId: `MOCK-WA-${Date.now()}` }), 500)
        );
      }
      throw error;
    }
  },

  /**
   * Envía una notificación a n8n para que este procese el envío
   */
  sendNotificationToN8n: async (event: string, payload: any): Promise<{ success: boolean }> => {
    if (!ENV.N8N_WEBHOOK_URL) {
      console.warn('⚠️ N8N_WEBHOOK_URL no configurado');
      return { success: false };
    }

    try {
      await axios.post(ENV.N8N_WEBHOOK_URL, {
        event,
        data: payload,
        timestamp: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error sending to n8n:', error);
      return { success: false };
    }
  },

  sendMedia: async (chatId: string, caption: string, mediaUrl: string): Promise<{ success: boolean }> => {
    try {
      const cleanPhone = chatId.replace(/\D/g, '');
      const formattedChatId = `${cleanPhone}@c.us`;

      await wahaApi.post('/api/sendImage', {
        chatId: formattedChatId,
        file: {
          url: mediaUrl
        },
        caption: caption,
        session: 'default'
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending media via WAHA:', error);
      return { success: false };
    }
  }
};
