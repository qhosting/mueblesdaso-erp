# Roadmap: Estado de Módulos (Muebles Daso)

Este documento detalla el nivel de avance actual de cada módulo del sistema.

## Simbología
- 🎨 **UI Lista**: El diseño visual y la interactividad básica están terminados.
- 🧠 **Lógica Mock**: Funciona con datos simulados (`constants.ts`).
- 🔌 **API Real**: Conectado y consumiendo datos del Backend.
- 🚧 **En Progreso**: En desarrollo activo.
- ✅ **Completado**: Funcional y listo para producción.

### Frontend (PWA)

| Módulo | Estado Visual | Lógica de Datos | Estado General | Notas Técnicas |
| :--- | :---: | :---: | :---: | :--- |
| **Autenticación (Login)** | ✅ | 🔌/🧠 | ✅ Completado | Integrado con `AuthService`. |
| **ClientsModule** (Cartera) | ✅ | 🔌/🧠 | ✅ Completado | CRUD real vía API + Waha. |
| **InventoryModule** (Inventario) | ✅ | 🔌/🧠 | ✅ Completado | Sincronización de stock en tiempo real. |
| **Dashboard** (Panel Ejecutivo) | ✅ | 🔌/🧠 | ✅ Completado | Métricas desde backend (`DashboardService`). |
| **SalesModule** (Ventas) | ✅ | 🔌/🧠 | ✅ Completado | Checkout transaccional. Stock check. |
| **FieldApp** (App de Campo) | ✅ | 🔌/🧠 | ✅ Completado | Pagos, Geolocalización y Modo Offline (PWA). |
| **CollectionIntelligence** (Mora) | 🎨 | 🧠 | 🚧 Prototipo | Lógica de cálculo en cliente. Pendiente migrar a backend. |
| **ConfigTerminal** (DevOps) | 🎨 | N/A | ✅ Estático | UI de configuración. |
| **LandingPage** (Pública) | 🎨 | N/A | ✅ Completo | Informativa. |

### Backend & Infraestructura

| Componente | Estado | Descripción |
| :--- | :---: | :--- |
| **API Gateway** | ✅ | Accesible vía `api.mueblesdaso.com` (Configurado en cliente). |
| **Backup Worker** | ✅ | Microservicio Node.js para backups automáticos a Google Drive. |
| **Docker Build** | ✅ | Optimizado (Multi-stage) y ligero (Alpine). |
| **Base de Datos** | ❓ | Pendiente de verificación de conectividad en Easypanel. |

---

## Resumen de Diagnóstico
El sistema ha alcanzado la versión **v1.0 (Release Candidate)**. La funcionalidad principal está completa y conectada. El foco ahora debe estar en la **Verificación de Despliegue** y la operación de los servicios de soporte (Backup).
