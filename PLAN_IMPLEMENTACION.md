# Plan de Implementación por Fases (Hoja de Ruta Técnica)

Este plan define la estrategia de desarrollo, que ha evolucionado desde el prototipo hasta la versión de producción actual.

## Historial de Fases Completadas

### Fase 1: Cimientos y Conectividad (✅ Completado)
*   Capa de Servicios HTTP (Axios) con interceptores JWT.
*   Autenticación completa (Login, Contexto, Protección de Rutas).
*   Configuración de Dockerfile multi-stage y Variables de Entorno.

### Fase 2: Datos Maestros (✅ Completado)
*   Conexión de Módulo de Clientes a API.
*   Conexión de Módulo de Inventario a API.
*   Manejo de estados de carga y error.

### Fase 3: Transacciones y Operación (✅ Completado)
*   Registro de Ventas con validación de stock.
*   Registro de Pagos en App de Campo.
*   Dashboard Ejecutivo conectado a métricas reales.

### Fase 4: Integraciones Avanzadas (✅ Completado)
*   **PWA**: Soporte Offline y Service Workers.
*   **WhatsApp**: Integración de WahaService para recordatorios.
*   **Notificaciones**: Sistema de alertas en tiempo real.

---

## Fase 5: Estabilización y Operaciones (🚧 En Curso)
**Objetivo**: Asegurar la robustez del despliegue y la seguridad de los datos.

1.  **Backup Automático (✅ Implementado)**:
    *   Microservicio `backup-worker` desplegado.
    *   Configuración de Credenciales de Google Cloud.
    *   Verificación de la tarea programada (3:00 AM).

2.  **Verificación de Producción (Pendiente)**:
    *   Confirmar conexión entre Frontend y Backend en Easypanel.
    *   **Arquitectura de Dominio Único (Single Domain)**:
        *   Frontend (`app.mueblesdaso.com`) sirve la UI.
        *   Nginx redirige `/api` al backend interno (`backend-api:3000`).
        *   Esto elimina la necesidad de `api.mueblesdaso.com`.

3.  **Limpieza de Deuda Técnica**:
    *   Eliminar datos mock residuales en `CollectionIntelligence`.
    *   Implementar tests E2E (Playwright) para flujos críticos.

---

## Estrategia Actual
El desarrollo activo ha concluido. El proyecto se encuentra en **Fase de Despliegue y Monitoreo**.
Se recomienda revisar el archivo `PENDIENTES.md` para tareas operativas específicas.
