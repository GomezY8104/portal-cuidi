
import React from 'react';
import { 
  BarChart2, PieChart, TrendingUp, Clock, 
  Map, Download, Filter, Calendar, Info 
} from 'lucide-react';

export const GlobalAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-2">
            <BarChart2 size={14} /> Business Intelligence
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Analytics Federado</h1>
          <p className="text-slate-500 mt-1 text-lg">Métricas de eficiência e volume assistencial nacional.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-5 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50">
             <Calendar size={18} /> Outubro 2024
           </button>
           <button className="px-5 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 shadow-xl shadow-slate-200">
             <Download size={18} /> Relatório PDF
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Tempo Médio Regulação', value: '4h 12m', icon: <Clock className="text-blue-500"/>, sub: '-15% vs mês anterior' },
          { label: 'Aderência Protocolos', value: '92.4%', icon: <TrendingUp className="text-emerald-500"/>, sub: 'Meta: 90%' },
          { label: 'Capilaridade de Dados', value: '78%', icon: <Map className="text-indigo-500"/>, sub: '12 novos nós ativos' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">{s.icon}</div>
              <Info size={16} className="text-slate-300" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-3xl font-black text-slate-900 mb-2">{s.value}</p>
            <p className="text-xs font-bold text-slate-500">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold mb-8">Especialidades mais Demandadas</h3>
          <div className="space-y-6">
            {[
              { label: 'Cardiologia', val: 85, color: 'bg-blue-600' },
              { label: 'Oftalmologia', val: 62, color: 'bg-indigo-600' },
              { label: 'Neurologia', val: 45, color: 'bg-emerald-600' },
              { label: 'Ortopedia', val: 38, color: 'bg-amber-600' },
            ].map((bar, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                  <span>{bar.label}</span>
                  <span>{bar.val}k solicitações</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${bar.color} rounded-full transition-all duration-1000`} style={{ width: `${bar.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 shadow-inner flex flex-col justify-center items-center text-center space-y-6">
           <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
             <PieChart size={48} className="text-blue-600" />
           </div>
           <div>
             <h3 className="text-xl font-black text-slate-900">Origem do Tráfego Ledger</h3>
             <p className="text-slate-500 text-sm mt-2 max-w-xs">Análise de interações por tipo de instituição federada (UPA vs UBS vs Hospitais).</p>
           </div>
           <button className="px-8 py-3 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:bg-slate-50 transition-all">Explorar Dimensões</button>
        </div>
      </div>
    </div>
  );
};
