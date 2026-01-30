
import React from 'react';
import { 
  Activity, BarChart2, Users, Clock, 
  ArrowUpRight, ArrowDownRight, Globe, 
  ShieldCheck, Database, Calendar
} from 'lucide-react';

export const ApsManagerDashboard: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-3">
            <ShieldCheck size={16} /> Governança Institucional
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Painel do Gestor</h1>
          <p className="text-slate-500 mt-4 text-xl font-medium max-w-2xl">
            Análise agregada de performance assistencial e conformidade LGPD do nó APS.
          </p>
        </div>
        <div className="flex gap-3">
           <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all">
             <Calendar size={18} /> Outubro 2024
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Volume Mensal', value: '452', change: '+12%', color: 'blue', icon: <Activity size={20}/> },
          { label: 'Tempo de Regulação', value: '4.2h', change: '-15%', color: 'indigo', icon: <Clock size={20}/> },
          { label: 'Eficiência de Informação', value: '94%', change: '+5%', color: 'emerald', icon: <ShieldCheck size={20}/> },
          { label: 'Ativos em Fila', value: '28', change: '+2%', color: 'slate', icon: <Users size={20}/> },
        ].map((k, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-prominent transition-all group">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 group-hover:text-blue-600">{k.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-slate-900 tracking-tight">{k.value}</p>
              <p className={`text-[10px] font-black flex items-center gap-0.5 ${k.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                {k.change.includes('+') ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                {k.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
           <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-10 flex items-center gap-3">
             <BarChart2 className="text-blue-600" /> Distribuição por Especialidade
           </h3>
           <div className="space-y-8">
              {[
                { label: 'Cardiologia', val: 85, color: 'bg-blue-600' },
                { label: 'Ortopedia', val: 62, color: 'bg-indigo-600' },
                { label: 'Neurologia', val: 45, color: 'bg-emerald-600' },
                { label: 'Oftalmologia', val: 30, color: 'bg-amber-600' },
              ].map((bar, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500 px-1">
                    <span>{bar.label}</span>
                    <span>{bar.val}%</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div className={`h-full ${bar.color} rounded-full transition-all duration-1000`} style={{ width: `${bar.val}%` }}></div>
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
           <div className="absolute top-0 right-0 p-10 opacity-10"><Database size={180} /></div>
           <div className="relative z-10">
             <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><Globe size={24} className="text-blue-400"/> Integridade do Ledger</h3>
             <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Eventos Assistenciais (24h)</p>
                   <p className="text-2xl font-bold">1.242 eventos registrados</p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Conformidade LGPD</p>
                   <p className="text-2xl font-bold text-emerald-400">100% Verificado</p>
                </div>
             </div>
           </div>
           <button className="w-full mt-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40 relative z-10">
             Ver Auditoria Completa
           </button>
        </div>
      </div>
    </div>
  );
};
