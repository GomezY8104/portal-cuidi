
import React from 'react';
import { FileSearch, Download, ShieldCheck, Calendar, Filter, FileText } from 'lucide-react';

export const AuditReportsPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Relatórios de Auditoria</h1>
        <p className="text-slate-500 mt-1 text-lg">Gere provas de integridade e logs de acesso para fiscalização.</p>
      </div>

      <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
           <div className="space-y-4">
             <h3 className="text-xl font-bold flex items-center gap-2"><Calendar size={20} className="text-blue-600"/> Período do Relatório</h3>
             <div className="grid grid-cols-2 gap-4">
               <input type="date" className="p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs" />
               <input type="date" className="p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs" />
             </div>
           </div>
           
           <div className="space-y-4">
             <h3 className="text-xl font-bold flex items-center gap-2"><Filter size={20} className="text-blue-600"/> Tipo de Auditoria</h3>
             <select className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none">
               <option>Logs de Acesso Clinico</option>
               <option>Histórico de Alteração de Políticas</option>
               <option>Tentativas de Acesso Negadas</option>
               <option>Consolidado de Integridade Ledger</option>
             </select>
           </div>
        </div>

        <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 flex flex-col justify-center items-center text-center space-y-6">
           <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl text-blue-600">
             <FileText size={32} />
           </div>
           <div>
             <h3 className="text-xl font-black">Pronto para Gerar</h3>
             <p className="text-sm text-slate-500 mt-2 font-medium">O documento será assinado digitalmente pelo nó institucional.</p>
           </div>
           <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-200 flex items-center justify-center gap-2">
             <Download size={18} /> Baixar Relatório (PDF)
           </button>
        </div>
      </div>
    </div>
  );
};
