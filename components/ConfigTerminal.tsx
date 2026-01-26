
import React, { useState } from 'react';
import { Terminal, Database, Send, Layers, Smartphone, CheckCircle2, Circle, ListChecks, Rocket, ShieldCheck } from 'lucide-react';
import { DOCKER_COMPOSE_MAESTRO, SQL_SCHEMA, DB_CONFIG } from '../constants';

const ConfigTerminal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'docker' | 'sql' | 'waha' | 'roadmap' | 'prod'>('roadmap');

  const WAHA_CODE = `
// backend/services/servicioWaha.ts
import axios from 'axios';

export const enviarReciboWhatsApp = async (cliente_id: string, monto: number) => {
  const [cliente] = await db.query('SELECT tel1_cliente, nombre_ccliente FROM cat_clientes WHERE id_cliente = ?', [cliente_id]);
  
  const payload = {
    chatId: \`\${cliente.tel1_cliente}@c.us\`,
    text: \`¡Hola \${cliente.nombre_ccliente}! Recibimos tu pago por $\${monto}. Atentamente: Mueblesdaso.\`,
    session: 'default'
  };

  try {
    const response = await axios.post(\`\${process.env.WAHA_URL}/api/sendText\`, payload);
    await db.query('INSERT INTO logs_whatsapp (cliente_id, mensaje, status) VALUES (?, ?, ?)', 
      [cliente_id, payload.text, 'ENVIADO']);
    return response.data;
  } catch (error) {
    console.error('Error enviando WhatsApp:', error);
  }
};
`;

  const ROADMAP_DATA = [
    { cat: 'Infraestructura', item: 'Docker Compose Maestro', status: 'done' },
    { cat: 'Infraestructura', item: 'Dockerfile Producción', status: 'done' },
    { cat: 'CRM Admin', item: 'Aging & Forecast Financiero', status: 'done' },
    { cat: 'CRM Admin', item: 'Bitácora & Centro de Comando', status: 'done' },
    { cat: 'PWA Campo', item: 'Sincronización Offline (VitePWA)', status: 'done' },
    { cat: 'PWA Campo', item: 'Registro de Abonos en Campo', status: 'done' },
    { cat: 'Automatización', item: 'Integración WAHA WhatsApp', status: 'done' },
    { cat: 'Infraestructura', item: 'Despliegue Easypanel', status: 'pending' },
  ];

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-xl text-white">
            <Terminal size={20} />
          </div>
          Consola Técnica & DevOps
        </h1>
        <button 
          onClick={() => setActiveTab('prod')}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          <Rocket size={14} /> Lanzar a Producción
        </button>
      </div>

      <div className="flex space-x-2 mb-6 border-b border-slate-200 overflow-x-auto scrollbar-none">
        {[
          { id: 'roadmap', label: 'Roadmap', icon: <ListChecks className="w-4 h-4" /> },
          { id: 'prod', label: 'Producción Check', icon: <ShieldCheck className="w-4 h-4" /> },
          { id: 'docker', label: 'Docker', icon: <Layers className="w-4 h-4" /> },
          { id: 'sql', label: 'MariaDB', icon: <Database className="w-4 h-4" /> },
          { id: 'waha', label: 'WAHA API', icon: <Smartphone className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
              activeTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600 bg-white rounded-t-xl' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'roadmap' && (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Estado del Sistema</h3>
              <div className="space-y-3">
                {ROADMAP_DATA.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-4">
                      {item.status === 'done' ? (
                        <CheckCircle2 className="text-green-500 w-5 h-5" />
                      ) : (
                        <Circle className="text-slate-300 w-5 h-5 animate-pulse" />
                      )}
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">{item.cat}</p>
                        <p className="text-sm font-black text-slate-800 uppercase">{item.item}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'prod' && (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-8 animate-in fade-in zoom-in-95 duration-300">
               <div>
                 <h3 className="text-xl font-black text-slate-800 uppercase mb-2">Checklist de Despliegue</h3>
                 <p className="text-sm text-slate-500 font-medium">Valida estos puntos antes de sincronizar con Easypanel.</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Dockerfile Configurado', status: true },
                    { label: 'SSL Automático (Easypanel)', status: true },
                    { label: 'Variables de Entorno (DB_HOST)', status: false },
                    { label: 'Webhook WAHA habilitado', status: false },
                    { label: 'Optimización de Nginx', status: true },
                    { label: 'Service Worker (PWA)', status: true }
                  ].map((check, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className={`p-1 rounded-full ${check.status ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                         {check.status ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                       </div>
                       <span className="text-xs font-black uppercase text-slate-600">{check.label}</span>
                    </div>
                  ))}
               </div>

               <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800">
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Próximo Paso Crítico</p>
                 <p className="text-sm font-medium text-slate-300">Sincroniza el repositorio de GitHub con Easypanel y añade los recursos de MariaDB y WAHA desde la tienda de aplicaciones.</p>
               </div>
            </div>
          )}

          {(activeTab === 'docker' || activeTab === 'sql' || activeTab === 'waha') && (
            <div className="bg-slate-900 rounded-[2.5rem] p-8 font-mono text-sm text-slate-300 shadow-2xl overflow-x-auto">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {activeTab === 'docker' && DOCKER_COMPOSE_MAESTRO}
                {activeTab === 'sql' && SQL_SCHEMA}
                {activeTab === 'waha' && WAHA_CODE}
              </pre>
            </div>
          )}
        </div>

        <div className="space-y-6">
           <div className="bg-blue-600 text-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-200">
              <h4 className="text-xs font-black uppercase tracking-widest mb-4 opacity-70">Producción Ready</h4>
              <p className="text-sm font-medium leading-relaxed mb-6">
                El entorno de producción utiliza Nginx para servir la PWA, asegurando que la app sea instalable y rápida.
              </p>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black uppercase mb-1">Puerto de Producción</p>
                <code className="text-xs font-bold text-blue-200">80 (Standard HTTP)</code>
              </div>
           </div>

           <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Notas de MariaDB</h4>
              <div className="space-y-2 text-xs font-medium text-slate-600">
                <p>• Asegúrate de migrar `cat_clientes` primero.</p>
                <p>• El usuario de la DB debe tener permisos para crear tablas y procedimientos.</p>
                <p>• Backup automático configurado en Easypanel (Recomendado).</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigTerminal;
