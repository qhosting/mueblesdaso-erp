
# 📌 Manifiesto de Implementación - Mueblesdaso ERP & CRM

Este documento registra las funcionalidades core del sistema para prevenir regresiones en futuras actualizaciones.

## 1. 🏗️ Infraestructura (Docker & DevOps)
- [x] **Docker Compose Maestro:** Configuración para MariaDB, WAHA y App Core.
- [x] **Esquema SQL Legacy:** Integración de `cat_clientes` con tablas de autenticación y transacciones.
- [x] **Easypanel Ready:** Dockerfiles optimizados para despliegue en un solo clic.

## 2. 👥 Módulo de Clientes (CRM & Cobranza Admin)
- [x] **Vista de Lista:** Filtrado por nombre, contrato y estatus.
- [x] **Vista de Gestores:** Tarjetas de rendimiento con % de riesgo y mora acumulada.
- [x] **Aging (Antigüedad de Saldos):** Tabla financiera con cubetas de 0-30, 31-60, 61-90 y 91+ días.
- [x] **Forecast (Pronóstico):** Proyección de ingresos por vencer en las próximas 4 semanas.
- [x] **Centro de Comando (Modal de Gestión):**
    - [x] **Bitácora Dinámica:** Registro de visitas, llamadas y notas del sistema.
    - [x] **Integración WAHA:** Botones para disparar recordatorios automáticos vía WhatsApp.
    - [x] **Compromisos de Pago:** Formulario para agendar promesas que impactan la ruta del cobrador.
    - [x] **Validación de Domicilio:** Auditoría de estatus (Confirmado/Dudoso/Inexistente).

## 3. 📱 App de Campo (PWA)
- [x] **Ruta del Día:** Filtrado inteligente de clientes por proximidad y día de cobro.
- [x] **Modo Offline:** Estrategia de Service Worker (Network-First) para IndexedDB (VitePWA).
- [x] **Registro de Abonos:** Pad numérico optimizado para móviles.
- [x] **Recibos Digitales:** Generación automática y envío vía WhatsApp post-pago.

## 4. 🤖 Automatización & Inteligencia
- [x] **WAHA API:** Servicio de backend para envío de mensajes transaccionales.
- [x] **n8n Workflows:** Lógica de "Factura Vencida -> Notificación WAHA" (Configuración técnica).
- [x] **Dashboard Financiero:** Gráficos de flujo de efectivo y comparativa Proyección vs Real.

## 5. 🛠️ Pendientes / Próximos Pasos
- [ ] Implementar los Dockerfiles individuales por servicio.
- [ ] Conectar los endpoints de `SalesModule` con la generación de contratos PDF.
- [ ] Configurar los Webhooks de WAHA para recibir respuestas de clientes y guardarlas en la Bitácora.
- [ ] Implementar la sincronización de fondo (Background Sync) para pagos capturados sin red.
