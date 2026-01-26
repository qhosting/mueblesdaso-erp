
import React, { useState } from 'react';
import { ShoppingBag, Search, Tag, DollarSign, Plus, FileText, UserPlus, ArrowRight } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';

const SalesModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<Product[]>([]);

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const total = cart.reduce((acc, p) => acc + p.precio_credito, 0);

  return (
    <div className="p-6 flex gap-6 h-full overflow-hidden">
      {/* Catálogo */}
      <div className="flex-1 flex flex-col space-y-6">
        <header>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <ShoppingBag size={20} />
            </div>
            Catálogo de Ventas
          </h1>
          <p className="text-slate-500 text-sm font-medium">Cotización y registro de nuevos contratos</p>
        </header>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar por modelo, SKU o categoría..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all group">
              <div className="aspect-square bg-slate-100 rounded-[1.5rem] mb-4 flex items-center justify-center text-slate-300">
                <ShoppingBag size={48} strokeWidth={1} />
              </div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{product.sku}</p>
              <h3 className="font-black text-slate-800 text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors uppercase">{product.nombre}</h3>
              <div className="flex justify-between items-end mt-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">A Crédito</p>
                  <p className="text-xl font-black text-slate-900">${product.precio_credito.toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-lg"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cotizador / Resumen */}
      <div className="w-96 bg-slate-900 rounded-[3rem] p-8 flex flex-col text-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
           <FileText size={200} />
        </div>
        
        <h2 className="text-xl font-black uppercase tracking-tight mb-8">Cotización Actual</h2>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/10">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <ShoppingBag size={48} className="mb-4" />
              <p className="text-xs font-bold uppercase tracking-widest">Carrito Vacío</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between items-center group">
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{item.sku}</p>
                  <p className="text-sm font-bold uppercase truncate max-w-[150px]">{item.nombre}</p>
                </div>
                <p className="font-black text-lg">${item.precio_credito.toLocaleString()}</p>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total a Financiar</span>
            <span className="text-3xl font-black text-blue-400">${total.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-900/40">
              <UserPlus size={18} /> Seleccionar Cliente
            </button>
            <button className="w-full bg-white text-slate-900 hover:bg-slate-100 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all">
              Generar Contrato <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesModule;
