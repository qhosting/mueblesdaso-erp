
import { Client, Payment, Collector, Product, InventoryItem, User, UserRole } from './types';

export const DB_CONFIG = {
  host: '192.250.227.167',
  user: 'mueblesdaso_cob',
  pass: 'B4Dl6VlHDo',
  db_name: 'mueblesdaso_cob'
};

export const MOCK_USERS: User[] = [
  { id: 'U01', nombre: 'Admin Master', email: 'admin@mueblesdaso.com', rol: UserRole.SUPER_ADMIN, estado: 'ACTIVO' },
  { id: 'U02', nombre: 'Juan Pérez', email: 'juan.cobranza@mueblesdaso.com', rol: UserRole.COBRANZA, estado: 'ACTIVO' },
  { id: 'U03', nombre: 'Elena Ventas', email: 'elena.ventas@mueblesdaso.com', rol: UserRole.VENTAS, estado: 'ACTIVO' }
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'P01', sku: 'COL-AM-MARQ', nombre: 'Colchón América Marquiz', categoria: 'Recámara', precio_contado: 8500, precio_credito: 10500 },
  { id: 'P02', sku: 'SAL-MOD-EST', nombre: 'Sala Modular Estocolmo', categoria: 'Estancia', precio_contado: 12000, precio_credito: 15500 },
  { id: 'P03', sku: 'TV-SAM-55', nombre: 'Samsung Smart TV 55"', categoria: 'Electrónica', precio_contado: 9500, precio_credito: 11800 }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'I01', producto_id: 'P01', nombre: 'Colchón América Marquiz', stock_actual: 15, stock_minimo: 5, ubicacion: 'Almacén Central' },
  { id: 'I02', producto_id: 'P02', nombre: 'Sala Modular Estocolmo', stock_actual: 3, stock_minimo: 5, ubicacion: 'Almacén Central' },
  { id: 'I03', producto_id: 'P03', nombre: 'Samsung Smart TV 55"', stock_actual: 8, stock_minimo: 3, ubicacion: 'Bodega Norte' }
];

export const MOCK_COLLECTORS: Collector[] = [
  {
    id_gestor: 'GEST_01',
    nombre_gestor: 'Juan Pérez García',
    telefono_gestor: '4421112233',
    zona_asignada: 'Corregidora Centro'
  },
  {
    id_gestor: 'GEST_02',
    nombre_gestor: 'María López Hernández',
    telefono_gestor: '4423334455',
    zona_asignada: 'El Marqués Norte'
  },
  {
    id_gestor: 'GEST_03',
    nombre_gestor: 'Roberto Jiménez Ruiz',
    telefono_gestor: '4425556677',
    zona_asignada: 'Querétaro Poniente'
  }
];

export const MOCK_CLIENTS: Client[] = [
  {
    id_cliente: 1,
    contrato_cliente: '33802',
    cod_cliente: 'DQ2207185',
    nombre_ccliente: 'FERNANDO RIVERA RAMIREZ',
    cod_vendedor: 'GUTIERREZ VALDEZ JOSUE',
    codigo_gestor: 'GEST_01',
    status_cliente: 'COBRANZA NORMAL',
    periodicidad_cliente: 'QUINCENAL',
    pagos_cliente: 1071,
    dia_cobro: 'SABADO',
    saldo_actualcli: 4322.00,
    semv: 0,
    semdv: 0,
    tel1_cliente: '4426056846',
    calle_dom: 'EL JARAL',
    exterior_dom: 'SN',
    colonia_dom: 'EL JARAL',
    municipio_dom: 'Corregidora',
    estado_dom: 'Querétaro',
    cp_dom: '76926',
    lat_dom: '20.5350',
    long_dom: '-100.4450',
    pagar: 1,
    bancos: 'NOCONCILIADO',
    producto: 'COLCHON AMERICA MARQUIZ',
    fcontrato: '15/07/2022'
  },
  {
    id_cliente: 2,
    contrato_cliente: '34697',
    cod_cliente: 'DQ2209197',
    nombre_ccliente: 'VICTORIA RAMOS MONTOYA',
    cod_vendedor: 'GALVAN JIMENEZ LUIS ENRIQUE',
    codigo_gestor: 'GEST_02',
    status_cliente: 'COBRANZA NORMAL',
    periodicidad_cliente: 'MENSUAL',
    pagos_cliente: 1320,
    dia_cobro: 'SABADO',
    saldo_actualcli: 22381.01,
    semv: 12,
    semdv: 1160.00,
    tel1_cliente: '4425554623',
    calle_dom: 'SIERRA DE LAS CRUCES',
    exterior_dom: '5',
    colonia_dom: 'HDA LA CRUZ',
    municipio_dom: 'El Marqués',
    estado_dom: 'Querétaro',
    cp_dom: '76240',
    pagar: 0,
    bancos: 'NULL',
    producto: 'COLCHON MAT LESTER PRINCESS',
    fcontrato: '26/09/2022'
  }
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    idpag: 1,
    fechap: '2024-03-15',
    fechahora: '2024-03-15 14:30:00',
    cod_cliente: 'DQ2207185',
    montop: 1071.00,
    codigo_gestor: 'GEST_01'
  }
];

