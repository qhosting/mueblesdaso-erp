-- INIT SCRIPT FOR POSTGRESQL - MUEBLESDASO ERP
-- Este script se ejecuta automáticamente al iniciar el contenedor por primera vez.

-- 1. Roles de Usuario
CREATE TABLE IF NOT EXISTS app_roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT
);

-- 2. Usuarios del Sistema
CREATE TABLE IF NOT EXISTS app_users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  rol_id INT,
  status VARCHAR(20) DEFAULT 'ACTIVO' CHECK (status IN ('ACTIVO', 'INACTIVO')),
  last_login TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES app_roles(id) ON DELETE SET NULL
);

-- 3. Transacciones
CREATE TABLE IF NOT EXISTS app_transactions (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('PAGO', 'VENTA', 'CANCELACION', 'ABONO')),
  cliente_id INT NOT NULL,
  monto DECIMAL(12,2) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id VARCHAR(50),
  folio_referencia VARCHAR(50),
  metodo_pago VARCHAR(20) DEFAULT 'EFECTIVO' CHECK (metodo_pago IN ('EFECTIVO', 'TRANSFERENCIA', 'BANCO', 'DEPOSITO')),
  notas TEXT,
  FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE SET NULL
);

-- 4. Inventario
CREATE TABLE IF NOT EXISTS app_inventory (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(50) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  current_stock INT DEFAULT 0,
  min_stock INT DEFAULT 5,
  location VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Logs de WhatsApp
CREATE TABLE IF NOT EXISTS app_whatsapp_logs (
  id SERIAL PRIMARY KEY,
  cliente_id INT NOT NULL,
  mensaje TEXT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'ENVIADO' CHECK (status IN ('ENVIADO', 'FALLIDO', 'LEIDO')),
  wa_message_id VARCHAR(100)
);

-- INSERCIÓN DE DATOS INICIALES

-- Roles
INSERT INTO app_roles (nombre, descripcion) VALUES 
('SUPER_ADMIN', 'Acceso total al sistema'),
('DIRECTOR', 'Reportes financieros y estratégicos'),
('JEFE_CREDITO', 'Gestión de rutas y auditoría'),
('COBRANZA', 'App de campo para cobros'),
('VENTAS', 'Registro de nuevos contratos')
ON CONFLICT (nombre) DO NOTHING;

-- Usuarios MOCK (Password: password123 por defecto para pruebas)
DO $$ 
BEGIN
    INSERT INTO app_users (id, username, password_hash, nombre, email, rol_id, status)
    VALUES 
    ('U01', 'admin', 'pbkdf2:sha256:250000$mockhash', 'Admin Master', 'admin@mueblesdaso.com', (SELECT id FROM app_roles WHERE nombre='SUPER_ADMIN'), 'ACTIVO'),
    ('U02', 'juan.cobranza', 'pbkdf2:sha256:250000$mockhash', 'Juan Pérez', 'juan.cobranza@mueblesdaso.com', (SELECT id FROM app_roles WHERE nombre='COBRANZA'), 'ACTIVO'),
    ('U03', 'elena.ventas', 'pbkdf2:sha256:250000$mockhash', 'Elena Ventas', 'elena.ventas@mueblesdaso.com', (SELECT id FROM app_roles WHERE nombre='VENTAS'), 'ACTIVO')
    ON CONFLICT (id) DO NOTHING;
END $$;

-- Inventario Inicial
INSERT INTO app_inventory (sku, nombre, current_stock, min_stock, location) VALUES
('COL-AM-MARQ', 'Colchón América Marquiz', 15, 5, 'Almacén Central'),
('SAL-MOD-EST', 'Sala Modular Estocolmo', 3, 5, 'Almacén Central'),
('TV-SAM-55', 'Samsung Smart TV 55"', 8, 3, 'Bodega Norte')
ON CONFLICT DO NOTHING;
