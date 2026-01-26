
import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Filter, Info, MapPin, Phone, Calendar, CreditCard, X, 
  ChevronRight, History, ReceiptText, UserCircle, Map as MapIcon, ExternalLink,
  Briefcase, BarChart3, ArrowDownToLine, AlertCircle, Table as TableIcon, TrendingUp,
  BrainCircuit, FileSpreadsheet, MessageSquare, Clock, Package, Calculator,
  Send, Save, Trash2, CheckSquare, ShieldCheck, ArrowLeft, TrendingDown, Target
} from 'lucide-react';
import { MOCK_CLIENTS, MOCK_PAYMENTS, MOCK_COLLECTORS } from '../constants';
import { Client, Collector, AgingRow, Payment } from '../types';

interface Note {
  id: string;
  fecha: string;
  autor: string;
  texto: string;
  tipo: 'VISITA' | 'LLAMADA' | 'WHATSAPP' | 'SISTEMA';
}

const ClientsModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterGestor, setFilterGestor] = useState('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'collectors' | 'aging' | 'forecast'>('list');
  
  const [isManaging, setIsManaging] = useState(false);
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', fecha: '2024-03-28 10:00', autor: 'SISTEMA', texto: 'Aviso automático de mora enviado vía WhatsApp.', tipo: 'SISTEMA' },
    { id: '2', fecha: '2024-03-29 14:20', autor: 'Juan Pérez', texto: 'Se visitó domicilio. No se encontró al cliente, se dejó notificación.', tipo: 'VISITA' }
  ]);
  const [newNote, setNewNote] = useState('');
  const [promiseDate, setPromiseDate] = useState('');
  const [promiseAmount, setPromiseAmount] = useState('');

  const TODAY = new Date('2024-04-01');

  const filteredClients = useMemo(() => {
    return MOCK_CLIENTS.filter(client => {
      const matchesSearch = client.nombre_ccliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           client.contrato_cliente.includes(searchTerm);
      const matchesStatus = filterStatus === 'ALL' || client.status_cliente === filterStatus;
      const matchesGestor = filterGestor === 'ALL' || client.codigo_gestor === filterGestor;
      return matchesSearch && matchesStatus && matchesGestor;
    });
  }, [searchTerm, filterStatus, filterGestor]);

  const collectorSummaries = useMemo(() => {
    return MOCK_COLLECTORS.map(collector => {
      const assigned = MOCK_CLIENTS.filter(c => c.codigo_gestor === collector.id_gestor);
      const totalBalance = assigned.reduce((sum, c) => sum + c.saldo_actualcli, 0);
      const overdueBalance = assigned.reduce((sum, c) => sum + c.semdv, 0);
      
      return {
        ...collector,
        totalClients: assigned.length,
        totalBalance,
        overdueBalance,
        riskPercentage: totalBalance > 0 ? (overdueBalance / totalBalance) * 100 : 0
      };
    }).sort((a, b) => b.overdueBalance - a.overdueBalance);
  }, []);

  const agingData = useMemo(() => {
    return MOCK_CLIENTS.map(client => {
      const clientPayments = MOCK_PAYMENTS.filter(p => p.cod_cliente === client.cod_cliente);
      const lastPaymentDate = clientPayments.length > 0 
        ? new Date(clientPayments[0].fechap) 
        : new Date(client.fcontrato || '2023-01-01');

      const diffTime = Math.abs(TODAY.getTime() - lastPaymentDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let vencido0_30 = 0, vencido31_60 = 0, vencido61_90 = 0, vencido91_mas = 0;

      if (client.semdv > 0) {
        if (diffDays <= 30) vencido0_30 = client.semdv;
        else if (diffDays <= 60) vencido31_60 = client.semdv;
        else if (diffDays <= 90) vencido61_90 = client.semdv;
        else vencido91_mas = client.semdv;
      }

      const totalPorVencer = client.saldo_actualcli - client.semdv;
      
      return {
        codigo: client.cod_cliente,
        nombre: client.nombre_ccliente,
        totalVencido: client.semdv,
        vencido0_30,
        vencido31_60,
        vencido61_90,
        vencido91_mas,
        totalPorVencer: totalPorVencer,
        vencer0_30: totalPorVencer * 0.4,
        vencer31_60: totalPorVencer * 0.3,
        vencer61_90: totalPorVencer * 0.2,
        vencer91_mas: totalPorVencer * 0.1,
        totalGeneral: client.saldo_actualcli
      } as AgingRow;
    });
  }, [TODAY]);

  const getNombreGestor = (codigo: string) => {
    const gestor = MOCK_COLLECTORS.find(g => g.id_gestor === codigo);
    return gestor ? gestor.nombre_gestor : codigo;
  };

  const hasCoords = selectedClient?.lat_dom && selectedClient?.long_dom;
  const mapUrl = hasCoords 
    ? `https://maps.google.com/maps?q=${selectedClient?.lat_dom},${selectedClient?.long_dom}&z=15&output=embed`
    : null;

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note: Note = {
      id: Date.now().toString(),
      fecha: new Date().toLocaleString(),
      autor: 'Admin Master',
      texto: newNote,
      tipo: 'VISITA'
    };
    setNotes([note, ...notes]);
    setNewNote('');
  };

  const closeModal = () => {
    setSelectedClient(null);
    setIsManaging(false);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6 bg-slate-50">
      {/* Header y Selector de Pestañas */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Users className="text-white w-5 h-5" />
            </div>
            Gestión de Cartera
          </h1>
          <p className="text-slate-500 text-sm font-medium">Administración, auditoría de gestores y análisis de vencimientos</p>
          
          <div className="flex bg-slate-200 p-1 rounded-xl mt-4 w-fit shadow-inner">
            {[
              { id: 'list', label: 'Lista Clientes', icon: <Users size={14} /> },
              { id: 'collectors', label: 'Gestores', icon: <Target size={14} /> },
              { id: 'aging', label: 'Antigüedad (Aging)', icon: <Clock size={14} /> },
              { id: 'forecast', label: 'Pronóstico', icon: <TrendingUp size={14} /> }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setViewMode(tab.id as any)}
                className={`px-5 py-2 rounded-lg text-[10px] font-black transition-all flex items-center gap-2 uppercase tracking-widest ${viewMode === tab.id ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {viewMode === 'list' && (
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text"
                placeholder="Buscar cliente..."
                className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 text-sm font-medium shadow-sm bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* ÁREA DE CONTENIDO DINÁMICO SEGÚN PESTAÑA */}
      <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl flex flex-col relative">
        
        {/* VISTA: LISTA DE CLIENTES */}
        {viewMode === 'list' && (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-10">
                <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 tracking-[0.1em]">
                  <th className="px-8 py-5">Contrato / ID</th>
                  <th className="px-8 py-5">Nombre cliente</th>
                  <th className="px-8 py-5">Gestor Asignado</th>
                  <th className="px-8 py-5 text-right">Saldo Actual</th>
                  <th className="px-8 py-5 text-right">Mora</th>
                  <th className="px-8 py-5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredClients.map((client) => (
                  <tr key={client.id_cliente} className="hover:bg-blue-50/50 transition-all group">
                    <td className="px-8 py-5">
                      <p className="font-mono text-sm text-blue-600 font-bold">#{client.contrato_cliente}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{client.cod_cliente}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-black text-slate-800 text-sm uppercase">{client.nombre_ccliente}</p>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${client.status_cliente === 'COBRANZA NORMAL' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {client.status_cliente}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-600 text-xs">{getNombreGestor(client.codigo_gestor)}</td>
                    <td className="px-8 py-5 font-black text-slate-700 text-sm text-right">${client.saldo_actualcli.toLocaleString()}</td>
                    <td className="px-8 py-5 text-right font-black text-red-600 text-sm">${client.semdv.toLocaleString()}</td>
                    <td className="px-8 py-5 text-center">
                      <button 
                        onClick={() => setSelectedClient(client)}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase transition-all shadow-sm"
                      >
                        Auditar Cliente
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VISTA: GESTORES (Collectors) */}
        {viewMode === 'collectors' && (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
            {collectorSummaries.map((gestor) => (
              <div key={gestor.id_gestor} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Target size={120} /></div>
                
                <header className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{gestor.id_gestor}</p>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{gestor.nombre_gestor}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1"><MapPin size={12} /> {gestor.zona_asignada}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${gestor.riskPercentage > 20 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    Riesgo {Math.round(gestor.riskPercentage)}%
                  </div>
                </header>

                <div className="space-y-4">
                   <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <span className="text-[10px] font-black text-slate-400 uppercase">Cartera Total</span>
                     <span className="font-black text-slate-800">${gestor.totalBalance.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center bg-red-50 p-4 rounded-2xl border border-red-100">
                     <span className="text-[10px] font-black text-red-400 uppercase">Mora Acumulada</span>
                     <span className="font-black text-red-600">${gestor.overdueBalance.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center pt-2">
                     <span className="text-[10px] font-black text-slate-400 uppercase">Clientes Asignados</span>
                     <span className="font-black text-slate-800">{gestor.totalClients}</span>
                   </div>
                </div>

                <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                  Ver Ruta Detallada <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* VISTA: ANTIGÜEDAD (Aging) */}
        {viewMode === 'aging' && (
          <div className="overflow-x-auto flex-1">
             <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-900 text-white text-[10px] font-black uppercase text-center border-b border-slate-800">
                  <th colSpan={2} className="px-6 py-4 border-r border-white/10 text-left">Cliente</th>
                  <th className="px-6 py-4 border-r border-white/10">Suma Importe</th>
                  <th className="px-6 py-4 border-r border-white/10 bg-red-600">0-30 Días</th>
                  <th className="px-6 py-4 border-r border-white/10 bg-red-700">31-60 Días</th>
                  <th className="px-6 py-4 border-r border-white/10 bg-red-800">61-90 Días</th>
                  <th className="px-6 py-4 border-r border-white/10 bg-red-900">91+ Días</th>
                  <th className="px-6 py-4 bg-blue-600">Saldo Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {agingData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-3 border-r border-slate-100 font-bold text-blue-600">{row.codigo}</td>
                    <td className="px-6 py-3 border-r border-slate-100 font-sans font-bold text-slate-800 uppercase text-xs">{row.nombre}</td>
                    <td className="px-6 py-3 border-r border-slate-100 text-right font-black text-slate-600">${row.totalVencido.toLocaleString()}</td>
                    <td className={`px-6 py-3 border-r border-slate-100 text-right ${row.vencido0_30 > 0 ? 'text-orange-600 font-bold' : 'text-slate-300'}`}>${row.vencido0_30.toLocaleString()}</td>
                    <td className={`px-6 py-3 border-r border-slate-100 text-right ${row.vencido31_60 > 0 ? 'text-red-500 font-bold' : 'text-slate-300'}`}>${row.vencido31_60.toLocaleString()}</td>
                    <td className={`px-6 py-3 border-r border-slate-100 text-right ${row.vencido61_90 > 0 ? 'text-red-700 font-black' : 'text-slate-300'}`}>${row.vencido61_90.toLocaleString()}</td>
                    <td className={`px-6 py-3 border-r border-slate-100 text-right ${row.vencido91_mas > 0 ? 'bg-red-50 text-red-900 font-black' : 'text-slate-300'}`}>${row.vencido91_mas.toLocaleString()}</td>
                    <td className="px-6 py-3 text-right font-black bg-slate-50">${row.totalGeneral.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VISTA: PRONÓSTICO (Forecast) */}
        {viewMode === 'forecast' && (
          <div className="overflow-x-auto flex-1">
             <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-900 text-white text-[10px] font-black uppercase text-center border-b border-slate-800">
                  <th colSpan={2} className="px-6 py-4 border-r border-white/10 text-left">Cliente</th>
                  <th className="px-6 py-4 border-r border-white/10">Por Vencer</th>
                  <th className="px-6 py-4 border-r border-white/10 bg-green-600">Semana 1</th>
                  <th className="px-6 py-4 border-r border-white/10 bg-green-700">Semana 2</th>
                  <th className="px-6 py-4 border-r border-white/10 bg-green-800">Semana 3</th>
                  <th className="px-6 py-4 border-r border-white/10 bg-green-900">Semana 4+</th>
                  <th className="px-6 py-4 bg-blue-600">Saldo Cartera</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {agingData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-3 border-r border-slate-100 font-bold text-blue-600">{row.codigo}</td>
                    <td className="px-6 py-3 border-r border-slate-100 font-sans font-bold text-slate-800 uppercase text-xs">{row.nombre}</td>
                    <td className="px-6 py-3 border-r border-slate-100 text-right font-black text-slate-600">${row.totalPorVencer.toLocaleString()}</td>
                    <td className="px-6 py-3 border-r border-slate-100 text-right text-green-600 font-bold">${row.vencer0_30.toLocaleString()}</td>
                    <td className="px-6 py-3 border-r border-slate-100 text-right text-green-700 font-bold">${row.vencer31_60.toLocaleString()}</td>
                    <td className="px-6 py-3 border-r border-slate-100 text-right text-green-800 font-bold">${row.vencer61_90.toLocaleString()}</td>
                    <td className="px-6 py-3 border-r border-slate-100 text-right text-green-900 font-bold">${row.vencer91_mas.toLocaleString()}</td>
                    <td className="px-6 py-3 text-right font-black bg-slate-50">${row.totalGeneral.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DETALLES Y GESTIÓN (Implementado anteriormente) */}
      {selectedClient && (
        <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-0 lg:p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full h-full lg:h-[90vh] lg:max-w-7xl lg:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header Modal */}
            <div className="bg-slate-900 text-white p-6 lg:px-12 lg:py-6 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-xl font-black">{selectedClient.nombre_ccliente.charAt(0)}</div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-black uppercase tracking-tight">{selectedClient.nombre_ccliente}</h2>
                  <p className="text-blue-400 font-black text-[10px] uppercase tracking-widest">Expediente #{selectedClient.contrato_cliente} • {selectedClient.cod_cliente}</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 bg-white/5 hover:bg-red-600 rounded-full transition-colors"><X size={20} /></button>
            </div>

            {/* Layout Dual */}
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-slate-50/50">
              
              {/* Columna Izquierda: Información Financiera */}
              <div className="w-full lg:w-1/3 p-6 border-r border-slate-200 overflow-y-auto space-y-6 bg-white shrink-0 scrollbar-thin">
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CreditCard size={14} className="text-blue-600" /> Resumen de Cuenta
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Saldo Actual</p>
                      <p className="text-lg font-black text-slate-800">${selectedClient.saldo_actualcli.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Monto Cuota</p>
                      <p className="text-lg font-black text-blue-600">${selectedClient.pagos_cliente.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-red-600 text-white p-5 rounded-3xl shadow-lg shadow-red-200">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Saldo Vencido (Mora)</p>
                    <p className="text-3xl font-black mt-1">${selectedClient.semdv.toLocaleString()}</p>
                    <div className="mt-3 flex items-center gap-2 text-[10px] font-black bg-white/20 p-2 rounded-xl">
                      <Clock size={12} /> {selectedClient.semv} Semanas de atraso
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MapPin size={14} className="text-blue-600" /> Localización
                  </h3>
                  <div className="bg-slate-100 rounded-2xl h-24 mb-4 overflow-hidden relative group">
                    {mapUrl ? (
                      <iframe title="mapa" src={mapUrl} className="w-full h-full border-0 grayscale group-hover:grayscale-0 transition-all duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px] font-black uppercase">Sin Coordenadas</div>
                    )}
                  </div>
                  <div className="text-[11px] space-y-1">
                    <p className="font-black text-slate-800 uppercase leading-snug">{selectedClient.calle_dom} #{selectedClient.exterior_dom}</p>
                    <p className="font-medium text-slate-500">{selectedClient.colonia_dom}, {selectedClient.municipio_dom}</p>
                  </div>
                </section>

                <button 
                  onClick={() => setIsManaging(!isManaging)}
                  className={`w-full py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${
                    isManaging ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isManaging ? <ArrowLeft size={16} /> : <Briefcase size={16} />}
                  {isManaging ? 'Volver a Detalles' : 'Gestionar Cobranza'}
                </button>
              </div>

              {/* Columna Derecha Dinámica: Información Estándar o Centro de Comando */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                {!isManaging ? (
                  <div className="p-8 lg:p-10 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group min-h-[200px]">
                          <Package className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform" size={160} />
                          <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-6">Detalles del Contrato</h4>
                          <p className="text-2xl font-black uppercase leading-tight">{selectedClient.producto || 'Línea Blanca / Mueble'}</p>
                          <div className="mt-8 flex gap-3">
                             <div className="bg-white/10 px-3 py-2 rounded-xl text-[9px] font-bold border border-white/10 flex items-center gap-2">
                               <Calendar size={12} /> {selectedClient.fcontrato}
                             </div>
                             <div className="bg-white/10 px-3 py-2 rounded-xl text-[9px] font-bold border border-white/10 flex items-center gap-2">
                               <UserCircle size={12} /> {selectedClient.cod_vendedor}
                             </div>
                          </div>
                       </div>

                       <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-between">
                             <span>Últimos Abonos</span>
                             <button className="text-blue-600 hover:underline">Auditar</button>
                          </h4>
                          <div className="space-y-3">
                            {MOCK_PAYMENTS.filter(p => p.cod_cliente === selectedClient.cod_cliente).map((p, idx) => (
                              <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><CheckSquare size={14} /></div>
                                  <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase">{p.fechap}</p>
                                    <p className="text-[10px] font-black text-slate-800 uppercase">Validado en Caja</p>
                                  </div>
                                </div>
                                <span className="font-black text-slate-800 text-sm">${p.montop.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-left-4 duration-500">
                    
                    {/* Lado A: Bitácora de Seguimiento */}
                    <div className="flex flex-col space-y-6">
                      <div className="bg-white border border-slate-200 rounded-[2.5rem] flex flex-col h-[450px] overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <History size={14} className="text-blue-600" /> Bitácora de Gestiones
                          </h4>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
                          {notes.map((note) => (
                            <div key={note.id} className="relative pl-6 border-l-2 border-slate-100 last:border-0 pb-2">
                              <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
                              <div className="flex justify-between items-start mb-1">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{note.fecha} • {note.autor}</p>
                                <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase ${
                                  note.tipo === 'SISTEMA' ? 'bg-slate-100 text-slate-500' : 
                                  note.tipo === 'VISITA' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                }`}>{note.tipo}</span>
                              </div>
                              <p className="text-xs text-slate-700 font-medium leading-relaxed">{note.texto}</p>
                            </div>
                          ))}
                        </div>

                        <div className="p-5 border-t border-slate-100 bg-white">
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Nota de gestión..." 
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                            />
                            <button 
                              onClick={handleAddNote}
                              className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                            >
                              <Save size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lado B: Herramientas Waha y Compromisos */}
                    <div className="space-y-6">
                      
                      {/* Automatización WhatsApp */}
                      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <MessageSquare size={14} className="text-green-600" /> Acciones WAHA
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                           <button className="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-2xl border border-green-100 text-green-700 transition-all group">
                              <div className="flex items-center gap-3">
                                 <div className="p-1.5 bg-white rounded-lg shadow-sm"><Send size={12} /></div>
                                 <span className="text-[10px] font-black uppercase tracking-tight">Recordatorio Amistoso</span>
                              </div>
                              <ChevronRight size={12} />
                           </button>
                           <button className="flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-2xl border border-orange-100 text-orange-700 transition-all group">
                              <div className="flex items-center gap-3">
                                 <div className="p-1.5 bg-white rounded-lg shadow-sm"><AlertCircle size={12} /></div>
                                 <span className="text-[10px] font-black uppercase tracking-tight">Aviso de Vencimiento</span>
                              </div>
                              <ChevronRight size={12} />
                           </button>
                        </div>
                      </div>

                      {/* Agendamiento de Compromiso de Pago */}
                      <div className="bg-slate-900 text-white rounded-[2.5rem] p-7 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5"><Calendar size={100} /></div>
                        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                          <Calendar size={14} /> Registrar Compromiso
                        </h4>
                        <div className="space-y-4 relative z-10">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                 <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Fecha</label>
                                 <input 
                                   type="date" 
                                   className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white outline-none focus:ring-2 focus:ring-blue-500"
                                   value={promiseDate}
                                   onChange={(e) => setPromiseDate(e.target.value)}
                                 />
                              </div>
                              <div>
                                 <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Monto</label>
                                 <input 
                                   type="number" 
                                   placeholder="$ 0.00"
                                   className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white outline-none focus:ring-2 focus:ring-blue-500"
                                   value={promiseAmount}
                                   onChange={(e) => setPromiseAmount(e.target.value)}
                                 />
                              </div>
                           </div>
                           <button 
                             onClick={() => {
                               if (promiseDate) {
                                 const note: Note = {
                                   id: Date.now().toString(),
                                   fecha: new Date().toLocaleString(),
                                   autor: 'Admin Master',
                                   texto: `COMPROMISO DE PAGO registrado para el ${promiseDate} por $${promiseAmount || '0'}.`,
                                   tipo: 'LLAMADA'
                                 };
                                 setNotes([note, ...notes]);
                                 setPromiseDate('');
                                 setPromiseAmount('');
                               }
                             }}
                             className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-2xl font-black uppercase text-[9px] tracking-widest shadow-xl shadow-blue-900/40 transition-all active:scale-95"
                           >
                             Confirmar Agendamiento
                           </button>
                        </div>
                      </div>

                      {/* Estatus del Domicilio */}
                      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                           <ShieldCheck size={14} className="text-purple-600" /> Validación Domicilio
                         </h4>
                         <div className="flex gap-2">
                           {['Confirmado', 'Dudoso', 'Inexistente'].map((status) => (
                             <button key={status} className="flex-1 py-2 border border-slate-100 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors text-slate-500">
                               {status}
                             </button>
                           ))}
                         </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsModule;
