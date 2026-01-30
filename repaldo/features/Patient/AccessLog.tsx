
import React from 'react';
import { 
  Eye, Calendar, MapPin, Building2, 
  ArrowRight, Search, Filter, ShieldCheck,
  Download, Activity, History
} from 'lucide-react';

export const PatientAccessLogPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-2">
            <History size={14} /> Transparência Total
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Meus Logs de Acesso</h1>
          <p className="text-slate-500 mt-1 text-lg">Saiba exatamente quem viu seus dados, onde e por qual motivo.</p>
        </div>
        <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
           <Download size={18} /> Exportar Ledger
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Pesquisar por unidade ou profissional..." className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl outline-none" />
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 font-bold text-sm flex items-center gap-2 hover:bg-slate-100 transition-colors">
              <Calendar size={18} /> Período
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {[
            { actor: 'Dr. Ricardo M.', hospital: 'Hospital Regional Sul', purpose: 'Tratamento de Urgência', data: 'Dados Clínicos (Episódio)', time: 'Hoje, 14:32', type: 'UPA' },
            { actor: 'Enf. Joana D.', hospital: 'UBS Jardim das Flores', purpose: 'Consulta de Rotina', data: 'Histórico Completo', time: '12 Out 2024, 09:15', type: 'UBS' },
            { actor: 'Sistema (Audit)', hospital: 'Federação CUIDI', purpose: 'Auditoria de Integridade', data: 'Metadados Técnicos', time: '10 Out 2024, 23:00', type: 'GLOBAL' },
            { actor: 'Dr. Paulo S.', hospital: 'Hospital das Clínicas', purpose: 'Avaliação de Especialidade', data: 'Exames de Imagem', time: '05 Out 2024, 16:40', type: 'HOSPITAL' },
          ].map((log, i) => (
            <div key={i} className="p-8 px-10 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-widest">{log.type}</span>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-tighter leading-none">{log.time}</p>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">{log.actor}</h3>
                  <p className="text-sm text-slate-500 font-medium">Na unidade: <strong className="text-slate-800">{log.hospital}</strong></p>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end gap-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Finalidade Assistencial</p>
                <p className="text-sm font-bold text-slate-700">{log.purpose}</p>
                <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">
                  <Activity size={12}/> {log.data}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-8 bg-slate-50 text-center">
          <button className="text-sm font-black text-emerald-600 uppercase tracking-widest hover:underline">Carregar mais registros</button>
        </div>
      </div>
    </div>
  );
};
