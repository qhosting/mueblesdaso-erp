# Lista de Tareas Pendientes (TODO)

## 🚨 Crítico: Conexión con Backend
- [ ] **Crear Servicio API**: Implementar `src/services/api.ts` (usando Axios o Fetch) para centralizar las peticiones HTTP.
- [ ] **Reemplazar Mocks**: Eliminar el uso de `MOCK_CLIENTS`, `MOCK_PAYMENTS`, `MOCK_PRODUCTS` en:
    - `components/Dashboard.tsx`
    - `components/ClientsModule.tsx`
    - `components/SalesModule.tsx`
    - `components/InventoryModule.tsx`
- [ ] **Manejo de Errores**: Agregar notificaciones visuales (Toast/Alert) cuando falle la conexión con el servidor.

## 🔐 Crítico: Autenticación y Seguridad
- [ ] **Implementar Login Real**: Conectar la pantalla de inicio con el endpoint `/auth/login` del backend.
- [ ] **Persistencia de Sesión**: Guardar el JWT en `localStorage` o Cookies seguras.
- [ ] **Proteger Rutas**: Crear un componente `<PrivateRoute />` que redirija al Login si no hay token.
- [ ] **Roles de Usuario**: Habilitar/deshabilitar módulos según el rol del usuario (ej. Vendedor vs Director).

## ⚙️ Configuración y Despliegue
- [ ] **Variables de Entorno**: Leer `import.meta.env.VITE_API_URL` en el servicio de API en lugar de URLs harcodeadas.
- [ ] **Easypanel**: Configurar la variable `VITE_API_URL` en el panel de control del servidor.

## 📱 Funcionalidades Específicas
- [ ] **Sincronización Offline**: Implementar lógica para que la PWA (App de Campo) guarde datos localmente si no hay internet y sincronice al volver.
- [ ] **Notificaciones Push**: Integrar con el navegador para avisos de cobranza.
