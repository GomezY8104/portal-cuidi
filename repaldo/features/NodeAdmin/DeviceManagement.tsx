
import React from 'react';
import { Smartphone, Laptop, XCircle, ShieldCheck, Clock, ShieldAlert } from 'lucide-react';

export const DeviceManagementPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dispositivos Autorizados</h1>
        <p className="text-slate-500 mt-1 text-lg">Controle de máquinas e terminais assistenciais habilitados no nó.</p>
      </div>

      <div className="grid gap-4">
        {[
          { name: 'Terminal Recepção 01', type: 'DESKTOP', ip: '192.168.1.42', last: 'Ativo agora', status: 'SAFE' },
          { name: 'Tablet Triagem Norte', type: 'MOBILE', ip: '10.0.4.12', last: 'há 10 min', status: 'SAFE' },
          { name: 'Máquina Desconhecida', type: 'DESKTOP', ip: '177.42.1.9', last: 'Tentativa há 1h', status: 'WARN' },
        ].map((d, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-prominent transition-all">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${d.status === 'WARN' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                {d.type === 'MOBILE' ? <Smartphone size={24}/> : <Laptop size={24}/>}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{d.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{d.ip}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.last}</p>
                <span className={`text-[10px] font-black ${d.status === 'WARN' ? 'text-red-600' : 'text-green-600'}`}>{d.status === 'WARN' ? 'BLOQUEADO' : 'AUTORIZADO'}</span>
              </div>
              <button className={`p-4 rounded-2xl transition-all ${d.status === 'WARN' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-400 hover:text-red-600'}`}>
                {d.status === 'WARN' ? <ShieldAlert size={20}/> : <XCircle size={20}/>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
