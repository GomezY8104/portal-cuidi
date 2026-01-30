
import React from 'react';
import { 
  Home, Users, Lock, Activity, 
  Settings, ArrowRight, UserPlus, 
  ShieldCheck, AlertCircle, Clock
} from 'lucide-react';

export const NodeDashboardPage: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900">Painel Local</h1>
          <p className="text-slate-500 mt-3 text-xl font-medium max-w-2xl leading-relaxed">
            Gestão da unidade de saúde na rede federada.
          </p>
        </div>
        <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 font-black text-xs uppercase tracking-widest flex items-center gap-2">
          <UserPlus size={18} /> Convidar Profissional
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Equipe Ativa', value: '42', icon: <Users className="text-blue-500"/>, detail: '12 novos este mês' },
          { label: 'Políticas Locais', value: '08', icon: <Lock className="text-indigo-500"/>, detail: 'Compliance 100%' },
          { label: 'Consultas (24h)', value: '156', icon: <Activity className="text-emerald-500"/>, detail: 'Fluxo estável' },
        ].map((k, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-prominent border border-slate-50 flex flex-col justify-between group cursor-default">
            <div className="flex items-start justify-between">
              <div className="p-4 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">{k.icon}</div>
              <ArrowRight size={20} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
            </div>
            <div className="mt-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{k.label}</p>
              <p className="text-4xl font-black text-slate-900">{k.value}</p>
              <p className="text-xs font-medium text-slate-500 mt-2">{k.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-black text-slate-900 px-2 tracking-tight">Atividade do Nó</h3>
          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-50">
              {[
                { actor: 'Dr. João Silva', action: 'Login no Sistema', time: 'Há 5 min', status: 'SUCCESS' },
                { actor: 'Enf. Maria', action: 'Acesso Prontuário P124', time: 'Há 12 min', status: 'SUCCESS' },
                { actor: 'Sistema', action: 'Atualização de Política #P02', time: 'Há 1h', status: 'INFO' },
                { actor: 'Dra. Carla', action: 'Tentativa de Acesso Restrito', time: 'Há 2h', status: 'WARNING' },
              ].map((log, i) => (
                <div key={i} className="p-6 px-8 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      log.status === 'SUCCESS' ? 'bg-green-100 text-green-600' : 
                      log.status === 'WARNING' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {log.status === 'SUCCESS' ? <ShieldCheck size={20}/> : <AlertCircle size={20}/>}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{log.action}</p>
                      <p className="text-xs text-slate-400 font-medium">Por: <span className="font-bold">{log.actor}</span></p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                    <Clock size={12}/> {log.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden h-fit">
           <div className="absolute top-0 right-0 p-10 opacity-10"><Settings size={180} /></div>
           <h3 className="text-2xl font-black mb-6">Configurações Rápidas</h3>
           <div className="space-y-4 relative z-10">
             <button className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 transition-all flex items-center justify-between group">
                <span className="font-bold text-sm">Editar Perfil Institucional</span>
                <ArrowRight size={18} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
             </button>
             <button className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 transition-all flex items-center justify-between group">
                <span className="font-bold text-sm">Sincronizar com Federação</span>
                <ArrowRight size={18} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
             </button>
             <button className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 transition-all flex items-center justify-between group text-red-400 border-red-900/20">
                <span className="font-bold text-sm">Solicitar Desativação do Nó</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-all" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
