
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, Users, DollarSign, Activity, Database, AlertCircle } from 'lucide-react';
import { DB_CONFIG, MOCK_CLIENTS } from '../constants';

const pieData = [
  { name: 'Al Corriente', value: 70 },
  { name: 'Mora 30d', value: 20 },
  { name: 'Mora Crítica 90d+', value: 10 },
];

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const Dashboard: React.FC = () => {
  const totalBalance = MOCK_CLIENTS.reduce((acc, c) => acc + c.saldo_actualcli, 0);
  const totalOverdue = MOCK_CLIENTS.reduce((acc, c) => acc + c.semdv, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Panel del Director Financiero</h1>
          <div className="flex items-center gap-2 mt-1 text-slate-400">
            <Database className="w-3 h-3" />
            <span className="text-xs font-mono">Base de Datos: {DB_CONFIG.db_name} @ {DB_CONFIG.host}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Servidor En Línea
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Cartera Total', value: `$${totalBalance.toLocaleString()}`, status: 'neutral', icon: <DollarSign className="w-6 h-6 text-blue-500" /> },
          { title: 'Saldo en Mora (Vencido)', value: `$${totalOverdue.toLocaleString()}`, status: 'danger', icon: <AlertCircle className="w-6 h-6 text-red-500" /> },
          { title: 'Clientes Totales', value: MOCK_CLIENTS.length.toString(), status: 'neutral', icon: <Users className="w-6 h-6 text-purple-500" /> },
          { title: 'Eficiencia de Cobro', value: '88.5%', status: 'success', icon: <Activity className="w-6 h-6 text-green-500" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                <h3 className="text-2xl font-black mt-2 text-slate-800">{stat.value}</h3>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold mb-6 text-slate-700">Flujo de Cobranza Mensual (Proyectado vs Real)</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Sem 1', value: 12400, real: 11000 },
                { name: 'Sem 2', value: 15000, real: 14500 },
                { name: 'Sem 3', value: 11800, real: 10200 },
                { name: 'Sem 4', value: 19000, real: 17800 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={0.1} fill="#3b82f6" name="Proyección" />
                <Area type="monotone" dataKey="real" stroke="#10b981" strokeWidth={3} fillOpacity={0.1} fill="#10b981" name="Cobro Real" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold mb-6 text-slate-700">Estado de Cartera (Distribución)</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6">
            {pieData.map((entry, i) => (
              <div key={i} className="flex justify-between items-center text-sm p-2 rounded-lg bg-slate-50">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3 shadow-sm" style={{ backgroundColor: COLORS[i] }} />
                  <span className="font-medium text-slate-600">{entry.name}</span>
                </div>
                <span className="font-black text-slate-800">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
