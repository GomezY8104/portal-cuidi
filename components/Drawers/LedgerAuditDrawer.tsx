
import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Shield, Clock, User, Globe, Activity, CheckCircle, Database } from 'lucide-react';

export const LedgerAuditDrawer: React.FC = () => {
  const { drawerData, closeDrawer } = useAppStore();

  if (!drawerData) return null;

  return (
    <div className="p-10 flex flex-col h-full bg-white space-y-10 uppercase">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
           <Shield size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Registro no Ledger</h2>
          <p className="text-[9px] font-bold text-slate-400 tracking-widest mt-1">Audit Trail Imutável</p>
        </div>
      </div>

      <div className="flex-1 space-y-8 font-bold">
         <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 font-black text-[9px] tracking-widest">
               <CheckCircle size={14}/> Transação Verificada
            </div>
            <p className="text-[11px] font-medium text-emerald-900 normal-case">Esta ação assistencial foi assinada digitalmente e propagada para os nós da federação.</p>
         </div>

         <section className="space-y-4">
            <div className="flex gap-4">
               <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center shrink-0 border border-slate-100"><Activity size={20}/></div>
               <div>
                  <p className="text-[8px] font-black text-slate-400 tracking-widest leading-none mb-1">Evento Assistencial</p>
                  <p className="text-[12px] font-black text-slate-900">{drawerData.ev}</p>
               </div>
            </div>
            <div className="flex gap-4">
               <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center shrink-0 border border-slate-100"><User size={20}/></div>
               <div>
                  <p className="text-[8px] font-black text-slate-400 tracking-widest leading-none mb-1">Ator / Nó Responsável</p>
                  <p className="text-[12px] font-black text-slate-900">{drawerData.actor}</p>
               </div>
            </div>
            <div className="flex gap-4">
               <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center shrink-0 border border-slate-100"><Clock size={20}/></div>
               <div>
                  <p className="text-[8px] font-black text-slate-400 tracking-widest leading-none mb-1">Data e Hora</p>
                  <p className="text-[12px] font-mono font-black text-slate-700">{drawerData.time}</p>
               </div>
            </div>
         </section>

         <section className="space-y-4">
            <h4 className="text-[9px] font-black text-slate-400 tracking-widest px-1 flex items-center gap-2"><Database size={12}/> Bloco de Dados Técnico</h4>
            <div className="p-6 bg-slate-900 text-blue-400 rounded-xl font-mono text-[10px] space-y-2 shadow-2xl border border-white/5 overflow-hidden">
               <p>{`{`}</p>
               <p className="pl-4">{`"tx_id": "0x${Math.random().toString(16).slice(2, 10)}",`}</p>
               <p className="pl-4">{`"origin_node": "BR-FED-SP-01",`}</p>
               <p className="pl-4">{`"auth_chain": "verified",`}</p>
               <p className="pl-4">{`"integrity": "verified"`}</p>
               <p>{`}`}</p>
            </div>
         </section>
      </div>

      <div className="pt-10 border-t border-slate-200">
         <button onClick={closeDrawer} className="w-full py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-colors">Fechar Detalhe</button>
      </div>
    </div>
  );
};
