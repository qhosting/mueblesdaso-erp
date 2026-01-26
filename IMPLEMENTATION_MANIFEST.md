# 📌 Manifiesto de Despliegue - Mueblesdaso ERP
**Dominio Principal:** `app.mueblesdaso.com`

Copia y pega estas variables en la sección **Environment Variables** de cada servicio en Easypanel.

## 1. Servicio: `mariadb` (Base de Datos)
| Key | Value |
| :--- | :--- |
| `MYSQL_ROOT_PASSWORD` | `mueblesdaso_root_2024` |
| `MYSQL_DATABASE` | `mueblesdaso_cob` |
| `MYSQL_USER` | `mueblesdaso_cob` |
| `MYSQL_PASSWORD` | `B4Dl6VlHDo` |

---

## 2. Servicio: `app` (Frontend / PWA)
*Dominio asociado en Easypanel: `app.mueblesdaso.com`*

| Key | Value |
| :--- | :--- |
| `DB_HOST` | `mariadb` |
| `DB_NAME` | `mueblesdaso_cob` |
| `DB_USER` | `mueblesdaso_cob` |
| `DB_PASS` | `B4Dl6VlHDo` |
| `WAHA_URL` | `http://waha:3000` |
| `NODE_ENV` | `production` |
| `API_KEY_SECRET` | `muebles-secret-2024` |

---

## 3. Servicio: `waha` (WhatsApp API)
*Para uso interno por la App y n8n.*

| Key | Value |
| :--- | :--- |
| `WHATSAPP_DEFAULT_SESSION` | `default` |
| `WAHA_DEBUG` | `false` |
| `WAHA_ZIP_LOGS` | `true` |

---

## 4. Servicio: `n8n` (Automatización)
*Nota: Si n8n tiene su propio subdominio (ej: n8n.mueblesdaso.com), úsalo en WEBHOOK_URL.*

| Key | Value |
| :--- | :--- |
| `N8N_ENCRYPTION_KEY` | `mueblesdaso_n8n_secure_key_123` |
| `N8N_USER_MANAGEMENT_JWT_SECRET` | `secret_jwt_muebles_8899` |
| `N8N_HOST` | `app.mueblesdaso.com` |
| `WEBHOOK_URL` | `https://app.mueblesdaso.com/n8n/` |
| `DB_TYPE` | `mariadb` |
| `DB_MARIADB_HOST` | `mariadb` |
| `DB_MARIADB_PORT` | `3306` |
| `DB_MARIADB_DATABASE` | `mueblesdaso_cob` |
| `DB_MARIADB_USER` | `mueblesdaso_cob` |
| `DB_MARIADB_PASSWORD` | `B4Dl6VlHDo` |

---

## ⚙️ Configuración de Red en Easypanel
1. **App Principal**: Apunta el dominio `app.mueblesdaso.com` al servicio `app` en el puerto `80`.
2. **WAHA**: No necesita exposición pública a menos que quieras usar Swagger desde fuera. Internamente es `http://waha:3000`.
3. **Persistencia**: Asegúrate de que `mariadb` tenga un volumen montado en `/var/lib/mysql` para no perder datos al reiniciar.
4. **SSL**: Activa "Let's Encrypt" en Easypanel para el dominio `app.mueblesdaso.com` para que la PWA funcione (requiere HTTPS).
