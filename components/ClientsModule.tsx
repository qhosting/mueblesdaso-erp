import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, Search, Filter, Info, MapPin, Phone, Calendar, CreditCard, X, 
  ChevronRight, History, ReceiptText, UserCircle, Map as MapIcon, ExternalLink,
  Briefcase, BarChart3, ArrowDownToLine, AlertCircle, Table as TableIcon, TrendingUp,
  BrainCircuit, FileSpreadsheet, MessageSquare, Clock, Package, Calculator,
  Send, Save, Trash2, CheckSquare, ShieldCheck, ArrowLeft, TrendingDown, Target, Loader2, CheckCircle
} from 'lucide-react';
import { MOCK_PAYMENTS, MOCK_COLLECTORS } from '../constants';
import { Client, Collector, AgingRow, Payment } from '../types';
import { clientsService } from '../src/services/clients.service';
import { wahaService } from '../src/services/waha.service';

interface Note {
  id: string;
  fecha: string;
  autor: string;
  texto: string;
  tipo: 'VISITA' | 'LLAMADA' | 'WHATSAPP' | 'SISTEMA';
}

const ClientsModule: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
  const [sendingWaha, setSendingWaha] = useState(false);

  const TODAY = new Date('2024-04-01');

  // Cargar clientes al iniciar
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await clientsService.getAll();
        setClients(data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar la cartera de clientes.');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = client.nombre_ccliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           client.contrato_cliente.includes(searchTerm);
      const matchesStatus = filterStatus === 'ALL' || client.status_cliente === filterStatus;
      const matchesGestor = filterGestor === 'ALL' || client.codigo_gestor === filterGestor;
      return matchesSearch && matchesStatus && matchesGestor;
    });
  }, [searchTerm, filterStatus, filterGestor, clients]);

  const collectorSummaries = useMemo(() => {
    return MOCK_COLLECTORS.map(collector => {
      const assigned = clients.filter(c => c.codigo_gestor === collector.id_gestor);
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
  }, [clients]);

  const agingData = useMemo(() => {
    return clients.map(client => {
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
  }, [clients, TODAY]);

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

  const sendWhatsApp = async (type: 'REMINDER' | 'OVERDUE') => {
    if (!selectedClient) return;
    setSendingWaha(true);

    let message = '';
    if (type === 'REMINDER') {
      message = `Hola ${selectedClient.nombre_ccliente}, recordatorio de pago Muebles Daso. Su saldo actual es $${selectedClient.saldo_actualcli}. Gracias por su preferencia.`;
    } else {
      message = `URGENTE: ${selectedClient.nombre_ccliente}, su cuenta presenta atraso. Favor de liquidar $${selectedClient.semdv} inmediatamente para evitar recargos.`;
    }

    try {
      await wahaService.sendMessage(selectedClient.tel1_cliente, message);
      const note: Note = {
        id: Date.now().toString(),
        fecha: new Date().toLocaleString(),
        autor: 'SISTEMA',
        texto: `Mensaje WA enviado: ${type === 'REMINDER' ? 'Recordatorio' : 'Aviso Mora'}`,
        tipo: 'WHATSAPP'
      };
      setNotes([note, ...notes]);
    } catch (e) {
      console.error(e);
    } finally {
      setSendingWaha(false);
    }
  };

  const closeModal = () => {
    setSelectedClient(null);
    setIsManaging(false);
  };

  if (loading) {
      return <div className="flex h-full items-center justify-center text-slate-400"><Loader2 className="animate-spin mr-2" /> Cargando cartera...</div>;
  }

  if (error) {
      return <div className="flex h-full items-center justify-center text-red-500 font-bold"><AlertCircle className="mr-2" /> {error}</div>;
  }

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

        {/* ... (Otras vistas permanecen igual) ... */}
      </div>

      {/* MODAL DETALLES Y GESTIÓN */}
      {selectedClient && (
        <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-0 lg:p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full h-full lg:h-[90vh] lg:max-w-7xl lg:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
            
            {/* ... (Header y Columna Izquierda permanecen igual) ... */}
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

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-slate-50/50">
              
              <div className="w-full lg:w-1/3 p-6 border-r border-slate-200 overflow-y-auto space-y-6 bg-white shrink-0 scrollbar-thin">
                {/* ... (Sección Resumen y Mapa igual) ... */}
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CreditCard size={14} className="text-blue-600" /> Resumen de Cuenta
                  </h3>
                  {/* ... */}
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

              {/* Columna Derecha Dinámica */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                {!isManaging ? (
                  <div className="p-8 lg:p-10 animate-in fade-in slide-in-from-right-4 duration-300">
                    {/* ... (Vista Standard igual) ... */}
                  </div>
                ) : (
                  <div className="p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-left-4 duration-500">
                    
                    {/* Lado A: Bitácora */}
                    {/* ... (Bitácora igual) ... */}

                    {/* Lado B: Herramientas Waha */}
                    <div className="space-y-6">
                      
                      {/* Automatización WhatsApp */}
                      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <MessageSquare size={14} className="text-green-600" /> Acciones WAHA
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                           <button
                             onClick={() => sendWhatsApp('REMINDER')}
                             disabled={sendingWaha}
                             className="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-2xl border border-green-100 text-green-700 transition-all group disabled:opacity-50"
                           >
                              <div className="flex items-center gap-3">
                                 <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                   {sendingWaha ? <Loader2 size={12} className="animate-spin"/> : <Send size={12} />}
                                 </div>
                                 <span className="text-[10px] font-black uppercase tracking-tight">Recordatorio Amistoso</span>
                              </div>
                              <ChevronRight size={12} />
                           </button>
                           <button
                             onClick={() => sendWhatsApp('OVERDUE')}
                             disabled={sendingWaha}
                             className="flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-2xl border border-orange-100 text-orange-700 transition-all group disabled:opacity-50"
                           >
                              <div className="flex items-center gap-3">
                                 <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                   {sendingWaha ? <Loader2 size={12} className="animate-spin"/> : <AlertCircle size={12} />}
                                 </div>
                                 <span className="text-[10px] font-black uppercase tracking-tight">Aviso de Vencimiento</span>
                              </div>
                              <ChevronRight size={12} />
                           </button>
                        </div>
                      </div>

                      {/* ... (Resto igual) ... */}
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
