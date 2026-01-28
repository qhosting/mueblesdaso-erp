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
| **Dashboard** (Panel Ejecutivo) | 🎨 | 🧠 | 🚧 Prototipo | Consume `MOCK_CLIENTS` para calcular balances totales. Falta endpoint `/stats`. |
| **SalesModule** (Ventas) | 🎨 | 🧠 | 🚧 Prototipo | Carrito de compras funcional en memoria. No registra ventas en DB. |
| **CollectionIntelligence** (Mora) | 🎨 | 🧠 | 🚧 Prototipo | Cálculos de aging hechos en cliente. Deberían venir pre-calculados del backend. |
| **FieldApp** (App de Campo) | 🎨 | 🧠 | 🚧 Prototipo | Simulación de ruta de cobro. Falta geolocalización real y POST de pagos. |
| **ConfigTerminal** (DevOps) | 🎨 | N/A | ✅ Estático | Muestra logs simulados o configuración local. |
| **LandingPage** (Pública) | 🎨 | N/A | ✅ Completo | Página estática informativa. |

---

## Resumen de Diagnóstico
El sistema ha completado **Fase 2**. Los módulos de datos maestros (Clientes e Inventario) ahora intentan conectar con la API real, degradándose graciosamente a mocks si el backend no está disponible.
