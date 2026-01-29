import React, { useState, useMemo } from 'react';
import { 
  MapPin, Phone, MessageSquare, CreditCard, ChevronRight, CheckCircle2, 
  Search, ArrowLeft, Navigation, Calendar, DollarSign, Activity, 
  Map as MapIcon, MoreVertical, X, Check, Clock, AlertCircle, Loader2
} from 'lucide-react';
import { MOCK_CLIENTS } from '../constants';
import { Client } from '../types';
import { paymentsService } from '../src/services/payments.service';

const FieldApp: React.FC = () => {
  const [view, setView] = useState<'home' | 'route' | 'details' | 'payment' | 'success'>('home');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [amount, setAmount] = useState('');
  const [visitedClients, setVisitedClients] = useState<number[]>([]);
  const [totalCollectedToday, setTotalCollectedToday] = useState(0);

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const pendingClients = MOCK_CLIENTS.filter(c => !visitedClients.includes(c.id_cliente));
  
  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setView('details');
  };

  const handlePayment = async () => {
    if (!selectedClient || !amount) return;

    setProcessing(true);
    setError('');

    try {
        const result = await paymentsService.registerPayment({
            clientId: selectedClient.id_cliente,
            amount: parseFloat(amount),
            paymentMethod: 'EFECTIVO'
        });

        if (result.success) {
            const paymentAmount = parseFloat(amount);
            setTotalCollectedToday(prev => prev + paymentAmount);
            setVisitedClients(prev => [...prev, selectedClient.id_cliente]);
            setView('success');
        }
    } catch (err) {
        console.error(err);
        setError('Error al registrar cobro. Intente nuevamente.');
    } finally {
        setProcessing(false);
    }
  };

  const resetProcess = () => {
    setView('route');
    setAmount('');
    setSelectedClient(null);
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-slate-50 overflow-hidden border-x shadow-2xl relative font-sans">
      
      {/* Barra de Estado Ficticia */}
      <div className="bg-slate-900 px-6 py-2 flex justify-between items-center text-[10px] text-slate-400 font-bold shrink-0">
        <span>9:41 AM</span>
        <div className="flex gap-1.5 items-center">
          <div className="w-3 h-2 bg-slate-700 rounded-sm"></div>
          <div className="w-4 h-2 bg-blue-500 rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        
        {/* VISTA: HOME / DASHBOARD DEL GESTOR */}
        {view === 'home' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-slate-900 p-8 rounded-b-[2.5rem] shadow-xl text-white">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-xl font-black">Hola, Juan Pérez</h1>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Gestor de Cobranza #442</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600 border-2 border-white/20 flex items-center justify-center font-black text-lg">J</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/5">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Cobrado Hoy</p>
                  <p className="text-2xl font-black">${totalCollectedToday.toLocaleString()}</p>
                </div>
                <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/5">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Pendientes</p>
                  <p className="text-2xl font-black">{pendingClients.length}</p>
                </div>
              </div>

              <div className="mt-6 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000" 
                  style={{ width: `${(visitedClients.length / MOCK_CLIENTS.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-right text-[10px] font-bold mt-2 text-blue-400">PROGRESO RUTA: {Math.round((visitedClients.length / MOCK_CLIENTS.length) * 100)}%</p>
            </div>

            <div className="p-6 space-y-6">
              <section>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setView('route')} className="flex flex-col items-center p-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm active:scale-95 transition-transform group">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Navigation className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-tight text-slate-700">Ir a Ruta</span>
                  </button>
                  <button className="flex flex-col items-center p-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm active:scale-95 transition-transform group">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <Search className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-tight text-slate-700">Ventas</span>
                  </button>
                </div>
              </section>

              <section>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Ubicación Actual</h2>
                <div className="bg-slate-200 h-40 rounded-[2rem] relative overflow-hidden shadow-inner border border-slate-300/50">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <MapIcon className="w-12 h-12 opacity-20" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-xl animate-bounce"></div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* VISTA: LISTA DE RUTA */}
        {view === 'route' && (
          <div className="animate-in slide-in-from-right duration-300">
            <div className="p-6 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md bg-white/90">
              <button onClick={() => setView('home')} className="p-2 bg-slate-100 rounded-xl">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h1 className="font-black text-slate-800 uppercase tracking-tight">Ruta del Día</h1>
              <div className="w-9 h-9"></div>
            </div>

            <div className="p-6 space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Buscar por cliente o contrato..." 
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-sm"
                />
              </div>

              <div className="space-y-4">
                {MOCK_CLIENTS.map((client) => {
                  const isVisited = visitedClients.includes(client.id_cliente);
                  return (
                    <div 
                      key={client.id_cliente}
                      onClick={() => !isVisited && handleClientSelect(client)}
                      className={`relative overflow-hidden bg-white p-5 rounded-[2rem] border transition-all duration-300 ${isVisited ? 'opacity-50 border-slate-100 scale-95 pointer-events-none grayscale' : 'border-slate-200 shadow-sm active:bg-blue-50 active:scale-[0.98]'}`}
                    >
                      {isVisited && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white p-1 rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">CONTRATO #{client.contrato_cliente}</p>
                          <h3 className="font-black text-slate-800 text-lg leading-tight uppercase mb-2">{client.nombre_ccliente}</h3>
                          <div className="flex items-center text-xs text-slate-500 font-bold bg-slate-50 w-fit px-3 py-1 rounded-full border border-slate-100">
                            <MapPin className="w-3 h-3 mr-1.5 text-blue-500" />
                            <span className="truncate max-w-[150px]">{client.colonia_dom}, {client.municipio_dom}</span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Saldo Vencido</p>
                          <p className={`font-black text-lg ${client.semdv > 0 ? 'text-red-600' : 'text-green-600'}`}>${client.semdv.toLocaleString()}</p>
                          <div className="mt-3 bg-slate-100 text-slate-400 p-2 rounded-xl">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VISTA: DETALLES DEL CLIENTE (MÓVIL) */}
        {view === 'details' && selectedClient && (
          <div className="animate-in slide-in-from-right duration-300">
            <div className="h-48 bg-slate-900 relative">
               <button onClick={() => setView('route')} className="absolute top-6 left-6 p-2 bg-white/10 backdrop-blur-md rounded-xl text-white">
                 <ArrowLeft className="w-6 h-6" />
               </button>
               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                 <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] border-[6px] border-slate-50 flex items-center justify-center text-4xl font-black text-white shadow-2xl">
                    {selectedClient.nombre_ccliente.charAt(0)}
                 </div>
               </div>
            </div>
            
            <div className="pt-16 px-6 space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{selectedClient.nombre_ccliente}</h2>
                <p className="text-slate-400 font-black text-xs mt-1 uppercase tracking-[0.2em]">ID: {selectedClient.cod_cliente}</p>
                
                <div className="flex justify-center gap-4 mt-8">
                  <a href={`tel:${selectedClient.tel1_cliente}`} className="flex flex-col items-center gap-2 p-5 bg-white border border-slate-200 rounded-[2rem] shadow-sm active:scale-90 transition-transform w-24">
                    <Phone className="text-green-500 w-6 h-6" />
                    <span className="text-[9px] font-black uppercase text-slate-500">Llamar</span>
                  </a>
                  <button className="flex flex-col items-center gap-2 p-5 bg-white border border-slate-200 rounded-[2rem] shadow-sm active:scale-90 transition-transform w-24">
                    <Navigation className="text-blue-500 w-6 h-6" />
                    <span className="text-[9px] font-black uppercase text-slate-500">Ruta</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-5 bg-white border border-slate-200 rounded-[2rem] shadow-sm active:scale-90 transition-transform w-24">
                    <MessageSquare className="text-blue-400 w-6 h-6" />
                    <span className="text-[9px] font-black uppercase text-slate-500">Chat</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">Estado Financiero</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Plan de Pago</span>
                    <span className="font-black text-slate-800">{selectedClient.periodicidad_cliente}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Abono Requerido</span>
                    <span className="font-black text-blue-600 text-lg">${selectedClient.pagos_cliente.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Saldo Vencido</span>
                    <span className="font-black text-red-600 text-xl">${selectedClient.semdv.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Ubicación de Cobro</p>
                <div className="flex items-start gap-4">
                   <div className="p-3 bg-white/10 rounded-2xl">
                     <MapPin className="w-5 h-5 text-blue-400" />
                   </div>
                   <div className="text-sm">
                      <p className="font-black uppercase">{selectedClient.calle_dom} #{selectedClient.exterior_dom}</p>
                      <p className="text-slate-400 font-bold">{selectedClient.colonia_dom}, {selectedClient.municipio_dom}</p>
                   </div>
                </div>
              </div>

              <button 
                onClick={() => setView('payment')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-blue-200 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-sm"
              >
                Registrar Abono
              </button>
            </div>
          </div>
        )}

        {/* VISTA: REGISTRO DE COBRO (PAD NUMÉRICO) */}
        {view === 'payment' && (
          <div className="animate-in slide-in-from-bottom duration-500 flex flex-col h-full bg-slate-900 text-white">
            <div className="p-8 flex justify-between items-center">
               <button onClick={() => setView('details')} className="p-3 bg-white/5 rounded-2xl">
                 <ArrowLeft className="w-6 h-6" />
               </button>
               <h2 className="font-black uppercase tracking-widest text-xs text-blue-400">Punto de Cobro</h2>
               <div className="w-12 h-12"></div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-10">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Ingresar Monto Recibido</label>
              <div className="relative">
                <span className="absolute -left-10 top-1/2 -translate-y-1/2 text-4xl font-black text-blue-600">$</span>
                <input 
                  type="number" 
                  autoFocus
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent w-full text-7xl font-black text-center focus:outline-none placeholder:text-slate-800 caret-blue-600"
                />
              </div>
              <div className="mt-12 bg-white/5 p-6 rounded-3xl border border-white/5 w-full">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-400 uppercase tracking-widest">Saldo Restante</span>
                  <span className="text-slate-200">${(selectedClient!.saldo_actualcli - (parseFloat(amount) || 0)).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {error && (
                <div className="px-10 text-center text-red-500 font-bold text-xs flex items-center justify-center gap-2">
                    <AlertCircle size={14} /> {error}
                </div>
            )}

            <div className="p-10 space-y-4">
              <button 
                onClick={handlePayment}
                disabled={!amount || processing}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/40 transition-all uppercase tracking-widest active:scale-95"
              >
                {processing ? <Loader2 className="animate-spin" /> : <><CreditCard className="w-6 h-6" /> Validar y Generar Recibo</>}
              </button>
              <button onClick={() => setView('details')} className="w-full text-slate-500 font-black uppercase text-[10px] tracking-widest py-2">Volver</button>
            </div>
          </div>
        )}

        {/* VISTA: ÉXITO / CONFIRMACIÓN */}
        {view === 'success' && (
          <div className="animate-in zoom-in-95 duration-500 flex flex-col h-full bg-green-600 text-white p-10 items-center justify-center text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-8 animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-4 italic">¡Abono<br/>Exitoso!</h1>
            <p className="text-green-100 font-medium mb-12">El recibo digital ha sido enviado al cliente por WhatsApp automáticamente.</p>
            
            <div className="bg-white/10 p-8 rounded-[3rem] w-full border border-white/10 backdrop-blur-md mb-12 space-y-6">
              <div className="flex justify-between items-center text-sm">
                <span className="font-black uppercase opacity-60 text-[10px] tracking-widest">Monto</span>
                <span className="text-2xl font-black">${parseFloat(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-white/10 pt-4">
                <span className="font-black uppercase opacity-60 text-[10px] tracking-widest">Folio</span>
                <span className="font-mono font-bold tracking-widest">REC-{Math.floor(Math.random() * 100000)}</span>
              </div>
            </div>

            <button 
              onClick={resetProcess}
              className="w-full bg-white text-green-600 font-black py-6 rounded-[2rem] shadow-2xl shadow-green-900/20 active:scale-95 transition-transform uppercase tracking-widest"
            >
              Continuar Ruta
            </button>
          </div>
        )}
      </div>

      {/* Navegación Inferior (Optimizado para pulgares) */}
      {view !== 'payment' && view !== 'success' && (
        <div className="bg-white/80 backdrop-blur-2xl border-t border-slate-200 px-6 py-4 flex justify-around items-center shrink-0 fixed bottom-0 w-full max-w-md shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] rounded-t-[2.5rem] z-[50]">
          {[
            { id: 'home', icon: <Activity />, label: 'Inicio' },
            { id: 'route', icon: <Navigation />, label: 'Ruta' },
            { id: 'sales', icon: <DollarSign />, label: 'Ventas' },
            { id: 'config', icon: <MoreVertical />, label: 'Más' },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => {
                if (item.id === 'home' || item.id === 'route') setView(item.id as any);
              }}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${view === item.id ? 'text-blue-600 scale-110' : 'text-slate-400 active:scale-90'}`}
            >
              <div className={`p-2.5 rounded-2xl ${view === item.id ? 'bg-blue-50' : ''}`}>
                <div className="w-5 h-5">{item.icon}</div>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FieldApp;
