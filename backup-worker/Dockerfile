# Dockerfile para Servicio de Backup Worker
FROM node:22-alpine

# Instalar herramientas de cliente para bases de datos
# postgresql-client: para pg_dump
# mongodb-tools: para mongodump (en repositorios community de Alpine)
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories && \
    echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache postgresql-client mongodb-tools

WORKDIR /app

# Copiar definiciones de dependencias
COPY package.json ./

# Instalar dependencias de Node.js
RUN npm install

# Copiar el código fuente
COPY . .

# Comando de inicio
CMD ["npm", "start"]
