
import React from 'react';
import { Download, FileText, PieChart, Calendar, Shield, ArrowRight, BarChart2 } from 'lucide-react';

export const FederationReportsPage: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in-up">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Relatórios Federados</h1>
        <p className="text-slate-500 mt-1 text-lg">Consolidação de dados para governança e prestação de contas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: 'Relatório de Transparência', desc: 'Consolidado de acessos e decisões do ledger por período.', icon: <Shield className="text-blue-600"/> },
          { title: 'Eficiência Regulação', desc: 'Métricas de tempo de resposta e resolutividade assistencial.', icon: <PieChart className="text-indigo-600"/> },
          { title: 'Compliance LGPD', desc: 'Auditoria de consentimentos ativos e revogados na rede.', icon: <FileText className="text-emerald-600"/> },
        ].map((report, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between group">
             <div>
               <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">{report.icon}</div>
               <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">{report.title}</h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{report.desc}</p>
             </div>
             
             <div className="space-y-4">
               <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-2xl">
                 <Calendar size={18} className="text-slate-400" />
                 <select className="bg-transparent text-sm font-bold text-slate-700 outline-none w-full">
                    <option>Outubro 2024</option>
                    <option>Setembro 2024</option>
                    <option>Último Semestre</option>
                 </select>
               </div>
               <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                 <Download size={16}/> Gerar PDF / CSV
               </button>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-600 p-12 rounded-[4rem] text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl shadow-blue-200 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-10"><BarChart2 size={300} /></div>
         <div className="relative z-10 flex-1 space-y-4">
           <h2 className="text-4xl font-black tracking-tight leading-none">Relatórios Customizados</h2>
           <p className="text-blue-100 text-lg font-medium leading-relaxed max-w-xl">
             Precisa de um cruzamento de dados específico para seu território? Utilize nosso gerador avançado de BI para construir visões sob medida.
           </p>
         </div>
         <button className="relative z-10 px-10 py-6 bg-white text-blue-600 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2">
            Acessar Construtor <ArrowRight size={20}/>
         </button>
      </div>
    </div>
  );
};
