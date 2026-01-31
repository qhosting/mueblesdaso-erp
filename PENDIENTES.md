# Plan de Evolución Post-Lanzamiento (Pendientes)

Este documento estructura las tareas restantes en fases lógicas para dar continuidad al proyecto tras la implementación de la versión 1.0.

## Fase 5: Estabilización Operativa (Prioridad Inmediata)
**Objetivo:** Garantizar que la infraestructura desplegada funcione correctamente y sea segura.

- [ ] **Infraestructura Backend**:
    - [ ] Verificar estado "Running" de `backend-api` en Easypanel.
    - [ ] Confirmar conexión exitosa entre `backend-api` y `mariadb`.
- [ ] **Configuración de Dominio Único**:
    - [x] Nginx Reverse Proxy implementado (Frontend redirige `/api` al backend).
    - [ ] Validar que `app.mueblesdaso.com/api/health` responda correctamente.
    - [ ] Validar certificado SSL para `app.mueblesdaso.com`.
- [ ] **Variables de Entorno**:
    - [ ] Configurar `GOOGLE_SERVICE_ACCOUNT_JSON` en el microservicio Backup Worker.

## Fase 6: Calidad y Refinamiento (Corto Plazo)
**Objetivo:** Eliminar deuda técnica y asegurar la integridad de los datos.

- [ ] **Limpieza de Código**:
    - [ ] Migrar lógica de "Collection Intelligence" (Cálculo de Mora) al backend.
    - [ ] Eliminar archivo `constants.ts` y todas las referencias a datos Mock una vez validado el backend.
- [ ] **Aseguramiento de Calidad (QA)**:
    - [ ] Implementar Tests E2E (Playwright) para el flujo crítico: Login -> Venta -> Cobro.
    - [ ] Verificar restauración de backups (Descargar un ZIP de Drive y restaurarlo en un entorno local de prueba).

## Fase 7: Optimización y Expansión (Mediano Plazo)
**Objetivo:** Agregar valor al negocio mediante nuevas funcionalidades.

- [ ] **Reportes Avanzados**:
    - [ ] Generación de PDFs para estados de cuenta de clientes.
    - [ ] Exportación de reportes de ventas a Excel/CSV.
- [ ] **Logística**:
    - [ ] Algoritmo de optimización de rutas de cobranza (Travelling Salesman Problem) usando GeoJSON.
- [ ] **Automatización**:
    - [ ] Bot de WhatsApp para consulta de saldo automática por parte de los clientes.
