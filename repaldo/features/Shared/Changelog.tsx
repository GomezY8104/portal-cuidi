
import React from 'react';
import { Zap, Clock, Star, Info, ChevronRight } from 'lucide-react';

export const ChangelogPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in-up">
      <div className="text-center">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Novidades CUIDI</h1>
        <p className="text-slate-500 text-xl font-medium mt-4">Transparência contínua na evolução da federação.</p>
      </div>

      <div className="space-y-12">
        {[
          { version: 'v3.1.2', date: '15 Out 2024', tag: 'STABLE', highlights: ['Novo motor de governança v2.4', 'Integração com Gov.br Ouro', 'Otimização de latência do Ledger'] },
          { version: 'v3.0.0', date: '01 Set 2024', tag: 'MAJOR', highlights: ['Lançamento da Arquitetura Multi-Nó', 'Painel do Cidadão SUS unificado', 'Suporte a dados restritos'] },
        ].map((v, i) => (
          <div key={i} className="relative pl-12">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100 rounded-full"></div>
            <div className="absolute left-[-8px] top-0 w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
            
            <div className="space-y-4">
               <div className="flex items-center gap-4">
                 <h3 className="text-2xl font-black text-slate-900">{v.version}</h3>
                 <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[9px] font-black tracking-widest uppercase">{v.tag}</span>
                 <span className="text-sm text-slate-400 font-bold">{v.date}</span>
               </div>
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                 <ul className="space-y-4">
                   {v.highlights.map((h, j) => (
                     <li key={j} className="flex items-center gap-3 text-slate-600 font-medium">
                       <Zap size={16} className="text-amber-500" /> {h}
                     </li>
                   ))}
                 </ul>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
