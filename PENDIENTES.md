# Lista de Pendientes Operativos (Post-Lanzamiento)

Este documento reemplaza al antiguo `TODO.md` y se enfoca en tareas de mantenimiento, despliegue y estabilización.

## 🔴 Prioridad Alta: Infraestructura
- [ ] **Configurar Backend**: Asegurar que el servicio `backend-api` en Easypanel esté corriendo y conectado a la DB.
- [ ] **Variables de Entorno**:
    - [ ] `VITE_API_URL` en el servicio Frontend.
    - [ ] `GOOGLE_SERVICE_ACCOUNT_JSON` en el servicio Backup Worker.
- [ ] **DNS**: Verificar que `api.mueblesdaso.com` resuelva correctamente.

## 🟡 Prioridad Media: Refinamiento
- [ ] **Collection Intelligence**: Migrar la lógica de cálculo de mora al backend (actualmente el frontend calcula sobre datos crudos).
- [ ] **Limpieza de Mocks**: Eliminar el archivo `constants.ts` una vez que se confirme que el backend cubre el 100% de los casos de uso.
- [ ] **Tests**: Crear una suite de pruebas E2E para el flujo de "Venta -> Cobro -> Backup".

## 🟢 Prioridad Baja: Futuras Mejoras
- [ ] **Reportes PDF**: Generar estados de cuenta descargables en el Dashboard.
- [ ] **Rutas Optimizadas**: Algoritmo para ordenar la ruta de cobro por distancia GPS.
