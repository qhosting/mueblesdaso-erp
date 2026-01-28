import React, { useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { authService } from '../src/services/auth.service';
import { ENV } from '../src/config/env';
import { Loader2, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Intentar login real
      const data = await authService.login(username, password);
      login(data.token, data.user);
    } catch (err) {
      console.error(err);

      // Fallback para DEMOSTRACIÓN (Solo en Desarrollo)
      // Si el backend falla, permitimos entrar con credenciales de prueba en modo DEV
      if (ENV.IS_DEV && username === 'admin' && password === 'admin') {
         const mockUser = {
             id: '1',
             nombre: 'Admin Demo (Dev)',
             email: 'admin@demo.com',
             rol: UserRole.SUPER_ADMIN,
             estado: 'ACTIVO' as const
         };
         login('mock-jwt-token-dev', mockUser);
      } else {
        setError('Credenciales inválidas o error de conexión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>

        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <span className="text-white font-black text-2xl">M</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800">Muebles Daso</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Acceso al Sistema ERP & CRM</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Usuario</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-slate-700 transition-all"
                placeholder="Ej. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-slate-700 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-400 font-medium">
                Acceso restringido a personal autorizado. <br/>
                v2.2.1 (Production Ready)
            </p>
            {ENV.IS_DEV && (
              <p className="text-[9px] text-yellow-600 font-bold mt-2 bg-yellow-50 p-1 rounded inline-block border border-yellow-200">
                ⚠️ MODO DESARROLLO: Demo user enabled
              </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default Login;
