# 📌 Guía de Configuración de Variables - Easypanel
**Dominio de Producción:** `app.mueblesdaso.com`

> **⚠️ ADVERTENCIA DE SEGURIDAD:** Las tablas `cat_clientes` y `pagos` contienen datos reales. Asegúrate de que las credenciales de MariaDB sean las correctas antes de levantar los servicios para evitar bloqueos de conexión.

## 1. Servicio: `mariadb` (Base de Datos)
*Crea este servicio usando el template de MariaDB en Easypanel.*

| Variable | Valor Sugerido / Actual | Descripción |
| :--- | :--- | :--- |
| `MYSQL_ROOT_PASSWORD` | `mueblesdaso_root_2024` | Contraseña maestra del servidor. |
| `MYSQL_DATABASE` | `mueblesdaso_cob` | Debe coincidir con tu DB actual. |
| `MYSQL_USER` | `mueblesdaso_cob` | Usuario con permisos en `cat_clientes`. |
| `MYSQL_PASSWORD` | `B4Dl6VlHDo` | Contraseña del usuario anterior. |

---

## 2. Servicio: `backend-api` (Lógica de Negocio)
*Este servicio conecta el Frontend con la DB y WhatsApp.*

| Variable | Valor |
| :--- | :--- |
| `DB_HOST` | `mariadb` |
| `DB_NAME` | `mueblesdaso_cob` |
| `DB_USER` | `mueblesdaso_cob` |
| `DB_PASS` | `B4Dl6VlHDo` |
| `WAHA_URL` | `http://waha:3000` |
| `PORT` | `3000` |
| `JWT_SECRET` | `CLAVE_SECRETA_PARA_LOGIN_MUEBLESDASO` |

---

## 3. Servicio: `waha` (WhatsApp HTTP API)
*Usa la imagen `devlikeapro/waha`.*

| Variable | Valor | Descripción |
| :--- | :--- | :--- |
| `WHATSAPP_DEFAULT_SESSION` | `default` | Nombre de la sesión para escanear QR. |
| `WAHA_DASHBOARD_USER` | `admin` | Usuario para ver el panel de WAHA. |
| `WAHA_DASHBOARD_PASSWORD` | `muebles_waha_2024` | Contraseña para el panel de WAHA. |
| `WAHA_DEBUG` | `false` | Mantener en false en producción. |

---

## 4. Servicio: `n8n` (Automatizaciones)
*Para orquestar recordatorios automáticos de cobro.*

| Variable | Valor |
| :--- | :--- |
| `N8N_ENCRYPTION_KEY` | `muebles_crypto_key_unique_123` |
| `DB_TYPE` | `mariadb` |
| `DB_MARIADB_HOST` | `mariadb` |
| `DB_MARIADB_DATABASE` | `mueblesdaso_cob` |
| `DB_MARIADB_USER` | `mueblesdaso_cob` |
| `DB_MARIADB_PASSWORD` | `B4Dl6VlHDo` |
| `N8N_HOST` | `n8n.mueblesdaso.com` |

---

## 5. Servicio: `frontend-pwa` (Interfaz Web)
*Servido por Nginx (usando el Dockerfile.txt).*

| Variable | Valor |
| :--- | :--- |
| `VITE_API_URL` | `https://api.mueblesdaso.com` |
| `NODE_ENV` | `production` |

---

## 💡 Pasos Críticos en Easypanel:
1. **Redes**: Todos los servicios deben estar en la misma "Network" (por defecto lo están si están en el mismo Proyecto).
2. **Volúmenes**: En el servicio `mariadb`, verifica que la ruta `/var/lib/mysql` esté persistida en un volumen para no perder datos.
3. **SSL**: Activa HTTPS en la pestaña de dominios para `frontend-pwa`. La PWA **no se instalará** en celulares si no tienes SSL activo.
4. **Healthchecks**: Easypanel marcará los servicios como "Healthy" automáticamente si los puertos internos (80, 3000, 3001) responden.
