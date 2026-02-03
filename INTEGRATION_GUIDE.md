# 🔗 Guía de Integración: n8n + WAHA

Esta guía detalla cómo configurar la integración del ERP con **n8n** y **WAHA** utilizando únicamente APIs y Webhooks.

## 🚀 Arquitectura
1. **ERP (Frontend)**: Realiza peticiones a la API de WAHA para mensajes directos o envía eventos a n8n vía Webhook.
2. **n8n**: Actúa como el orquestador ("otro servidor") que recibe eventos del ERP o de WAHA.
3. **WAHA**: Maneja la conexión con WhatsApp y envía Webhooks a n8n sobre estados de mensajes o mensajes entrantes.

---

## 🛠️ Configuración en n8n

### 1. Webhook de Entrada (ERP -> n8n)
Crea un workflow con un nodo **Webhook**:
- **HTTP Method**: POST
- **Path**: `erp-events`
- **Response Mode**: On Received
- **URL**: Úsala en la variable `VITE_N8N_WEBHOOK_URL` del ERP.

### 2. Integración con WAHA
En n8n, usa un nodo **HTTP Request** para llamar a WAHA:
- **Method**: POST
- **URL**: `http://tu-servidor-waha:3000/api/sendText`
- **Headers**: `X-Api-Key: tu_api_key`
- **Body**: 
  ```json
  {
    "chatId": "{{ $json.data.phone }}@c.us",
    "text": "{{ $json.data.message }}",
    "session": "default"
  }
  ```

---

## 📱 Configuración en WAHA

Configura WAHA para que notifique a n8n sobre mensajes entrantes:
1. Accede a la interfaz de WAHA (o vía API).
2. Configura un **Webhook**:
   - **URL**: La URL del Webhook de n8n (otro workflow específico para mensajes entrantes).
   - **Events**: `message`, `message.any`, `state.change`.

---

## 📄 Variables de Entorno (ERP)
Asegúrate de configurar estas variables en tu archivo `.env` o en Easypanel:

```bash
VITE_WAHA_URL=https://tu-waha-url.com
VITE_WAHA_API_KEY=tu_secreto_api_key
VITE_N8N_WEBHOOK_URL=https://n8n.tu-servidor.com/webhook/erp-events
```

## 💻 Uso en el Código
El servicio `wahaService` ya está preparado:

```typescript
// Enviar mensaje directo (API)
await wahaService.sendMessage('5214421234567', 'Hola desde el ERP');

// Notificar a n8n (Webhook)
await wahaService.sendNotificationToN8n('payment_received', {
  clientId: '123',
  amount: 500,
  phone: '5214421234567'
});
```
