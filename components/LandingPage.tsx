
import React from 'react';
import { Smartphone, ShieldCheck, Zap, BarChart3, MessageCircle } from 'lucide-react';

const LandingPage: React.FC<{ onLaunch: () => void }> = ({ onLaunch }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <span className="font-bold text-xl tracking-tight">Mueblesdaso</span>
        </div>
        <button 
          onClick={onLaunch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition-colors"
        >
          Acceder al Sistema
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1]">
              Potencia tu <span className="text-blue-600">Cobranza</span> con Inteligencia.
            </h1>
            <p className="text-xl text-slate-600 max-w-lg">
              ERP integral con App de campo PWA, automatización por WhatsApp y análisis financiero en tiempo real. 
              Desplegable con Docker en 60 segundos.
            </p>
            <div className="flex gap-4">
              <button onClick={onLaunch} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-slate-200 transition-all">
                Explorar Demo
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-[3rem] blur-3xl opacity-50 -z-10"></div>
            <img 
              src="https://picsum.photos/seed/erp/800/600" 
              alt="Dashboard Preview" 
              className="rounded-3xl shadow-2xl border border-slate-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          {[
            { 
              icon: <Smartphone className="w-8 h-8 text-blue-500" />, 
              title: "App Offline PWA", 
              desc: "Tu equipo de campo puede registrar abonos y ventas sin conexión. Sincronización automática al detectar red." 
            },
            { 
              icon: <MessageCircle className="w-8 h-8 text-green-500" />, 
              title: "WhatsApp Automático", 
              desc: "Integración con WAHA para envío automático de recibos, estados de cuenta y recordatorios de pago." 
            },
            { 
              icon: <Zap className="w-8 h-8 text-yellow-500" />, 
              title: "Easypanel Ready", 
              desc: "Arquitectura contenerizada lista para despliegue rápido. Escala horizontalmente sin complicaciones." 
            }
          ].map((feature, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all border border-transparent hover:border-slate-100">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-100 mt-20 py-10 text-center text-slate-400">
        <p>© 2024 Mueblesdaso Enterprise Solutions. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
