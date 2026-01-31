
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Check, ChevronRight, ChevronLeft, FileText, ShieldCheck, 
  Zap, Plus, Trash2, Globe, Lock, ClipboardCheck,
  Stethoscope, User, Calendar, Activity
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ProviderFeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addNotification } = useAppStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const steps = [
    { num: 1, label: 'Dados Atendimento' },
    { num: 2, label: 'Resumo Clínico' },
    { num: 3, label: 'Documentos Gerados' },
    { num: 4, label: 'Governança Saída' }
  ];

  const handleFinish = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addNotification({ type: 'success', message: 'Veredito assistencial publicado com sucesso no Ledger Federado.' });
      navigate('/provider');
    }, 2000);
  };

  return (
    <div className="animate-fade-in-up pb-20 space-y-10 max-w-[1000px] mx-auto">
      {/* STEPPER TÉCNICO SEM CARDS */}
      <div className="flex flex-col items-center text-center space-y-10 py-10 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Devolutiva Clínica Federada</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">Publicação Assistencial • Protocolo: #{id || '901'}</p>
        </div>
        
        <div className="flex items-center gap-4 w-full max-w-lg px-6">
           {steps.map((s, i) => (
             <React.Fragment key={s.num}>
               <div className="flex flex-col items-center gap-3 flex-1 relative">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-[11px] transition-all border-2 z-10 ${step >= s.num ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-300 border-slate-100'}`}>
                    {step > s.num ? <Check size={16} strokeWidth={4}/> : s.num}
                  </div>
                  <span className={`text-[7px] font-black uppercase tracking-[0.2em] whitespace-nowrap absolute -bottom-6 ${step >= s.num ? 'text-slate-900' : 'text-slate-300'}`}>{s.label}</span>
               </div>
               {i < steps.length - 1 && <div className={`h-0.5 w-16 bg-slate-100 relative -top-0 ${step > s.num ? 'bg-slate-900' : ''}`}></div>}
             </React.Fragment>
           ))}
        </div>
      </div>

      <main className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm min-h-[550px] flex flex-col p-10 uppercase">
         {step === 1 && (
           <div className="animate-in slide-in-from-right duration-300 space-y-8">
              <h3 className="text-[11px] font-black text-slate-900 tracking-[0.2em] border-l-4 border-blue-600 pl-4 mb-10">01. Validação dos Dados do Ato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-1.5">
                    <p className="text-[8px] font-black text-slate-400 px-1 tracking-widest">Data Realizada Atendimento</p>
                    <input type="date" defaultValue="2024-10-25" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[11px] outline-none focus:bg-white" />
                 </div>
                 <div className="space-y-1.5">
                    <p className="text-[8px] font-black text-slate-400 px-1 tracking-widest">Modalidade Executada</p>
                    <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[11px] outline-none">
                       <option>PRESENCIAL</option>
                       <option>TELESSAÚDE</option>
                    </select>
                 </div>
                 <div className="md:col-span-2 space-y-1.5">
                    <p className="text-[8px] font-black text-slate-400 px-1 tracking-widest">Profissional Responsável Técnico</p>
                    <div className="p-4 bg-slate-100 rounded-xl font-black text-[11px] text-slate-500 border border-slate-200">DR. ALBERTO CRUZ (CRM-SP 123456)</div>
                 </div>
              </div>
           </div>
         )}

         {step === 2 && (
           <div className="animate-in slide-in-from-right duration-300 space-y-8">
              <h3 className="text-[11px] font-black text-slate-900 tracking-[0.2em] border-l-4 border-blue-600 pl-4 mb-10">02. Resumo Assistencial e Conduta</h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 px-1 tracking-widest">Súmula Clínica do Episódio</label>
                    <textarea className="w-full p-6 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 text-[11px] font-bold h-40 bg-slate-50/30 shadow-inner" placeholder="Descreva diagnósticos, condutas e resolutividade..." />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 px-1 tracking-widest">Conduta Efetuada</label>
                       <textarea className="w-full p-4 border border-slate-200 rounded-xl outline-none h-28 text-[11px] font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 px-1 tracking-widest">Recomendações Unidade de Origem</label>
                       <textarea className="w-full p-4 border border-slate-200 rounded-xl outline-none h-28 text-[11px] font-bold" />
                    </div>
                 </div>
              </div>
           </div>
         )}

         {step === 3 && (
           <div className="animate-in slide-in-from-right duration-300 space-y-8">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-[11px] font-black text-slate-900 tracking-[0.2em] border-l-4 border-blue-600 pl-4">03. Documentos Digitais Produzidos</h3>
                 <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 shadow-lg">
                    <Plus size={12} strokeWidth={3}/> Anexar Novo Registro Técnico
                 </button>
              </div>
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner bg-slate-50/20">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 border-b border-slate-200 text-[8px] font-black text-slate-400">
                          <th className="px-6 py-4">Categoria</th>
                          <th className="px-6 py-4">Nome do Arquivo Digital</th>
                          <th className="px-6 py-4 text-right">Ação</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[10px] font-bold">
                       <tr>
                          <td className="px-6 py-4 text-blue-600">LAUDO TÉCNICO</td>
                          <td className="px-6 py-4 text-slate-700">Laudo_Final_#{id}.pdf</td>
                          <td className="px-6 py-4 text-right"><button className="text-red-400 hover:text-red-600 p-2"><Trash2 size={14}/></button></td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>
         )}

         {step === 4 && (
           <div className="animate-in slide-in-from-right duration-300 space-y-10">
              <h3 className="text-[11px] font-black text-slate-900 tracking-[0.2em] border-l-4 border-blue-600 pl-4 mb-10">04. Governança de Publicação Territorial</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <p className="text-[9px] font-black text-slate-400 px-1 tracking-widest">Políticas de Visibilidade Assistencial:</p>
                    <div className="space-y-3">
                       {['UNIDADE DE ORIGEM (APS/UPA)', 'PACIENTE (PORTAL DO PACIENTE)', 'COMPLEXO REGULADOR TERRITORIAL'].map(t => (
                         <label key={t} className="flex items-center gap-4 p-5 border border-slate-100 bg-white rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group shadow-sm border-l-4 border-l-transparent hover:border-l-blue-600">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                            <span className="text-[10px] font-black text-slate-600 group-hover:text-slate-900 tracking-tight">{t}</span>
                         </label>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-10 bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 shadow-inner">
                    <div className="space-y-3">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                         <Lock size={12} className="text-blue-600"/> Vigência na Rede Federada
                       </p>
                       <select className="w-full p-4 bg-white border border-slate-200 rounded-xl font-black text-[10px] outline-none shadow-sm">
                          <option>HISTÓRICO VITALÍCIO (PADRÃO SUS)</option>
                          <option>RESTRITO (30 DIAS AUDITÁVEL)</option>
                       </select>
                    </div>
                    <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4 shadow-2xl relative overflow-hidden border border-white/5">
                       <div className="absolute top-0 right-0 p-3 opacity-5"><ShieldCheck size={100}/></div>
                       <h4 className="text-[8px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-blue-400 relative z-10"><Globe size={14}/> Veredito Digital Integrado</h4>
                       <p className="text-[10px] leading-relaxed opacity-90 relative z-10 italic normal-case font-medium">"Ao publicar, seu nó prestador assina digitalmente este registro, encerrando o ciclo regulatório no Ledger territorial."</p>
                    </div>
                 </div>
              </div>
           </div>
         )}

         <div className="mt-auto pt-12 border-t border-slate-100 flex justify-between items-center">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="px-8 py-4 text-slate-400 font-black uppercase text-[9px] tracking-widest hover:text-slate-900 flex items-center gap-2 transition-all group">
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Passo Anterior
              </button>
            ) : <div/>}

            {step < 4 ? (
              <button onClick={() => setStep(step + 1)} className="px-12 py-5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all">
                Próximo Passo <ChevronRight size={16}/>
              </button>
            ) : (
              <button 
                onClick={handleFinish}
                disabled={loading}
                className="px-16 py-6 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-blue-200 flex items-center gap-3 hover:bg-blue-700 active:scale-95 transition-all animate-in zoom-in"
              >
                {loading ? <Zap className="animate-spin" size={20}/> : <><ClipboardCheck size={20}/> Finalizar e Publicar no Ledger</>}
              </button>
            )}
         </div>
      </main>
    </div>
  );
};
