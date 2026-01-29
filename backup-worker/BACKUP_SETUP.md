# Configuración del Sistema de Backup Automático

Este directorio contiene un microservicio ("Worker") diseñado para ejecutarse independientemente y realizar copias de seguridad de sus bases de datos hacia Google Drive.

## 1. Prerrequisitos en Google Cloud Platform (GCP)

Para que el servicio pueda subir archivos a Google Drive, necesita una **Service Account**.

1.  Vaya a la [Google Cloud Console](https://console.cloud.google.com/).
2.  Cree un nuevo proyecto (o seleccione uno existente).
3.  Habilite la **Google Drive API** en "APIs & Services" > "Library".
4.  Vaya a "IAM & Admin" > "Service Accounts" y cree una nueva Service Account.
5.  Entre a la Service Account creada, vaya a la pestaña "Keys" y cree una nueva clave tipo **JSON**. Se descargará un archivo `.json`.
6.  **IMPORTANTE**: Abra el archivo JSON, copie el `client_email`. Vaya a la carpeta de Google Drive donde quiere guardar los backups y **Comparta** esa carpeta con ese email (dar permisos de Editor).
7.  Copie el contenido completo del archivo JSON para usarlo en la variable de entorno.

## 2. Variables de Entorno

Configure las siguientes variables en su entorno de despliegue (Easypanel, Docker, .env):

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `PG_URI` | Cadena de conexión a PostgreSQL | `postgres://user:pass@host:5432/db` |
| `MONGO_URI` | Cadena de conexión a MongoDB | `mongodb://user:pass@host:27017/db` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | El contenido del JSON de credenciales | `{"type": "service_account", ...}` |
| `GOOGLE_DRIVE_FOLDER_ID` | El ID de la carpeta en Drive | `1ABC_xD...` (parte final de la URL de la carpeta) |

## 3. Despliegue en Easypanel

Dado que este es un servicio de mantenimiento y no una aplicación web pública:

1.  Cree un nuevo servicio tipo **App** (o Worker si disponible).
2.  En la configuración de "Source", apunte a este repositorio.
3.  En "Build", especifique el Dockerfile: `backup-worker/Dockerfile`.
4.  Configure las variables de entorno mencionadas arriba.
5.  El servicio se iniciará y quedará en espera (daemon) ejecutando el Cron Job a las 3:00 AM.

## 4. Pruebas

Para probar manualmente que la configuración es correcta, puede modificar el comando de inicio en Docker o ejecutar localmente:

```bash
cd backup-worker
npm install
# Configure .env localmente
npm start -- --run-now
```
