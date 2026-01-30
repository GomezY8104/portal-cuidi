import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Shield, ArrowRight, Check, X, Lock, 
  Database, UserCheck, Eye, Calendar, Save,
  ChevronRight, ChevronLeft, Globe
} from 'lucide-react';

export const PolicyWizardDrawer: React.FC = () => {
  const { closeDrawer, drawerData } = useAppStore();
  const [step, setStep] = useState(1);
  const [policy, setPolicy] = useState({
    dataType: 'CLINICAL',
    purpose: 'TREATMENT',
    recipients: 'ANY_FEDERATED',
    scope: 'FULL',
    validity: 'PERMANENT',
    name: ''
  });

  const steps = [
    { num: 1, label: 'Tipo de Dado' },
    { num: 2, label: 'Finalidade' },
    { num: 3, label: 'Destinatários' },
    { num: 4, label: 'Escopo' },
    { num: 5, label: 'Revisão' }
  ];

  const handleFinish = () => {
    if (drawerData?.onComplete) {
      drawerData.onComplete({ ...policy, name: `POL-${policy.dataType}-${policy.purpose}` });
    }
    alert('Política criada com sucesso e propagada no ledger!');
    closeDrawer();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-8 border-b border-slate-100 bg-slate-50/80">
         <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg"><Shield size={24}/></div>
            <div>
               <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Nova Política Local</h2>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configuração de Governança Federada</p>
            </div>
         </div>
         <div className="flex gap-2">
            {steps.map(s => (
               <div key={s.num} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s.num ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
            ))}
         </div>
         <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest text-right mt-2">Passo {step} de 5: {steps[step-1].label}</p>
      </div>

      <div className="flex-1 p-10 overflow-y-auto">
         {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right">
               <h3 className="text-lg font-black text-slate-900 uppercase">Qual tipo de dado será compartilhado?</h3>
               <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'CLINICAL', label: 'Dados Clínicos Gerais', desc: 'Evoluções, Diagnósticos, Alergias' },
                    { id: 'METADATA', label: 'Apenas Metadados', desc: 'Existência de registros sem conteúdo' },
                    { id: 'RESTRICTED', label: 'Dados Sensíveis/Restritos', desc: 'Saúde Mental, Genética, DSTs' },
                    { id: 'ADMIN', label: 'Dados Administrativos', desc: 'Cadastro, Agendamento' }
                  ].map(opt => (
                     <button key={opt.id} onClick={() => setPolicy({...policy, dataType: opt.id})} className={`p-5 rounded-2xl border-2 text-left transition-all group ${policy.dataType === opt.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-indigo-200'}`}>
                        <div className="flex justify-between items-center">
                           <span className={`text-sm font-black uppercase ${policy.dataType === opt.id ? 'text-indigo-900' : 'text-slate-700'}`}>{opt.label}</span>
                           {policy.dataType === opt.id && <Check size={18} className="text-indigo-600"/>}
                        </div>
                        <p className="text-[10px] font-medium text-slate-500 mt-1">{opt.desc}</p>
                     </button>
                  ))}
               </div>
            </div>
         )}

         {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right">
               <h3 className="text-lg font-black text-slate-900 uppercase">Qual a finalidade do acesso?</h3>
               <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'TREATMENT', label: 'Assistência / Tratamento', desc: 'Continuidade do cuidado ao paciente' },
                    { id: 'REGULATION', label: 'Regulação de Acesso', desc: 'Gestão de vagas e encaminhamentos' },
                    { id: 'RESEARCH', label: 'Pesquisa (Anonimizado)', desc: 'Estudos epidemiológicos' },
                    { id: 'AUDIT', label: 'Auditoria Técnica', desc: 'Verificação de conformidade e faturamento' }
                  ].map(opt => (
                     <button key={opt.id} onClick={() => setPolicy({...policy, purpose: opt.id})} className={`p-5 rounded-2xl border-2 text-left transition-all group ${policy.purpose === opt.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-indigo-200'}`}>
                        <div className="flex justify-between items-center">
                           <span className={`text-sm font-black uppercase ${policy.purpose === opt.id ? 'text-indigo-900' : 'text-slate-700'}`}>{opt.label}</span>
                           {policy.purpose === opt.id && <Check size={18} className="text-indigo-600"/>}
                        </div>
                        <p className="text-[10px] font-medium text-slate-500 mt-1">{opt.desc}</p>
                     </button>
                  ))}
               </div>
            </div>
         )}

         {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right">
               <h3 className="text-lg font-black text-slate-900 uppercase">Quem pode acessar?</h3>
               <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'ANY_FEDERATED', label: 'Qualquer Nó Federado', desc: 'Acesso aberto à rede confiável' },
                    { id: 'SPECIFIC_NODES', label: 'Nós Específicos', desc: 'Apenas parceiros listados (Whitelist)' },
                    { id: 'REGULATORS', label: 'Apenas Reguladores', desc: 'Centrais de regulação territorial' },
                    { id: 'PATIENT_ONLY', label: 'Apenas o Paciente', desc: 'Visualização no portal do cidadão' }
                  ].map(opt => (
                     <button key={opt.id} onClick={() => setPolicy({...policy, recipients: opt.id})} className={`p-5 rounded-2xl border-2 text-left transition-all group ${policy.recipients === opt.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-indigo-200'}`}>
                        <div className="flex justify-between items-center">
                           <span className={`text-sm font-black uppercase ${policy.recipients === opt.id ? 'text-indigo-900' : 'text-slate-700'}`}>{opt.label}</span>
                           {policy.recipients === opt.id && <Check size={18} className="text-indigo-600"/>}
                        </div>
                        <p className="text-[10px] font-medium text-slate-500 mt-1">{opt.desc}</p>
                     </button>
                  ))}
               </div>
            </div>
         )}

         {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right">
               <h3 className="text-lg font-black text-slate-900 uppercase">Definição de Escopo e Vigência</h3>
               
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Escopo de Dados</label>
                  <select value={policy.scope} onChange={e => setPolicy({...policy, scope: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none">
                     <option value="FULL">COMPLETO (Tudo disponível)</option>
                     <option value="METADATA">APENAS METADADOS (Índice)</option>
                     <option value="ANONYMIZED">ANONIMIZADO (Sem PII)</option>
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Vigência Temporal</label>
                  <select value={policy.validity} onChange={e => setPolicy({...policy, validity: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none">
                     <option value="PERMANENT">PERMANENTE (Até revogação)</option>
                     <option value="24H">24 HORAS (Por episódio)</option>
                     <option value="30D">30 DIAS</option>
                     <option value="1Y">1 ANO</option>
                  </select>
               </div>
            </div>
         )}

         {step === 5 && (
            <div className="space-y-8 animate-in zoom-in">
               <div className="text-center">
                  <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4"><Database size={40}/></div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase">Resumo da Política</h3>
                  <p className="text-slate-500 font-medium text-sm mt-2">Revise os parâmetros antes de publicar no ledger.</p>
               </div>

               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                     <span className="text-[10px] font-black text-slate-400 uppercase">Dado</span>
                     <span className="text-xs font-bold text-slate-900">{policy.dataType}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                     <span className="text-[10px] font-black text-slate-400 uppercase">Finalidade</span>
                     <span className="text-xs font-bold text-slate-900">{policy.purpose}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                     <span className="text-[10px] font-black text-slate-400 uppercase">Destino</span>
                     <span className="text-xs font-bold text-slate-900">{policy.recipients}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                     <span className="text-[10px] font-black text-slate-400 uppercase">Escopo</span>
                     <span className="text-xs font-bold text-slate-900">{policy.scope}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-[10px] font-black text-slate-400 uppercase">Vigência</span>
                     <span className="text-xs font-bold text-slate-900">{policy.validity}</span>
                  </div>
               </div>
            </div>
         )}
      </div>

      <div className="p-8 border-t border-slate-100 flex gap-4">
         {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">Voltar</button>
         )}
         {step < 5 ? (
            <button onClick={() => setStep(step + 1)} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">Próximo <ChevronRight size={16}/></button>
         ) : (
            <button onClick={handleFinish} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl">
               <Save size={16}/> Publicar Política
            </button>
         )}
      </div>
    </div>
  );
};