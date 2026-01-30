import React, { useState } from 'react';
import { 
  ArrowLeft, Clock, MessageSquare, ShieldCheck, 
  Send, FileText, Globe, AlertCircle, Info,
  History, User, Activity, MoreVertical,
  CheckCircle, Paperclip, MessageCircle,
  FileSearch, Lock, ExternalLink, UserPlus,
  Share2, FilePlus
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const CaseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useAppStore();
  const { id } = useParams();
  const [msg, setMsg] = useState('');

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      {/* Header Simplificado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-widest">Aguardando Informação</span>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">PROTOCOLO: #{id}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Maria Aparecida da Silva</h1>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"><MoreVertical size={20}/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Metadados */}
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-xl font-bold flex items-center gap-2 border-b border-slate-50 pb-6"><FileText size={20} className="text-blue-600"/> Metadados do Encaminhamento</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
                 <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Especialidade Solicitada</p>
                   <p className="font-bold text-slate-900 mt-1">Cardiologia (CID-10: I00-I99)</p>
                 </div>
                 <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Solicitação</p>
                   <p className="font-bold text-slate-900 mt-1">15 Outubro 2024</p>
                 </div>
                 <div className="sm:col-span-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Justificativa Clínica</p>
                   <p className="text-slate-600 leading-relaxed font-medium">
                     Paciente com quadro de dispneia aos esforços e dor precordial esporádica. Histórico familiar de DCV. Hipertensa controlada. Solicita-se avaliação especializada para estratificação de risco cirúrgico.
                   </p>
                 </div>
              </div>
           </div>

           {/* Histórico */}
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
              <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><History size={20} className="text-blue-600"/> Histórico de Decisões</h3>
                <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Auditoria Ledger</button>
              </div>
              <div className="relative pl-8 space-y-10">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100 rounded-full"></div>
                 {[
                   { title: 'Devolvido para Informação', actor: 'Regulador Central (Leste-01)', time: 'Hoje, 10:15', desc: 'Necessário anexar o ECG para qualificação do risco.', type: 'WARN' },
                   { title: 'Elegibilidade Verificada', actor: 'Motor de Regras CUIDI', time: 'Ontem, 16:30', desc: 'Caso cumpre critérios federados de encaminhamento.', type: 'INFO' },
                   { title: 'Encaminhamento Transmitido', actor: 'Enf. Joana (UBS Norte)', time: 'Ontem, 09:00', desc: 'Processo iniciado pelo nó assistencial de origem.', type: 'SUCCESS' },
                 ].map((ev, idx) => (
                   <div key={idx} className="relative group">
                      <div className={`absolute left-[-36px] top-0 w-4 h-4 rounded-full border-4 border-white group-hover:scale-125 transition-transform ${ev.type === 'WARN' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : ev.type === 'SUCCESS' ? 'bg-emerald-600' : 'bg-blue-600'} `}></div>
                      <div className="bg-slate-50/50 p-6 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                         <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-slate-900 text-base">{ev.title}</h4>
                            <span className="text-[10px] font-black text-slate-400 uppercase">{ev.time}</span>
                         </div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 opacity-60">Ator: {ev.actor}</p>
                         <p className="text-sm text-slate-500 font-medium leading-relaxed italic">{ev.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Card de Mensagens e Ações Integradas */}
        <div className="space-y-8">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl flex flex-col h-[750px] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><MessageSquare size={120}/></div>
              
              <div className="flex justify-between items-center border-b border-white/10 pb-6 relative z-10">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <MessageCircle size={20} className="text-blue-400"/> Canal do Regulador
                </h3>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 py-6 pr-2 custom-scrollbar relative z-10">
                 <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-xs">
                    <p className="text-blue-400 font-black uppercase mb-1 text-[9px]">Regulador Territorial</p>
                    <p className="text-slate-300 font-medium leading-relaxed">Poderia importar o laudo de laboratório do nó de origem federado?</p>
                 </div>
                 <div className="bg-blue-600 p-5 rounded-2xl text-xs ml-8 shadow-lg">
                    <p className="text-white/70 font-black uppercase mb-1 text-[9px]">Você (APS)</p>
                    <p className="text-white font-medium leading-relaxed">Sim, estou localizando os dados na rede federada agora mesmo.</p>
                 </div>
              </div>

              {/* Ações Integradas de Subsídios */}
              <div className="space-y-3 relative z-10 bg-slate-800/50 p-6 rounded-[2rem] border border-white/5 mb-4 shadow-inner">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Ações Integradas de Documentação</p>
                 <div className="grid grid-cols-1 gap-2">
                    <button 
                      onClick={() => navigate(`/aps/case/${id}/search`)}
                      className="flex items-center gap-3 px-5 py-4 bg-white/5 hover:bg-indigo-600 border border-white/10 rounded-2xl text-left transition-all group"
                    >
                       <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg group-hover:bg-white group-hover:text-indigo-600"><Globe size={16}/></div>
                       <div>
                          <p className="text-xs font-bold text-white leading-none">Anexar Documento Federado</p>
                          <p className="text-[9px] text-slate-400 mt-1 group-hover:text-indigo-100">Busca em outros nós da rede</p>
                       </div>
                    </button>

                    <button 
                      onClick={() => openModal('NotifyCitizenModal', { patient: 'Maria Aparecida da Silva' })}
                      className="flex items-center gap-3 px-5 py-4 bg-white/5 hover:bg-amber-600 border border-white/10 rounded-2xl text-left transition-all group"
                    >
                       <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg group-hover:bg-white group-hover:text-amber-600"><UserPlus size={16}/></div>
                       <div>
                          <p className="text-xs font-bold text-white leading-none">Solicitar ao Paciente</p>
                          <p className="text-[9px] text-slate-400 mt-1 group-hover:text-amber-100">Notificar via App/SMS CUIDI</p>
                       </div>
                    </button>
                 </div>
              </div>

              {/* Input de Chat */}
              <div className="mt-auto pt-6 border-t border-white/10 relative z-10">
                 <div className="relative">
                    <input 
                      value={msg}
                      onChange={e => setMsg(e.target.value)}
                      placeholder="Responder ao regulador..." 
                      className="w-full pl-5 pr-14 py-5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white outline-none focus:border-blue-500 transition-all shadow-inner placeholder:text-slate-600" 
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                       <Send size={18}/>
                    </button>
                 </div>
              </div>
           </div>

           {/* Card de Informação de Segurança */}
           <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex gap-4 text-blue-900 shadow-sm animate-in fade-in">
             <Lock size={20} className="shrink-0 text-blue-600" />
             <p className="text-[11px] font-medium leading-relaxed italic">
               "Este canal é auditado em tempo real pelo ledger federado. Toda troca de informação assistencial gera um rastro imutável de conformidade."
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};