# Dockerfile optimizado para Easypanel - Mueblesdaso ERP
# Versión: 2.2.1 (Build Support)

# Etapa 1: Construcción
FROM node:22-alpine as builder
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa 2: Servidor Estático (Node.js serve)
FROM node:22-alpine

# Instalar 'serve' globalmente para servir archivos estáticos
RUN npm install -g serve

# Copia de los archivos construidos (dist) desde la etapa de construcción
COPY --from=builder /app/dist /app/dist

# Establecer directorio de trabajo
WORKDIR /app

# Exposición del puerto 80
EXPOSE 80

# Ejecutar el servidor estático
# -s: Single Page Application (redirige 404 a index.html)
# -l 80: Escuchar en puerto 80
CMD ["serve", "-s", "dist", "-l", "80"]
