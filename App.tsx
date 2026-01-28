import React, { useState } from 'react';
import { LayoutDashboard, Smartphone, Terminal, Home, LogOut, ShieldAlert, Users, ShoppingBag, Package, Loader2 } from 'lucide-react';
import Dashboard from './components/Dashboard.tsx';
import FieldApp from './components/FieldApp.tsx';
import ConfigTerminal from './components/ConfigTerminal.tsx';
import LandingPage from './components/LandingPage.tsx';
import CollectionIntelligence from './components/CollectionIntelligence.tsx';
import ClientsModule from './components/ClientsModule.tsx';
import SalesModule from './components/SalesModule.tsx';
import InventoryModule from './components/InventoryModule.tsx';
import Login from './components/Login.tsx';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ENV } from './src/config/env';

type ViewState = 'landing' | 'admin' | 'field' | 'devops' | 'intelligence' | 'clients' | 'sales' | 'inventory';

const MainLayout: React.FC = () => {
  const [view, setView] = useState<ViewState>('admin');
  const { user, logout } = useAuth();

  // Si no hay usuario autenticado, mostrar Login
  // Pero permitimos ver la Landing Page sin login
  if (!user && view !== 'landing') {
    return <Login />;
  }

  if (view === 'landing') {
    return <LandingPage onLaunch={() => setView('admin')} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-700">
      {/* Barra Lateral de Navegación */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg shrink-0 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-black">M</span>
          </div>
          <span className="font-bold text-white text-lg hidden lg:block tracking-tight">Mueblesdaso</span>
        </div>

        <div className="px-6 py-4">
           <div className="bg-slate-800 rounded-xl p-3 flex items-center gap-3 border border-slate-700">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                {user?.nombre.charAt(0)}
              </div>
              <div className="hidden lg:block overflow-hidden">
                <p className="text-white text-xs font-bold truncate">{user?.nombre}</p>
                <p className="text-slate-400 text-[10px] font-medium truncate">{user?.rol}</p>
              </div>
           </div>
        </div>

        <nav className="flex-1 mt-2 px-3 space-y-1 scrollbar-none overflow-y-auto">
          {[
            { id: 'admin', icon: <LayoutDashboard />, label: 'Panel Ejecutivo' },
            { id: 'clients', icon: <Users />, label: 'Clientes' },
            { id: 'sales', icon: <ShoppingBag />, label: 'Ventas' },
            { id: 'inventory', icon: <Package />, label: 'Inventario' },
            { id: 'intelligence', icon: <ShieldAlert />, label: 'Inteligencia de Mora' },
            { id: 'field', icon: <Smartphone />, label: 'App de Campo (PWA)' },
            { id: 'devops', icon: <Terminal />, label: 'Configuración Técnica' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                view === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'
              }`}
            >
              <div className={`w-6 h-6 shrink-0 ${view === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}>
                {item.icon}
              </div>
              <span className="hidden lg:block font-medium text-sm truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto space-y-2 border-t border-slate-800">
           <button 
             onClick={() => setView('landing')}
             className="w-full flex items-center gap-3 p-3 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-800"
           >
             <Home className="w-6 h-6 shrink-0" />
             <span className="hidden lg:block font-medium text-sm">Página Pública</span>
           </button>
           <button
             onClick={logout}
             className="w-full flex items-center gap-3 p-3 text-slate-400 hover:text-red-400 transition-colors rounded-xl hover:bg-red-950/20"
           >
             <LogOut className="w-6 h-6 shrink-0" />
             <span className="hidden lg:block font-medium text-sm">Cerrar Sesión</span>
           </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-auto relative bg-slate-50">
        {view === 'admin' && <Dashboard />}
        {view === 'clients' && <ClientsModule />}
        {view === 'sales' && <SalesModule />}
        {view === 'inventory' && <InventoryModule />}
        {view === 'intelligence' && <CollectionIntelligence />}
        {view === 'field' && <FieldApp />}
        {view === 'devops' && <ConfigTerminal />}
        
        {/* Badge de Estado del Entorno */}
        <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
          <div className="bg-slate-900/90 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl border border-slate-700 backdrop-blur-sm pointer-events-auto flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full animate-pulse ${ENV.IS_DEV ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
            {ENV.IS_DEV ? 'Modo: Desarrollo' : 'Modo: Producción'}
          </div>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

export default App;
