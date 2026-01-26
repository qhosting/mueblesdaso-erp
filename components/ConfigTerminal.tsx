
import React, { useState } from 'react';
import { Terminal, Database, Send, Layers, Smartphone, CheckCircle2, Circle, ListChecks } from 'lucide-react';
import { DOCKER_COMPOSE_MAESTRO, SQL_SCHEMA, DB_CONFIG } from '../constants';

const ConfigTerminal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'docker' | 'sql' | 'waha' | 'roadmap'>('roadmap');

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
    { cat: 'Infraestructura', item: 'Esquema SQL cat_clientes', status: 'done' },
    { cat: 'CRM Admin', item: 'Aging & Forecast Financiero', status: 'done' },
    { cat: 'CRM Admin', item: 'Bitácora & Centro de Comando', status: 'done' },
    { cat: 'PWA Campo', item: 'Sincronización Offline (VitePWA)', status: 'done' },
    { cat: 'PWA Campo', item: 'Registro de Abonos en Campo', status: 'done' },
    { cat: 'Automatización', item: 'Integración WAHA WhatsApp', status: 'done' },
    { cat: 'Automatización', item: 'n8n Workflow Orquestación', status: 'pending' },
  ];

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50">
      <h1 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
        <div className="p-2 bg-slate-900 rounded-xl text-white">
          <Terminal size={20} />
        </div>
        Consola Técnica & DevOps
      </h1>

      <div className="flex space-x-2 mb-6 border-b border-slate-200">
        {[
          { id: 'roadmap', label: 'Roadmap de Implementación', icon: <ListChecks className="w-4 h-4" /> },
          { id: 'docker', label: 'Docker Compose', icon: <Layers className="w-4 h-4" /> },
          { id: 'sql', label: 'Estructura MariaDB', icon: <Database className="w-4 h-4" /> },
          { id: 'waha', label: 'WAHA (WhatsApp API)', icon: <Smartphone className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600 bg-white rounded-t-xl' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Izquierdo: Código o Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'roadmap' ? (
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
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${item.status === 'done' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                      {item.status === 'done' ? 'Operativo' : 'En Desarrollo'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-[2.5rem] p-8 font-mono text-sm text-slate-300 shadow-2xl overflow-x-auto">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {activeTab === 'docker' && DOCKER_COMPOSE_MAESTRO}
                {activeTab === 'sql' && SQL_SCHEMA}
                {activeTab === 'waha' && WAHA_CODE}
              </pre>
            </div>
          )}
        </div>

        {/* Panel Derecho: Notas de Infraestructura */}
        <div className="space-y-6">
           <div className="bg-blue-600 text-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-200">
              <h4 className="text-xs font-black uppercase tracking-widest mb-4 opacity-70">Despliegue</h4>
              <p className="text-sm font-medium leading-relaxed mb-6">
                El sistema está diseñado para despliegue contenerizado en un servidor VPS gestionado por Easypanel.
              </p>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black uppercase mb-1">Host MariaDB</p>
                  <code className="text-xs font-bold text-blue-200">{DB_CONFIG.host}</code>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black uppercase mb-1">Endpoint WAHA</p>
                  <code className="text-xs font-bold text-blue-200">http://localhost:3001</code>
                </div>
              </div>
           </div>

           <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Estrategia PWA</h4>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                   <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                   <p className="text-xs font-medium text-slate-600"><strong>Offline-First:</strong> Los datos de la ruta se descargan al inicio del día.</p>
                </div>
                <div className="flex gap-4 items-start">
                   <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                   <p className="text-xs font-medium text-slate-600"><strong>Background Sync:</strong> Los abonos capturados sin red se sincronizan automáticamente al detectar conexión.</p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigTerminal;
