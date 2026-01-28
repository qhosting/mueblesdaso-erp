# Plan de Implementación por Fases (Hoja de Ruta Técnica)

Este plan define la estrategia para transformar el prototipo actual en un sistema de producción conectado y funcional.

## Fase 1: Cimientos y Conectividad (✅ Completado)
**Objetivo**: Establecer la comunicación con el servidor y asegurar el acceso.

1.  **Capa de Servicios HTTP** (✅):
    *   Instalar `axios`.
    *   Crear `src/services/api.ts` con configuración base (Base URL, Interceptores).
    *   Configurar variables de entorno (`VITE_API_URL`).
2.  **Autenticación (Auth)** (✅):
    *   Implementar servicio `AuthService.login(user, pass)`.
    *   Crear Contexto de React (`AuthProvider`) para manejar el estado de la sesión.
    *   Implementar persistencia del Token JWT.
    *   Proteger rutas (Redirección automática a Login).

## Fase 2: Datos Maestros (Semana 2 - Pendiente)
**Objetivo**: Poblar el sistema con información real de la base de datos.

1.  **Módulo de Clientes**:
    *   Reemplazar `MOCK_CLIENTS` por `ClientsService.getAll()`.
    *   Implementar paginación en el servidor (si la base de datos es grande).
    *   Habilitar la vista de detalle de cliente con datos reales (Historial, Saldos).
2.  **Módulo de Inventario**:
    *   Conectar `InventoryService` para leer productos y stock en tiempo real.
    *   Sustituir `MOCK_INVENTORY` y `MOCK_PRODUCTS`.

## Fase 3: Transacciones y Operación (Semana 3)
**Objetivo**: Permitir que el negocio opere (vender y cobrar).

1.  **Ventas (SalesModule)**:
    *   Implementar `SalesService.createSale(saleData)`.
    *   Validar stock en backend antes de confirmar venta.
2.  **Cobranza (FieldApp)**:
    *   Implementar registro de pagos: `PaymentsService.registerPayment()`.
    *   Asegurar que los pagos actualicen el saldo del cliente inmediatamente.
3.  **Dashboard**:
    *   Crear endpoint de estadísticas en backend (para no calcular en frontend).
    *   Conectar widgets del Dashboard a estos endpoints de resumen.

## Fase 4: Integraciones Avanzadas (Semana 4+)
**Objetivo**: Automatización y valor agregado.

1.  **WhatsApp (Waha)**:
    *   Integrar botones de "Enviar Recordatorio" en `ClientsModule` con la API de Waha.
2.  **Modo Offline (PWA)**:
    *   Implementar Service Workers para cachear la ruta de cobro del día.
    *   Sincronización en segundo plano (Background Sync) para subir pagos al recuperar conexión.
3.  **Notificaciones**:
    *   Sistema de alertas en tiempo real (WebSockets o Polling) para nuevos pagos o ventas.

---

## Estrategia de Ejecución Recomendada

Actualmente se ha completado la **Fase 1**.
Siguiente paso recomendado: **Comenzar Fase 2 con el Módulo de Clientes**, ya que es la base para Ventas y Cobranza.
