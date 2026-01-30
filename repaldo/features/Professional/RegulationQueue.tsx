
import React from 'react';
import { Activity, Search, Filter, ArrowUpRight, Clock, MapPin, Users, AlertCircle } from 'lucide-react';

export const RegulationQueuePage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-2">
            <Activity size={14} /> Inteligência de Fluxo
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Fila de Regulação</h1>
          <p className="text-slate-500 mt-1 text-lg">Gerenciamento dinâmico de prioridades assistenciais territoriais.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Aguardando', value: '142', color: 'blue' },
          { label: 'Urgentes', value: '08', color: 'red' },
          { label: 'T.M.R', value: '4h 12m', color: 'slate' },
          { label: 'Eficácia', value: '94%', color: 'green' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
             <p className={`text-2xl font-black text-${s.color}-600`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Prioridade</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paciente</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Especialidade</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Solicitante</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tempo Fila</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { p: 'ALTA', name: 'Manoel Gomes', spec: 'Cardiologia', origin: 'UPA Centro', time: '42 min', color: 'red' },
                { p: 'MÉDIA', name: 'Ana Clara', spec: 'Oftalmologia', origin: 'UBS Sul', time: '1h 20m', color: 'amber' },
                { p: 'BAIXA', name: 'João Carlos', spec: 'Ortopedia', origin: 'UBS Norte', time: '3h 45m', color: 'blue' },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border border-${item.color}-100 bg-${item.color}-50 text-${item.color}-700`}>
                      {item.p}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-900">{item.name}</td>
                  <td className="px-8 py-6 text-sm font-medium text-slate-600">{item.spec}</td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-400">{item.origin}</td>
                  <td className="px-8 py-6 text-xs font-black flex items-center gap-1.5"><Clock size={12}/> {item.time}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-3 bg-slate-900 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all"><ArrowUpRight size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
