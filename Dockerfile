# Dockerfile para Mueblesdaso ERP - Producción (Optimizado para Easypanel)
# Este Dockerfile sirve el frontend directamente. 
# En una arquitectura monorepo real, este archivo viviría en /frontend/pwa.

FROM nginx:stable-alpine

# Metadatos del Proyecto
LABEL maintainer="Mueblesdaso Enterprise Solutions"
LABEL version="2.0.0"
LABEL description="ERP & CRM Frontend para Mueblesdaso"

# Limpiar archivos estáticos por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar todos los archivos del proyecto al directorio de servicio de Nginx
# Esto incluye index.html, index.tsx, manifest.json, sw.js y la carpeta components
COPY . /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
# Asegura el soporte para Single Page Application (SPA) y headers de PWA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ajustar permisos para mayor seguridad
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Healthcheck para que Easypanel monitoree el estado del contenedor
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Exponer el puerto 80 para tráfico HTTP (Estándar de Easypanel)
EXPOSE 80

# Ejecutar Nginx en modo foreground para que Docker pueda rastrear el proceso
CMD ["nginx", "-g", "daemon off;"]
