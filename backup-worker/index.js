require('dotenv').config();
const cron = require('node-cron');
const { runBackup } = require('./backupService');

console.log('🚀 Backup Worker Iniciado');
console.log('📅 Programación: Todos los días a las 3:00 AM');

// Programar tarea para las 3:00 AM
// '0 3 * * *' = Minuto 0, Hora 3, Cualquier día del mes, Cualquier mes, Cualquier día de la semana
cron.schedule('0 3 * * *', () => {
    console.log('⏰ Ejecutando tarea programada de backup...');
    runBackup();
});

// Ejecución inmediata opcional para verificar al inicio (si se pasa flag)
if (process.argv.includes('--run-now')) {
    console.log('⚡ Ejecución manual solicitada...');
    runBackup();
}
