
import React, { useState } from 'react';
import { 
  Shield, Database, Search, ArrowRight, 
  Lock, Unlock, Eye, Filter, Calendar,
  FileText, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { MOCK_LEDGER } from '../../mocks/seed';

/**
 * P9: Auditoria Global (/system/audit)
 * Ledger Explorer para transparência e monitoramento de acessos.
 */
export const GlobalAuditPage: React.FC = () => {
  const [events] = useState(MOCK_LEDGER);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-2">
            <Shield size={14} /> Transparência & Conformidade
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Ledger de Auditoria</h1>
          <p className="text-slate-500 mt-1 text-lg">Histórico imutável de compartilhamento de dados federados.</p>
        </div>
        <button className="px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 flex items-center gap-2">
           <RefreshCw size={18} /> Atualizar Fluxo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Eventos', value: '1.4M', color: 'emerald' },
          { label: 'Acessos Autorizados', value: '94%', color: 'blue' },
          { label: 'Violações Bloqueadas', value: '12', color: 'red' },
          { label: 'Integridade Ledger', value: 'VÁLIDO', color: 'green' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color === 'red' ? 'text-red-600' : 'text-slate-900'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[3rem] border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Pesquisar por Hash ID, Paciente ou Ator..."
              className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none focus:border-emerald-500/50 transition-all font-mono text-sm"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-4 bg-slate-800 text-slate-400 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-700">
              <Calendar size={16} /> Período
            </button>
            <button className="flex-1 md:flex-none px-6 py-4 bg-slate-800 text-slate-400 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-700">
              <Filter size={16} /> Decisão
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Hash Evento</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ator / Origem</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Finalidade</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Veredito</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="font-mono text-[10px] text-emerald-500/70">{event.id}f8a...{event.id}e2b</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-slate-300 text-xs font-medium">{new Date(event.timestamp).toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-emerald-400 transition-colors">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-tight">Ator: #{event.actorId}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black">{event.actorOrgId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 px-2 py-1 bg-slate-800 rounded-md w-fit">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{event.dataType}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      event.decision === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {event.decision === 'APPROVED' ? <CheckCircle2 size={10}/> : <AlertCircle size={10}/>}
                      {event.decision}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <Eye size={18} />
                    </button>
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
