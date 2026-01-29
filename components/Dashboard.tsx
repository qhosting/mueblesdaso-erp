import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, Users, DollarSign, Activity, Database, AlertCircle, Loader2 } from 'lucide-react';
import { DB_CONFIG } from '../constants';
import { dashboardService, DashboardStats } from '../src/services/dashboard.service';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="h-full flex items-center justify-center text-slate-400"><Loader2 className="animate-spin mr-2" /> Cargando métricas...</div>;
  if (!stats) return <div className="h-full flex items-center justify-center text-red-500">Error al cargar datos</div>;

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
          { title: 'Cartera Total', value: `$${stats.totalBalance.toLocaleString()}`, status: 'neutral', icon: <DollarSign className="w-6 h-6 text-blue-500" /> },
          { title: 'Saldo en Mora (Vencido)', value: `$${stats.totalOverdue.toLocaleString()}`, status: 'danger', icon: <AlertCircle className="w-6 h-6 text-red-500" /> },
          { title: 'Clientes Totales', value: stats.totalClients.toString(), status: 'neutral', icon: <Users className="w-6 h-6 text-purple-500" /> },
          { title: 'Eficiencia de Cobro', value: `${stats.collectionEfficiency}%`, status: 'success', icon: <Activity className="w-6 h-6 text-green-500" /> },
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
              <AreaChart data={stats.projectedCollection}>
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
                <Pie data={stats.portfolioDistribution} innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                  {stats.portfolioDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6">
            {stats.portfolioDistribution.map((entry, i) => (
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
