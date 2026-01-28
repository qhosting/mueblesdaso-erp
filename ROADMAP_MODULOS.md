# Roadmap: Estado de Módulos (Muebles Daso)

Este documento detalla el nivel de avance actual de cada módulo del sistema frontend.

## Simbología
- 🎨 **UI Lista**: El diseño visual y la interactividad básica están terminados.
- 🧠 **Lógica Mock**: Funciona con datos simulados (`constants.ts`).
- 🔌 **API Real**: Conectado y consumiendo datos del Backend.
- 🚧 **En Progreso**: En desarrollo activo.

| Módulo | Estado Visual | Lógica de Datos | Estado General | Notas Técnicas |
| :--- | :---: | :---: | :---: | :--- |
| **Dashboard** (Panel Ejecutivo) | 🎨 | 🧠 | 🚧 Prototipo | Consume `MOCK_CLIENTS` para calcular balances totales. Falta endpoint `/stats`. |
| **ClientsModule** (Cartera) | 🎨 | 🧠 | 🚧 Prototipo | Tablas y filtrado funcionan en local. Falta CRUD real contra `/clients`. |
| **SalesModule** (Ventas) | 🎨 | 🧠 | 🚧 Prototipo | Carrito de compras funcional en memoria. No registra ventas en DB. |
| **InventoryModule** (Inventario) | 🎨 | 🧠 | 🚧 Prototipo | Visualización de stock estático. Falta sincronización real. |
| **CollectionIntelligence** (Mora) | 🎨 | 🧠 | 🚧 Prototipo | Cálculos de aging hechos en cliente. Deberían venir pre-calculados del backend. |
| **FieldApp** (App de Campo) | 🎨 | 🧠 | 🚧 Prototipo | Simulación de ruta de cobro. Falta geolocalización real y POST de pagos. |
| **ConfigTerminal** (DevOps) | 🎨 | N/A | ✅ Estático | Muestra logs simulados o configuración local. |
| **LandingPage** (Pública) | 🎨 | N/A | ✅ Completo | Página estática informativa. |

---

## Resumen de Diagnóstico
El sistema es actualmente un **"Frontend Shell"**: una cáscara vacía pero visualmente completa. Todos los módulos operativos requieren ser recableados para usar servicios HTTP reales en lugar de importar constantes.
