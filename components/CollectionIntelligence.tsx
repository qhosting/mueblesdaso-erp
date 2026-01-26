
import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, TrendingUp, Calendar, Send, UserX, 
  Table as TableIcon, BarChart4, Download, FileSpreadsheet,
  BrainCircuit, ChevronRight, Clock
} from 'lucide-react';
import { MOCK_CLIENTS, MOCK_PAYMENTS } from '../constants';
import { AgingRow } from '../types';

const CollectionIntelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'summary' | 'aging' | 'forecast'>('summary');
  
  // Fecha de referencia para el cálculo de antigüedad (Simulación)
  const REFERENCE_DATE = new Date('2024-04-01');

  const agingData = useMemo(() => {
    return MOCK_CLIENTS.map(client => {
      const clientPayments = MOCK_PAYMENTS.filter(p => p.cod_cliente === client.cod_cliente);
      const lastPayment = clientPayments.length > 0 
        ? new Date(clientPayments[0].fechap) 
        : new Date(client.fcontrato || '2023-01-01');

      const diffTime = Math.abs(REFERENCE_DATE.getTime() - lastPayment.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let vencido0_30 = 0, vencido31_60 = 0, vencido61_90 = 0, vencido91_mas = 0;

      // Distribución ficticia basada en días de atraso para demostración
      if (client.semdv > 0) {
        if (diffDays <= 30) vencido0_30 = client.semdv;
        else if (diffDays <= 60) vencido31_60 = client.semdv;
        else if (diffDays <= 90) vencido61_90 = client.semdv;
        else vencido91_mas = client.semdv;
      }

      // Pronóstico (Por vencer) basado en saldo actual y periodicidad
      const porVencer = client.saldo_actualcli - client.semdv;
      
      return {
        codigo: client.cod_cliente,
        nombre: client.nombre_ccliente,
        totalVencido: client.semdv,
        vencido0_30,
        vencido31_60,
        vencido61_90,
        vencido91_mas,
        totalPorVencer: porVencer,
        vencer0_30: porVencer * 0.4, // Simulación de distribución
        vencer31_60: porVencer * 0.3,
        vencer61_90: porVencer * 0.2,
        vencer91_mas: porVencer * 0.1,
        totalGeneral: client.saldo_actualcli
      } as AgingRow;
    });
  }, []);

  const totals = useMemo(() => {
    return agingData.reduce((acc, curr) => ({
      totalVencido: acc.totalVencido + curr.totalVencido,
      v0: acc.v0 + curr.vencido0_30,
      v31: acc.v31 + curr.vencido31_60,
      v61: acc.v61 + curr.vencido61_90,
      v91: acc.v91 + curr.vencido91_mas,
    }), { totalVencido: 0, v0: 0, v31: 0, v61: 0, v91: 0 });
  }, [agingData]);

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BrainCircuit className="text-blue-600" /> 
            Inteligencia de Cartera y Recuperación
          </h1>
          <p className="text-slate-500 text-sm font-medium">Análisis automatizado de antigüedad de saldos con IA</p>
        </div>
        
        <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner">
          <button 
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'summary' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <BarChart4 className="w-4 h-4" /> Resumen General
          </button>
          <button 
            onClick={() => setActiveTab('aging')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'aging' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <TableIcon className="w-4 h-4" /> Antigüedad de Saldos
          </button>
          <button 
            onClick={() => setActiveTab('forecast')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'forecast' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <TrendingUp className="w-4 h-4" /> Pronóstico de Cobro
          </button>
        </div>
      </div>

      {activeTab === 'summary' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle size={80} /></div>
               <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Carga Crítica (91+ Días)</p>
               <h3 className="text-4xl font-black text-red-700">${totals.v91.toLocaleString()}</h3>
               <p className="text-xs text-red-500 mt-2 font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Requiere acción jurídica inmediata</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl shadow-sm">
               <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Recuperación 0-30 Días</p>
               <h3 className="text-4xl font-black text-blue-700">${totals.v0.toLocaleString()}</h3>
               <p className="text-xs text-blue-500 mt-2 font-bold">Cobranza administrativa estándar</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <BrainCircuit className="w-3.5 h-3.5 text-blue-400" /> Consultor IA Mueblesdaso
                </p>
                <p className="text-sm font-medium leading-relaxed">
                  Basado en el historial, la eficiencia de cobro para saldos de <span className="text-blue-400 font-bold">31-60 días</span> ha caído un 12%. Recomiendo priorizar visitas en la zona Centro.
                </p>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-500 py-2.5 rounded-xl font-bold text-xs mt-4 transition-all flex items-center justify-center gap-2">
                Generar Estrategia de Hoy <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {[
              { label: '0-30 Días', val: totals.v0, color: 'bg-green-500' },
              { label: '31-60 Días', val: totals.v31, color: 'bg-yellow-500' },
              { label: '61-90 Días', val: totals.v61, color: 'bg-orange-500' },
              { label: '91+ Días', val: totals.v91, color: 'bg-red-500' },
            ].map((b, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${b.color}`}></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{b.label}</span>
                </div>
                <p className="text-lg font-black text-slate-700">${b.val.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeTab === 'aging' || activeTab === 'forecast') && (
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
              <h2 className="font-black text-slate-700 uppercase text-xs tracking-widest flex items-center gap-2">
                {activeTab === 'aging' ? 'Reporte de Antigüedad de Saldos Vencidos' : 'Pronóstico de Cobranza Próximos Períodos'}
              </h2>
              <div className="h-4 w-px bg-slate-300"></div>
              <span className="text-[10px] font-bold text-slate-400 italic">Datos calculados al: {REFERENCE_DATE.toLocaleDateString()}</span>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:bg-slate-50 transition-all uppercase">
              <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" /> Exportar Excel
            </button>
          </div>

          <div className="overflow-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200">
            <table className="w-full border-collapse min-w-[1200px]">
              <thead className="sticky top-0 z-20">
                <tr className="bg-blue-900 text-white text-[10px] font-black uppercase text-center border-b border-blue-800">
                  <th colSpan={2} className="px-4 py-3 border-r border-blue-800 text-left">Información del Cliente</th>
                  <th className="px-4 py-3 border-r border-blue-800">Total {activeTab === 'aging' ? 'Vencido' : 'Cartera'}</th>
                  <th colSpan={4} className={`px-4 py-3 border-r border-blue-800 ${activeTab === 'aging' ? 'bg-red-600' : 'bg-green-600'}`}>
                    {activeTab === 'aging' ? 'Saldos Vencidos (Aging)' : 'Saldos por Vencer (Forecast)'}
                  </th>
                  <th className="px-4 py-3 bg-slate-800 text-slate-300">Total General</th>
                </tr>
                <tr className="bg-slate-100 text-slate-500 text-[9px] font-black uppercase text-center border-b border-slate-200">
                  <th className="px-4 py-2 border-r border-slate-200 text-left w-24">Código</th>
                  <th className="px-4 py-2 border-r border-slate-200 text-left">Nombre (Cliente)</th>
                  <th className="px-4 py-2 border-r border-slate-200 w-32 bg-slate-50">Suma Importe</th>
                  <th className="px-4 py-2 border-r border-slate-200 w-24">0-30 Días</th>
                  <th className="px-4 py-2 border-r border-slate-200 w-24">31-60 Días</th>
                  <th className="px-4 py-2 border-r border-slate-200 w-24">61-90 Días</th>
                  <th className="px-4 py-2 border-r border-slate-200 w-24">91+ Días</th>
                  <th className="px-4 py-2 w-32 bg-slate-50">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {agingData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition-colors group">
                    <td className="px-4 py-2 border-r border-slate-100 font-bold text-blue-600">{row.codigo}</td>
                    <td className="px-4 py-2 border-r border-slate-100 font-sans font-bold text-slate-700">{row.nombre}</td>
                    <td className="px-4 py-2 border-r border-slate-100 text-right font-black bg-slate-50/50">
                      {activeTab === 'aging' ? row.totalVencido.toLocaleString('en-US', { minimumFractionDigits: 2 }) : row.totalPorVencer.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`px-4 py-2 border-r border-slate-100 text-right ${activeTab === 'aging' && row.vencido0_30 > 0 ? 'text-orange-600 font-bold' : 'text-slate-400'}`}>
                      {activeTab === 'aging' ? row.vencido0_30.toLocaleString('en-US', { minimumFractionDigits: 2 }) : row.vencer0_30.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`px-4 py-2 border-r border-slate-100 text-right ${activeTab === 'aging' && row.vencido31_60 > 0 ? 'text-red-500 font-bold bg-red-50/30' : 'text-slate-400'}`}>
                      {activeTab === 'aging' ? row.vencido31_60.toLocaleString('en-US', { minimumFractionDigits: 2 }) : row.vencer31_60.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`px-4 py-2 border-r border-slate-100 text-right ${activeTab === 'aging' && row.vencido61_90 > 0 ? 'text-red-700 font-black bg-red-100/30' : 'text-slate-400'}`}>
                      {activeTab === 'aging' ? row.vencido61_90.toLocaleString('en-US', { minimumFractionDigits: 2 }) : row.vencer61_90.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`px-4 py-2 border-r border-slate-100 text-right ${activeTab === 'aging' && row.vencido91_mas > 0 ? 'text-white font-black bg-red-600 shadow-inner' : 'text-slate-400'}`}>
                      {activeTab === 'aging' ? row.vencido91_mas.toLocaleString('en-US', { minimumFractionDigits: 2 }) : row.vencer91_mas.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-2 text-right font-black bg-slate-800 text-slate-100">
                      {row.totalGeneral.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="sticky bottom-0 bg-slate-900 text-white font-black text-[11px]">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-right uppercase tracking-widest">Totales de Cartera</td>
                  <td className="px-4 py-3 text-right border-x border-slate-700 bg-slate-800">
                    {agingData.reduce((s, r) => s + (activeTab === 'aging' ? r.totalVencido : r.totalPorVencer), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right border-r border-slate-700">
                    {agingData.reduce((s, r) => s + (activeTab === 'aging' ? r.vencido0_30 : r.vencer0_30), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right border-r border-slate-700">
                    {agingData.reduce((s, r) => s + (activeTab === 'aging' ? r.vencido31_60 : r.vencer31_60), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right border-r border-slate-700">
                    {agingData.reduce((s, r) => s + (activeTab === 'aging' ? r.vencido61_90 : r.vencer61_90), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right border-r border-slate-700 bg-red-900/50">
                    {agingData.reduce((s, r) => s + (activeTab === 'aging' ? r.vencido91_mas : r.vencer91_mas), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right bg-blue-600">
                    {agingData.reduce((s, r) => s + r.totalGeneral, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionIntelligence;
