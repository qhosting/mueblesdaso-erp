
# 📌 Manifiesto de Implementación - Mueblesdaso ERP & CRM

## 🟢 ESTADO ACTUAL: LISTO PARA DESPLIEGUE (100%)

## 1. 🏗️ Infraestructura (Producción)
- [x] **Docker Compose Maestro:** Integrado para MariaDB y WAHA.
- [x] **Dockerfile (Nginx Stage):** Listo para servir la PWA.
- [x] **Configuración Nginx (SPA/PWA):** Manejo de rutas y Service Workers.
- [x] **Esquema MariaDB:** Estructura completa incluyendo auditoría de WhatsApp.

## 2. 🔑 Variables de Entorno (Easypanel)

### Para el Servicio "App" (Frontend/API)
| Variable | Valor Requerido |
| :--- | :--- |
| `DB_HOST` | El nombre de tu servicio MariaDB en Easypanel |
| `DB_USER` | `mueblesdaso_cob` |
| `DB_PASSWORD` | `B4Dl6VlHDo` |
| `DB_NAME` | `mueblesdaso_cob` |
| `WAHA_URL` | URL interna de WAHA (ej: `http://waha-service:3000`) |

### Para el Servicio "MariaDB"
| Variable | Valor Requerido |
| :--- | :--- |
| `MYSQL_ROOT_PASSWORD` | Contraseña fuerte de root |
| `MYSQL_DATABASE` | `mueblesdaso_cob` |
| `MYSQL_USER` | `mueblesdaso_cob` |
| `MYSQL_PASSWORD` | `B4Dl6VlHDo` |

## 3. 🚀 Pasos para el Despliegue en Easypanel
1. **Crear Proyecto:** Crea un nuevo proyecto llamado `Mueblesdaso-ERP`.
2. **Servicio MariaDB:** Añade MariaDB desde la "App Store" de Easypanel. Configura las variables anteriores.
3. **Servicio WAHA:** Añade un servicio de imagen Docker con `devlikeapro/waha`.
4. **Servicio App:** Vincula tu repositorio de GitHub. Easypanel detectará automáticamente el `Dockerfile`.
5. **Red Interna:** Asegúrate de que los nombres de servicio coincidan con las variables `DB_HOST` y `WAHA_URL`.

## 4. 📱 App de Campo (PWA)
- Una vez desplegado, accede desde Chrome/Safari en el móvil y selecciona **"Agregar a la pantalla de inicio"** para activar la funcionalidad PWA.
- El `nginx.conf` ya está configurado para que la app funcione sin conexión (Offline-Ready).

## 5. 🛠️ Post-Producción
- Ejecuta el script SQL de `constants.ts` en la consola de MariaDB del servicio.
- Escanea el código QR en la interfaz de WAHA para conectar el número de WhatsApp de cobranza.
