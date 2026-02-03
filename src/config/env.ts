export const ENV = {
  // En producción, usamos la ruta relativa '/api' gracias al Reverse Proxy de Nginx.
  // En desarrollo, intentamos leer la variable o usar localhost.
  API_URL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '/api'),

  // Configuración PostgreSQL (Easypanel)
  DB: {
    URL: import.meta.env.VITE_DATABASE_URL || '',
    HOST: import.meta.env.VITE_PGHOST || 'localhost',
    PORT: import.meta.env.VITE_PGPORT || '5432',
    USER: import.meta.env.VITE_PGUSER || 'postgres',
    PASS: import.meta.env.VITE_PGPASSWORD || 'postgres',
    NAME: import.meta.env.VITE_PGDATABASE || 'mueblesdaso_erp'
  },

  WAHA_URL: import.meta.env.VITE_WAHA_URL || 'http://localhost:3000/waha',
  WAHA_API_KEY: import.meta.env.VITE_WAHA_API_KEY || '',
  N8N_WEBHOOK_URL: import.meta.env.VITE_N8N_WEBHOOK_URL || '',
  IS_DEV: import.meta.env.DEV,
};


