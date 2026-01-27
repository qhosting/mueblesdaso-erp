# Análisis del Repositorio: Muebles Daso ERP & CRM

Este documento presenta un análisis detallado del repositorio actual, que corresponde al **Frontend** del sistema ERP y CRM para "Muebles Daso".

## 1. Visión General
El proyecto es una aplicación web progresiva (PWA) construida con tecnologías modernas de React. Su objetivo principal es gestionar las operaciones de una empresa de muebles, incluyendo ventas, gestión de clientes, inventario y cobranza en campo.

El sistema está diseñado para interactuar con varios servicios backend, incluyendo una base de datos MariaDB, una API de lógica de negocio, un servicio de WhatsApp (Waha) y herramientas de automatización (n8n).

## 2. Stack Tecnológico

### Frontend
- **Framework Principal**: React 19.2.3
- **Lenguaje**: TypeScript (~5.8.2)
- **Build Tool**: Vite 6.2.0
- **Estilos**: Tailwind CSS (inferido por el uso de clases utilitarias como `bg-slate-50`, `flex`, etc. en los componentes).
- **Iconos**: Lucide React.
- **Gráficos**: Recharts.
- **Navegación**: Gestión de estado interna (SPA) sin enrutador externo visible en `App.tsx` (usa un estado `view`).

### Infraestructura y Despliegue
- **Contenerización**: Docker (Dockerfile incluido).
- **Servidor Web**: Nginx (nginx.conf incluido) para servir los archivos estáticos y manejar el enrutamiento.
- **Entorno Sugerido**: Easypanel (según `IMPLEMENTATION_MANIFEST.md`).

## 3. Estructura del Proyecto

### Archivos Clave
- **`App.tsx`**: Componente raíz que maneja la navegación principal a través de un estado `view`. Define la barra lateral y el área de contenido principal.
- **`IMPLEMENTATION_MANIFEST.md`**: Documento crucial que describe la arquitectura completa del sistema, incluyendo variables de entorno para todos los servicios (MariaDB, Backend, Waha, n8n, Frontend).
- **`types.ts`**: Define las interfaces TypeScript para los modelos de datos (Usuario, Cliente, Cobrador, Pago, Producto, Inventario, Log de WhatsApp, etc.).
- **`constants.ts`**: Contiene la configuración de conexión (referencial) y, críticamente, **datos de prueba (MOCK_CLIENTS, MOCK_USERS, etc.)** que actualmente alimentan la aplicación.

### Módulos (Componentes)
Basado en `App.tsx` y la estructura de archivos, el sistema se divide en los siguientes módulos:

1.  **Panel Ejecutivo (`Dashboard`)**: Vista general para administradores.
2.  **Clientes (`ClientsModule`)**: Gestión de la base de datos de clientes.
3.  **Ventas (`SalesModule`)**: Procesamiento y registro de ventas.
4.  **Inventario (`InventoryModule`)**: Control de stock de productos.
5.  **Inteligencia de Mora (`CollectionIntelligence`)**: Análisis de cartera vencida y gestión de cobranza.
6.  **App de Campo (`FieldApp`)**: Interfaz optimizada para móviles (PWA) destinada a los gestores de cobranza en la calle.
7.  **Configuración Técnica (`ConfigTerminal`)**: Herramientas para desarrolladores o configuración del sistema.
8.  **Landing Page (`LandingPage`)**: Página de presentación pública.

## 4. Estado Actual del Proyecto

### Diagnóstico de Producción (Página en Blanco)
Se identificó que el despliegue en producción fallaba (mostrando una página en blanco) debido a una configuración incorrecta en el `Dockerfile`.
- **Problema**: El Dockerfile original copiaba el código fuente `.tsx` directamente al servidor Nginx sin transpilarlo a JavaScript. Los navegadores no pueden ejecutar código TypeScript/JSX nativamente.
- **Solución Aplicada**: Se actualizó el `Dockerfile` para usar una construcción en dos etapas (Multi-stage build):
    1.  Compilación con Node.js (`npm run build`).
    2.  Servicio de los archivos estáticos generados (`dist/`) con Nginx.

### Implementación y Funcionalidad
El frontend está funcional visualmente, pero opera como un **Prototipo de Alta Fidelidad**:
1.  **Datos Simulados (Mocks)**: Los componentes principales (`Dashboard`, `ClientsModule`, etc.) consumen datos estáticos definidos en `constants.ts` (ej. `MOCK_CLIENTS`). No hay conexión activa con la base de datos o API en el código del frontend.
2.  **Autenticación Simulada**: El sistema se encuentra en "Modo: Sin Restricción". El login y la gestión de sesiones no están implementados o están bypassados intencionalmente.
3.  **Lógica de Negocio**: Gran parte de la lógica (cálculo de mora, filtros) se realiza en el cliente sobre los datos mock, en lugar de venir procesada del backend.

## 5. Implementaciones Faltantes
Para llevar el proyecto a un estado de producción real, falta implementar:

1.  **Servicio de API (Backend integration)**: Reemplazar el uso de `MOCK_DATA` por llamadas reales (`fetch` o `axios`) a los endpoints de la API (definidos teóricamente en el manifiesto).
2.  **Autenticación Real**: Implementar el flujo de Login (JWT), protección de rutas y manejo de sesiones.
3.  **Gestión de Estados Global**: Aunque la app es pequeña, al conectar con la API será necesario gestionar estados de carga, errores y caché de datos (ej. usando React Query o Context).
4.  **Manejo de Errores**: Implementar feedback visual real cuando fallan las peticiones al servidor.

## 6. Integraciones y Datos (Teórico)

El frontend está diseñado para consumir una API externa. Según el manifiesto de implementación:
- **API Backend**: Se espera que esté en una URL definida por `VITE_API_URL` (ej. `https://api.mueblesdaso.com`).
- **Base de Datos**: Los datos reflejan una estructura relacional con tablas como `cat_clientes` y `pagos`.

## 7. Pasos Siguientes Recomendados
Si se desea continuar con el desarrollo o despliegue:
1.  **Desplegar Backend**: Asegurar que el servicio `backend-api` esté corriendo y accesible.
2.  **Conectar Frontend-Backend**: Crear un servicio de API en el frontend (`src/services/api.ts`) y sustituir los mocks.
3.  **Probar Docker**: Verificar que la nueva imagen Docker construye y corre correctamente en local antes de subir a Easypanel.