export const DOCKER_COMPOSE_MAESTRO = `version: '3.8'
services:
  mueblesdaso-mariadb:
    image: mariadb:10.6
    environment:
      - MYSQL_ROOT_PASSWORD=secret
      - MYSQL_DATABASE=mueblesdaso_cob
      - MYSQL_USER=mueblesdaso_cob
      - MYSQL_PASSWORD=B4Dl6VlHDo
    volumes:
      - db_data:/var/lib/mysql
    restart: always

  waha:
    image: devlikeapro/waha
    ports:
      - "3001:3000"
    restart: always

volumes:
  db_data:`;

export const SQL_SCHEMA = `-- ESQUEMA MAESTRO MUEBLESDASO ERP

-- 1. Roles y Permisos
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT
);

-- 2. Usuarios del Sistema
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  rol_id INT,
  status ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
  last_login DATETIME,
  FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- 3. Tabla Legacy Integrada
CREATE TABLE cat_clientes (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  contrato_cliente VARCHAR(20) UNIQUE,
  cod_cliente VARCHAR(20) UNIQUE,
  nombre_ccliente VARCHAR(255),
  cod_vendedor VARCHAR(50),
  codigo_gestor VARCHAR(20),
  status_cliente VARCHAR(50),
  periodicidad_cliente ENUM('SEMANAL', 'QUINCENAL', 'MENSUAL'),
  pagos_cliente DECIMAL(10,2),
  dia_cobro VARCHAR(20),
  saldo_actualcli DECIMAL(10,2),
  semv INT DEFAULT 0,
  semdv DECIMAL(10,2) DEFAULT 0,
  tel1_cliente VARCHAR(20),
  calle_dom VARCHAR(255),
  exterior_dom VARCHAR(20),
  colonia_dom VARCHAR(255),
  municipio_dom VARCHAR(100),
  lat_dom DECIMAL(10,8),
  long_dom DECIMAL(11,8),
  fcontrato DATE,
  producto_principal VARCHAR(255)
);

-- 4. Transacciones Financieras (Pagos y Ventas)
CREATE TABLE transacciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('PAGO', 'VENTA', 'CANCELACION') NOT NULL,
  cliente_id INT,
  monto DECIMAL(10,2) NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  gestor_id VARCHAR(50),
  folio_recibo VARCHAR(50),
  metodo_pago VARCHAR(50), -- EFECTIVO, TRANSFERENCIA, BANCO
  FOREIGN KEY (cliente_id) REFERENCES cat_clientes(id_cliente)
);

-- 5. Catálogo de Productos e Inventario
CREATE TABLE productos (
  id VARCHAR(50) PRIMARY KEY,
  sku VARCHAR(50) UNIQUE,
  nombre VARCHAR(255),
  categoria VARCHAR(100),
  precio_contado DECIMAL(10,2),
  precio_credito DECIMAL(10,2)
);

CREATE TABLE inventario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id VARCHAR(50),
  stock_actual INT DEFAULT 0,
  stock_minimo INT DEFAULT 5,
  ubicacion VARCHAR(100),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- 6. Bitácora de Gestión (Cobranza en Campo)
CREATE TABLE bitacora_gestiones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT,
  autor_id VARCHAR(50),
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  texto TEXT,
  tipo_gestion ENUM('VISITA', 'LLAMADA', 'WHATSAPP', 'SISTEMA'),
  FOREIGN KEY (cliente_id) REFERENCES cat_clientes(id_cliente),
  FOREIGN KEY (autor_id) REFERENCES users(id)
);

-- 7. Compromisos de Pago (Para n8n y WAHA)
CREATE TABLE compromisos_pago (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT,
  fecha_promesa DATE NOT NULL,
  monto_promesa DECIMAL(10,2),
  status ENUM('PENDIENTE', 'CUMPLIDO', 'INCUMPLIDO') DEFAULT 'PENDIENTE',
  FOREIGN KEY (cliente_id) REFERENCES cat_clientes(id_cliente)
);

-- 8. Auditoría WhatsApp (WAHA)
CREATE TABLE logs_whatsapp (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT,
  mensaje TEXT,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('ENVIADO', 'FALLIDO', 'LEIDO'),
  FOREIGN KEY (cliente_id) REFERENCES cat_clientes(id_cliente)
);`;
