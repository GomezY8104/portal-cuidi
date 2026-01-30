
import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { FileText, Shield, Globe, Clock, Download, X, ListChecks, Database } from 'lucide-react';

export const DocumentMetadataDrawer: React.FC = () => {
  const { drawerData, closeDrawer } = useAppStore();

  if (!drawerData) return null;

  return (
    <div className="p-10 flex flex-col h-full bg-white space-y-10 uppercase">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
           <FileText size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Metadados Federados</h2>
          <p className="text-[9px] font-bold text-slate-400 tracking-widest mt-1">Integridade de Registro SUS</p>
        </div>
      </div>

      <div className="flex-1 space-y-8 font-bold">
        <section className="space-y-4">
           <h4 className="text-[9px] font-black text-slate-400 tracking-widest flex items-center gap-2"><ListChecks size={12}/> Atributos do Nó</h4>
           <div className="border border-slate-200 rounded-lg overflow-hidden">
             <table className="w-full text-left">
               <tbody className="divide-y divide-slate-100 text-[11px]">
                  <tr><td className="px-4 py-3 bg-slate-50 w-32 font-bold text-slate-400 uppercase">Tipo</td><td className="px-4 py-3 font-black text-slate-900">{drawerData.type}</td></tr>
                  <tr><td className="px-4 py-3 bg-slate-50 w-32 font-bold text-slate-400 uppercase">Nodo Emissor</td><td className="px-4 py-3 text-slate-700">{drawerData.node}</td></tr>
                  <tr><td className="px-4 py-3 bg-slate-50 w-32 font-bold text-slate-400 uppercase">Policy ID</td><td className="px-4 py-3 font-mono text-blue-500 uppercase">{drawerData.policy}</td></tr>
               </tbody>
             </table>
           </div>
        </section>

        <section className="space-y-4">
           <h4 className="text-[9px] font-black text-slate-400 tracking-widest flex items-center gap-2"><Shield size={12}/> Assinatura Ledger</h4>
           <div className="p-5 bg-slate-900 text-blue-400 rounded-xl font-mono text-[10px] break-all shadow-inner border border-white/5">
              0xFD9421A882BC172635D91823F019283CAE28BE1D6C4F7A8B9C0D1E2F3A4B5C6D
           </div>
        </section>

        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 flex gap-4 text-slate-500">
           <Database size={24} className="shrink-0 text-slate-300"/>
           <p className="text-[9px] leading-relaxed italic">"Documento criptografado em repouso no nó de origem. O acesso é liberado mediante política assistencial ativa."</p>
        </div>
      </div>

      <div className="pt-10 border-t border-slate-100">
         <button className="w-full py-4 bg-slate-900 text-white rounded font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95">
           <Download size={16}/> Solicitar Cópia Técnica
         </button>
      </div>
    </div>
  );
};
