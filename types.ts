
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DIRECTOR = 'DIRECTOR',
  JEFE_CREDITO = 'JEFE_CREDITO',
  TESORERIA = 'TESORERIA',
  COBRANZA = 'COBRANZA',
  VENTAS = 'VENTAS',
  ANALISTA = 'ANALISTA'
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  ultimo_acceso?: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface Client {
  id_cliente: number;
  contrato_cliente: string;
  cod_cliente: string;
  nombre_ccliente: string;
  cod_vendedor: string;
  codigo_gestor: string;
  status_cliente: string;
  periodicidad_cliente: 'SEMANAL' | 'QUINCENAL' | 'MENSUAL';
  pagos_cliente: number;
  dia_cobro: string;
  saldo_actualcli: number;
  semv: number;
  semdv: number;
  tel1_cliente: string;
  tel2_cliente?: string;
  calle_dom: string;
  exterior_dom: string;
  colonia_dom: string;
  municipio_dom: string;
  estado_dom: string;
  cp_dom: string;
  lat_dom?: string;
  long_dom?: string;
  pagar: number;
  bancos: string;
  producto?: string;
  fcontrato?: string;
}

export interface Collector {
  id_gestor: string;
  nombre_gestor: string;
  telefono_gestor: string;
  zona_asignada: string;
}

export interface Payment {
  idpag: number;
  fechap: string;
  fechahora: string;
  cod_cliente: string;
  montop: number;
  codigo_gestor: string;
}

export interface Product {
  id: string;
  sku: string;
  nombre: string;
  categoria: string;
  precio_contado: number;
  precio_credito: number;
  imagen?: string;
}

export interface InventoryItem {
  id: string;
  producto_id: string;
  nombre: string;
  stock_actual: number;
  stock_minimo: number;
  ubicacion: string;
}

export interface WhatsAppLog {
  id: string;
  cliente_id: string;
  mensaje: string;
  fecha: string;
  status: 'ENVIADO' | 'FALLIDO' | 'LEIDO';
}

export interface AgingRow {
  codigo: string;
  nombre: string;
  totalVencido: number;
  vencido0_30: number;
  vencido31_60: number;
  vencido61_90: number;
  vencido91_mas: number;
  totalPorVencer: number;
  vencer0_30: number;
  vencer31_60: number;
  vencer61_90: number;
  vencer91_mas: number;
  totalGeneral: number;
}
