
import React from 'react';
import { Box, AlertTriangle, ArrowUpRight, ArrowDownLeft, Search, Database, Package } from 'lucide-react';
import { MOCK_INVENTORY } from '../constants';

const InventoryModule: React.FC = () => {
  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-xl text-white">
              <Package size={20} />
            </div>
            Gestión de Inventario
          </h1>
          <p className="text-slate-500 text-sm font-medium">Control de stock en tiempo real y alertas de almacén</p>
        </div>

        <div className="flex gap-3">
           <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
             <ArrowUpRight size={16} /> Registrar Entrada
           </button>
           <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
             <ArrowDownLeft size={16} /> Registrar Salida
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total de Artículos', val: '26', icon: <Box size={20} />, color: 'bg-blue-600' },
          { label: 'Stock Bajo Mínimo', val: '1', icon: <AlertTriangle size={20} />, color: 'bg-red-600' },
          { label: 'Almacenes Activos', val: '2', icon: <Database size={20} />, color: 'bg-slate-900' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800">{stat.val}</p>
            </div>
            <div className={`p-4 ${stat.color} text-white rounded-2xl`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Buscar artículo..."
              className="w-full pl-12 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
            />
          </div>
        </div>

        <div className="overflow-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 z-10">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-5">Producto</th>
                <th className="px-8 py-5 text-center">Stock Actual</th>
                <th className="px-8 py-5 text-center">Mínimo Requerido</th>
                <th className="px-8 py-5">Ubicación</th>
                <th className="px-8 py-5 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_INVENTORY.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-black text-slate-800 text-sm uppercase">{item.nombre}</p>
                    <p className="text-[10px] font-bold text-slate-400">ID: {item.producto_id}</p>
                  </td>
                  <td className="px-8 py-5 text-center font-black text-lg text-slate-800">{item.stock_actual}</td>
                  <td className="px-8 py-5 text-center font-bold text-slate-400">{item.stock_minimo}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest">
                      {item.ubicacion}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    {item.stock_actual <= item.stock_minimo ? (
                      <span className="px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase flex items-center justify-center gap-1.5 w-fit mx-auto">
                        <AlertTriangle size={12} /> Stock Crítico
                      </span>
                    ) : (
                      <span className="px-4 py-1.5 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase w-fit mx-auto flex items-center justify-center">
                        Saludable
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryModule;
