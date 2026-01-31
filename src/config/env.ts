export const ENV = {
  // En producción, usamos la ruta relativa '/api' gracias al Reverse Proxy de Nginx.
  // En desarrollo, intentamos leer la variable o usar localhost.
  API_URL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '/api'),
  IS_DEV: import.meta.env.DEV,
};
