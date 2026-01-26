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
- **`constants.ts`**: Probablemente contiene valores constantes utilizados en la aplicación (no inspeccionado en detalle pero presente).

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

## 4. Integraciones y Datos

El frontend está diseñado para consumir una API externa. Según el manifiesto de implementación:
- **API Backend**: Se espera que esté en una URL definida por `VITE_API_URL` (ej. `https://api.mueblesdaso.com`).
- **Autenticación**: Manejo de roles de usuario (SUPER_ADMIN, DIRECTOR, COBRANZA, etc.) y tokens JWT.
- **Base de Datos**: Los datos reflejan una estructura relacional con tablas como `cat_clientes` y `pagos`.

## 5. Observaciones Adicionales
- **Seguridad**: Se advierte sobre el manejo de datos reales en producción.
- **PWA**: La aplicación está configurada para funcionar como una PWA, lo cual es crítico para el módulo de "App de Campo".
- **Estado del Desarrollo**: El archivo `package.json` indica una versión `0.0.0`, lo que sugiere que el proyecto está en una fase inicial o de desarrollo activo.

## 6. Pasos Siguientes Recomendados
Si se desea continuar con el desarrollo o despliegue:
1.  Asegurar que el archivo `.env.local` o las variables de entorno del servidor (como `VITE_API_URL`) estén configuradas correctamente.
2.  Verificar la conexión con el backend y que los endpoints coincidan con los tipos definidos en `types.ts`.
3.  Probar la construcción de la imagen Docker y el despliegue en el entorno de destino (Easypanel u otro).
