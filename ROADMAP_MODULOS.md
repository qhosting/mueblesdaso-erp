# Roadmap: Estado de Módulos (Muebles Daso)

Este documento detalla el nivel de avance actual de cada módulo del sistema frontend.

## Simbología
- 🎨 **UI Lista**: El diseño visual y la interactividad básica están terminados.
- 🧠 **Lógica Mock**: Funciona con datos simulados (`constants.ts`).
- 🔌 **API Real**: Conectado y consumiendo datos del Backend.
- 🚧 **En Progreso**: En desarrollo activo.
- ✅ **Completado**: Funcional y listo para producción.

| Módulo | Estado Visual | Lógica de Datos | Estado General | Notas Técnicas |
| :--- | :---: | :---: | :---: | :--- |
| **Autenticación (Login)** | ✅ | 🔌/🧠 | ✅ Completado | UI lista, servicio Auth integrado. Usa Fallback Mock si falla API. |
| **ClientsModule** (Cartera) | ✅ | 🔌/🧠 | ✅ Completado | Conectado a `ClientsService`. Usa Fallback Mock en DEV. |
| **InventoryModule** (Inventario) | ✅ | 🔌/🧠 | ✅ Completado | Conectado a `InventoryService`. Usa Fallback Mock en DEV. |
| **Dashboard** (Panel Ejecutivo) | ✅ | 🔌/🧠 | ✅ Completado | Conectado a `DashboardService`. Usa Fallback Mock en DEV. |
| **SalesModule** (Ventas) | ✅ | 🔌/🧠 | ✅ Completado | Checkout real vía `SalesService`. Validaciones de stock asíncronas. |
| **FieldApp** (App de Campo) | ✅ | 🔌/🧠 | ✅ Completado | Registro de pagos conectado a `PaymentsService`. |
| **CollectionIntelligence** (Mora) | 🎨 | 🧠 | 🚧 Prototipo | Cálculos de aging hechos en cliente. Falta servicio dedicado. |
| **ConfigTerminal** (DevOps) | 🎨 | N/A | ✅ Estático | Muestra logs simulados o configuración local. |
| **LandingPage** (Pública) | 🎨 | N/A | ✅ Completo | Página estática informativa. |

---

## Resumen de Diagnóstico
El sistema ha completado **Fase 3**. El núcleo transaccional (Ventas y Cobranza) y el Dashboard administrativo ya están integrados a la capa de servicios. Quedan pendientes integraciones avanzadas (Waha, Offline).
