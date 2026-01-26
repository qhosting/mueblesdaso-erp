# Dockerfile optimizado para Easypanel - Mueblesdaso ERP
# Versión: 2.2.0 (ESM Support)

FROM nginx:stable-alpine

# Metadatos para Easypanel
LABEL org.opencontainers.image.title="Mueblesdaso ERP"
LABEL org.opencontainers.image.description="ERP/CRM para venta minorista a crédito con soporte PWA y ESM nativo"
LABEL org.opencontainers.image.version="2.2.0"
LABEL org.opencontainers.image.vendor="Mueblesdaso"

# Limpieza y preparación del directorio raíz de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia de los archivos de la aplicación (Estructura no-build)
# Nota: Los archivos .tsx son servidos directamente y procesados por el navegador/servidor de desarrollo
COPY . /usr/share/nginx/html

# Aplicar configuración de Nginx (Crítica para tipos MIME y SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ajuste de permisos para máxima seguridad en el servidor
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Monitor de salud para Easypanel
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Exposición del puerto 80 para tráfico HTTP
EXPOSE 80

# Ejecutar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
