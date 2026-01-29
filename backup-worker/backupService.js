const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const archiver = require('archiver');
const { google } = require('googleapis');

// Configuración de entorno
const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}

/**
 * Ejecuta un comando de shell como promesa
 */
const execPromise = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing: ${command}`, stderr);
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
};

/**
 * Genera el dump de PostgreSQL
 */
const dumpPostgres = async (timestamp) => {
    console.log('⏳ Iniciando dump de PostgreSQL...');
    const outputFile = path.join(TEMP_DIR, `pg_dump_${timestamp}.sql`);

    // PG_URI formato: postgres://user:pass@host:port/db
    // pg_dump puede leer la variable de entorno DATABASE_URL si se configura,
    // pero aquí usaremos la cadena de conexión directamente si es segura,
    // o mejor, pasamos las credenciales via variables de entorno standard de PG.

    // Asumimos que las variables de entorno PGHOST, PGUSER, PGPASSWORD están seteadas
    // o parseamos la URI. Para robustez, usaremos la URI directamente.

    const cmd = `pg_dump "${process.env.PG_URI}" -f "${outputFile}"`;
    await execPromise(cmd);
    console.log('✅ PostgreSQL Dump completado.');
    return outputFile;
};

/**
 * Genera el dump de MongoDB
 */
const dumpMongo = async (timestamp) => {
    console.log('⏳ Iniciando dump de MongoDB...');
    const outputDir = path.join(TEMP_DIR, `mongo_dump_${timestamp}`);

    const cmd = `mongodump --uri="${process.env.MONGO_URI}" --out="${outputDir}"`;
    await execPromise(cmd);
    console.log('✅ MongoDB Dump completado.');
    return outputDir;
};

/**
 * Comprime archivos en un ZIP
 */
const createZip = async (filesToZip, timestamp) => {
    console.log('⏳ Comprimiendo archivos...');
    const zipName = `backup-${timestamp}.zip`;
    const zipPath = path.join(TEMP_DIR, zipName);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
        output.on('close', () => {
            console.log(`✅ Archivo ZIP creado: ${zipName} (${archive.pointer()} bytes)`);
            resolve({ zipPath, zipName });
        });

        archive.on('error', (err) => reject(err));
        archive.pipe(output);

        filesToZip.forEach(file => {
            if (fs.lstatSync(file).isDirectory()) {
                archive.directory(file, path.basename(file));
            } else {
                archive.file(file, { name: path.basename(file) });
            }
        });

        archive.finalize();
    });
};

/**
 * Sube el archivo a Google Drive
 */
const uploadToDrive = async (filePath, fileName) => {
    console.log('⏳ Subiendo a Google Drive...');

    // Autenticación
    let auth;
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        // Opción A: JSON String en variable de entorno
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
        auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        // Opción B: Path al archivo
        auth = new google.auth.GoogleAuth({
            keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });
    } else {
        throw new Error('No Google Cloud credentials provided');
    }

    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
        name: fileName,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
    };

    const media = {
        mimeType: 'application/zip',
        body: fs.createReadStream(filePath)
    };

    const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    });

    console.log('✅ Backup subido exitosamente. File ID:', response.data.id);
    return response.data.id;
};

/**
 * Limpieza de archivos temporales
 */
const cleanup = async (files) => {
    console.log('🧹 Limpiando archivos temporales...');
    for (const file of files) {
        if (fs.existsSync(file)) {
            fs.rmSync(file, { recursive: true, force: true });
        }
    }
};

/**
 * Función principal del servicio
 */
const runBackup = async () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const generatedFiles = [];

    try {
        // 1. Dumps
        const pgFile = await dumpPostgres(timestamp);
        generatedFiles.push(pgFile);

        const mongoFile = await dumpMongo(timestamp);
        generatedFiles.push(mongoFile);

        // 2. Compresión
        const { zipPath, zipName } = await createZip(generatedFiles, timestamp);
        generatedFiles.push(zipPath);

        // 3. Upload
        await uploadToDrive(zipPath, zipName);

    } catch (error) {
        console.error('❌ Error crítico durante el backup:', error);
    } finally {
        // 4. Limpieza
        await cleanup(generatedFiles);
    }
};

module.exports = { runBackup };
