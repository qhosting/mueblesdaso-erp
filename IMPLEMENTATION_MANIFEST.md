# 📌 Manifiesto de Despliegue - Mueblesdaso ERP

Copia y pega estas variables en la sección **Environment Variables** de cada servicio en Easypanel.

## 1. Servicio: `mariadb` (Base de Datos)
| Key | Value |
| :--- | :--- |
| `MYSQL_ROOT_PASSWORD` | `mueblesdaso_root_2024` |
| `MYSQL_DATABASE` | `mueblesdaso_cob` |
| `MYSQL_USER` | `mueblesdaso_cob` |
| `MYSQL_PASSWORD` | `B4Dl6VlHDo` |

---

## 2. Servicio: `app` (Frontend / PWA / API)
*Nota: El DB_HOST debe ser el nombre exacto que le pusiste al servicio de MariaDB.*

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
| Key | Value |
| :--- | :--- |
| `WHATSAPP_DEFAULT_SESSION` | `default` |
| `WAHA_DEBUG` | `false` |

---

## 4. Servicio: `n8n` (Automatización)
| Key | Value |
| :--- | :--- |
| `N8N_ENCRYPTION_KEY` | `mueblesdaso_n8n_secure_key_123` |
| `N8N_USER_MANAGEMENT_JWT_SECRET` | `secret_jwt_muebles_8899` |
| `DB_TYPE` | `mariadb` |
| `DB_MARIADB_HOST` | `mariadb` |
| `DB_MARIADB_PORT` | `3306` |
| `DB_MARIADB_DATABASE` | `mueblesdaso_cob` |
| `DB_MARIADB_USER` | `mueblesdaso_cob` |
| `DB_MARIADB_PASSWORD` | `B4Dl6VlHDo` |

---

## 🚀 Guía de Conexión en Easypanel
1. **Redes Internas**: Easypanel crea una red interna automáticamente. Por eso usamos `http://waha:3000` y el host `mariadb`. Si cambias los nombres de los servicios en el panel, actualiza las variables correspondientes.
2. **Puertos**: 
   - La `App` (Nginx) debe estar en el puerto `80`.
   - `WAHA` internamente corre en el `3000`.
   - `n8n` internamente corre en el `5678`.
3. **PWA**: Una vez desplegada la App, verás el icono de "Instalar" en la barra de direcciones de Chrome.
