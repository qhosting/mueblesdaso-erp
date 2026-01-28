# Estado Actual del Sistema y Hoja de Ruta a Producción

Este documento detalla el estado actual del sistema Muebles Daso, identifica los componentes faltantes y define los pasos necesarios para alcanzar un entorno de producción totalmente funcional.

## 1. Estado Actual: "Prototipo de Alta Fidelidad (Frontend)"

El sistema se encuentra actualmente en una fase de **Frontend Desconectado**.

*   **Interfaz (UI/UX)**: ✅ **Completa y Funcional**. Los módulos de Dashboard, Clientes, Ventas, Inventario y Cobranza (App de Campo) están visualmente terminados y son interactivos.
*   **Datos**: ⚠️ **Simulados (Mocks)**. Toda la información que se muestra (clientes, saldos, productos) proviene del archivo `constants.ts`. **No existe conexión real con la base de datos.**
*   **Infraestructura Frontend**: ✅ **Lista para Producción**. Se ha corregido el `Dockerfile` para construir la aplicación correctamente y servirla vía Nginx. El problema de la "página en blanco" está resuelto.
*   **Autenticación**: ❌ **Inexistente**. El sistema permite el acceso sin credenciales ("Modo: Sin Restricción").

## 2. Lo que Falta Implementar (Gap Analysis)

Para que el sistema funcione en un entorno real ("En Producción"), se deben desarrollar e integrar los siguientes componentes críticos:

### A. Capa de Servicios de API (Frontend)
El frontend necesita dejar de leer `constants.ts` y comenzar a pedir datos al servidor.
*   **Falta**: Crear un servicio HTTP (ej. `src/services/api.ts`) usando `fetch` o `axios`.
*   **Falta**: Reemplazar `MOCK_CLIENTS`, `MOCK_PAYMENTS`, etc., por llamadas asíncronas (ej. `api.clients.getAll()`).
*   **Falta**: Manejo de estados de "Cargando" (Loading) y "Error" en las pantallas.

### B. Integración de Autenticación
*   **Falta**: Pantalla de Login conectada al endpoint de autenticación del backend.
*   **Falta**: Almacenamiento seguro del Token JWT (en localStorage o Cookies).
*   **Falta**: Protección de rutas (Redirigir a `/login` si no hay sesión activa).

### C. Variables de Entorno
*   **Falta**: Configurar la aplicación para leer la URL del API desde el entorno.
    *   Actualmente `vite.config.ts` no fuerza el uso de `VITE_API_URL`.
    *   Se requiere asegurar que al construir la imagen Docker, se pase la variable `VITE_API_URL=https://api.mueblesdaso.com`.

## 3. Hoja de Ruta: Puesta en Producción

Para cumplir con el requerimiento de "que todo esté en producción", siga estos pasos técnicos:

### Paso 1: Verificación del Backend
Asegúrese de que el servicio `backend-api` descrito en el Manifiesto esté desplegado y respondiendo.
*   Prueba: `curl https://api.mueblesdaso.com/health` (o endpoint equivalente).

### Paso 2: Implementación del Cliente API
Modificar el código para consumir la API. Ejemplo de cambio necesario:

**Actual (`components/Dashboard.tsx`):**
```typescript
import { MOCK_CLIENTS } from '../constants';
const totalBalance = MOCK_CLIENTS.reduce(...);
```

**Requerido (Producción):**
```typescript
import { useEffect, useState } from 'react';
import { apiClient } from '../services/api';

// Dentro del componente
const [clients, setClients] = useState([]);
useEffect(() => {
  apiClient.get('/clientes').then(data => setClients(data));
}, []);
```

### Paso 3: Configuración de Despliegue (Easypanel/Docker)
Asegúrese de configurar las variables de entorno en su plataforma de despliegue (Easypanel):

| Servicio | Variable | Valor |
| :--- | :--- | :--- |
| **frontend-pwa** | `VITE_API_URL` | `https://api.mueblesdaso.com` |
| **frontend-pwa** | `GEMINI_API_KEY` | *(Tu clave real de Gemini)* |

---

**Resumen**: El código actual es seguro y estable como demostración. Para operar el negocio real, es imperativo realizar la **Integración con el Backend (Paso 2)**.
