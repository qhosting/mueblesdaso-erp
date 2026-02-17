# 📌 Guía de Configuración de Variables - Easypanel
**Dominio de Producción:** `app.mueblesdaso.com`

> **⚠️ ADVERTENCIA DE SEGURIDAD:** Las tablas `cat_clientes` y `pagos` contienen datos reales. Asegúrate de que las credenciales de PostgreSQL sean las correctas antes de levantar los servicios para evitar bloqueos de conexión.

## 1. Servicio: `postgres` (Base de Datos)
*Crea este servicio usando el template de PostgreSQL en Easypanel.*

| Variable | Valor Sugerido / Actual | Descripción |
| :--- | :--- | :--- |
| `POSTGRES_USER` | `postgres` | Usuario maestro del servidor. |
| `POSTGRES_DB` | `mueblesdaso-db` | Nombre de la base de datos principal. |
| `POSTGRES_PASSWORD` | `c89fe7ed85855bf5092d` | Contraseña del usuario maestro. |

---

## 2. Servicio: `backend-api` (Lógica de Negocio)
*Este servicio conecta el Frontend con la DB y WhatsApp.*

| Variable | Valor |
| :--- | :--- |
| `DB_HOST` | `qhosting_mueblesdaso-db` |
| `DB_NAME` | `mueblesdaso-db` |
| `DB_USER` | `postgres` |
| `DB_PASS` | `c89fe7ed85855bf5092d` |
| `WAHA_URL` | `http://waha:3000` |
| `PORT` | `3000` |
| `JWT_SECRET` | `CLAVE_SECRETA_PARA_LOGIN_MUEBLESDASO` |

---

## 3. Servicio: `waha` (Externo)
*El servicio de WhatsApp (WAHA) se encuentra en un servidor externo.*

| Variable (en backend-api) | Valor |
| :--- | :--- |
| `WAHA_URL` | `https://tu-servidor-waha.com` (Reemplazar con URL real) |

---

## 4. Servicio: `n8n` (Externo)
*El servicio de automatización n8n se encuentra alojado en un servidor externo.*

> No requiere configuración en este despliegue de Easypanel.

---

## 5. Servicio: `frontend-pwa` (Interfaz Web)
*Servido por Node.js `serve` (Optimizado para SPA).*

| Variable | Valor |
| :--- | :--- |
| `VITE_API_URL` | `https://api.mueblesdaso.com` |
| `NODE_ENV` | `production` |

---

## 💡 Pasos Críticos en Easypanel:
1. **Redes**: Todos los servicios deben estar en la misma "Network" (por defecto lo están si están en el mismo Proyecto).
2. **Volúmenes**: En el servicio `postgres`, verifica que la ruta `/var/lib/postgresql/data` esté persistida en un volumen para no perder datos.
3. **SSL**: Activa HTTPS en la pestaña de dominios para `frontend-pwa`. La PWA **no se instalará** en celulares si no tienes SSL activo.
4. **Healthchecks**: Easypanel marcará los servicios como "Healthy" automáticamente si los puertos internos (80, 3000, 3001) responden.
