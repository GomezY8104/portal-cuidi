
import React from 'react';
import { 
  Globe, Activity, Shield, Users, 
  ArrowUpRight, ArrowDownRight, Zap, 
  Database, AlertCircle, CheckCircle2 
} from 'lucide-react';

export const GlobalDashboardPage: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900">Dashboard Global</h1>
          <p className="text-slate-500 mt-3 text-xl font-medium max-w-2xl leading-relaxed">
            Monitoramento da infraestrutura nacional e integridade da federação.
          </p>
        </div>
        <div className="flex gap-3">
           <div className="px-6 py-3 bg-green-50 text-green-700 rounded-2xl border border-green-100 flex items-center gap-2 font-black text-xs uppercase tracking-widest">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Rede Estável
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Nós Ativos', value: '1.248', change: '+5%', color: 'blue', icon: <Globe size={20}/> },
          { label: 'Eventos/Seg', value: '842', change: '+12%', color: 'indigo', icon: <Activity size={20}/> },
          { label: 'Alertas Audit', value: '03', change: '-20%', color: 'red', icon: <Shield size={20}/> },
          { label: 'Usuários Online', value: '15.4k', change: '+2%', color: 'emerald', icon: <Users size={20}/> },
        ].map((k, i) => (
          <div key={i} className="bg-white p-7 rounded-[2rem] shadow-prominent border border-slate-100 hover:shadow-prominent-hover transition-all group relative overflow-hidden">
            <div className={`absolute -right-4 -top-4 opacity-5 text-slate-900 group-hover:scale-110 transition-transform`}>{k.icon}</div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{k.label}</p>
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
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Fluxo Transacional de Dados</h3>
              <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-500 outline-none">
                <option>Últimos 7 dias</option>
                <option>Últimas 24h</option>
              </select>
           </div>
           
           <div className="flex items-end gap-3 h-64">
              {[40, 70, 45, 90, 65, 80, 50, 85, 40, 75, 95, 60].map((h, i) => (
                <div key={i} className="flex-1 group relative">
                  <div 
                    className="w-full bg-blue-100 group-hover:bg-blue-600 rounded-t-xl transition-all duration-500 cursor-help"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {h}k
                    </div>
                  </div>
                </div>
              ))}
           </div>
           <div className="flex justify-between mt-6 text-[10px] font-black text-slate-300 uppercase tracking-widest px-2">
              <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sab</span><span>Dom</span>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={140} /></div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Database size={20} className="text-blue-400" /> Integridade Ledger
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Último Bloco', value: '#942.102', status: 'OK' },
                  { label: 'Sincronismo', value: '99.99%', status: 'OK' },
                  { label: 'Latência', value: '42ms', status: 'FAST' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
                      <p className="text-lg font-bold">{item.value}</p>
                    </div>
                    <CheckCircle2 size={18} className="text-blue-400" />
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Ver Logs Técnicos</button>
           </div>
        </div>
      </div>
    </div>
  );
};
