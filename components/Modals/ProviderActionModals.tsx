import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, ArrowLeft, ShieldCheck, Zap, Calendar, Database, Lock,
  FilePlus, Check as CheckIcon, ShieldAlert, ArrowRight,
  Stethoscope, User, Clock, Building2, UserPlus, Smartphone
} from 'lucide-react';

export const ProviderActionModals: React.FC = () => {
  const { activeModal, closeModal, modalData } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isAccept = activeModal === 'ProviderAcceptModal';
  const isReject = activeModal === 'ProviderRejectModal';
  const isSchedule = activeModal === 'ProviderScheduleModal';
  const isDocReq = activeModal === 'ProviderDocRequestModal';

  const handleAction = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      if (modalData?.onConfirm) modalData.onConfirm();
    }, 1800);
  };

  return (
    <div className="p-10 max-h-[90vh] overflow-y-auto custom-scrollbar bg-white">
      {!success ? (
        <div className="space-y-8 animate-in zoom-in duration-300">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
             <button onClick={closeModal} className="p-2 text-slate-400 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all hover:text-slate-900"><ArrowLeft size={14}/> Voltar</button>
             <button onClick={closeModal} className="p-2 hover:bg-slate-50 rounded text-slate-300"><X size={18}/></button>
          </div>

          <div className="flex items-center gap-6">
             <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${isAccept ? 'bg-emerald-50 text-emerald-600' : isReject ? 'bg-red-50 text-red-600' : isDocReq ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
               {isAccept ? <ShieldCheck size={32}/> : isReject ? <ShieldAlert size={32}/> : isDocReq ? <UserPlus size={32}/> : <Calendar size={32}/>}
             </div>
             <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
                   {isAccept ? 'Confirmar Aceite Institucional' : isReject ? 'Recusar Encaminhamento' : isDocReq ? 'Solicitar Docs ao Paciente' : 'Agendar Atendimento'}
                </h2>
                <p className="text-slate-500 font-bold text-[9px] tracking-widest uppercase opacity-60 mt-2">
                   {isAccept ? 'Validação de Capacidade Assistencial' : isReject ? 'Justificativa Técnica de Recusa' : 'Notificação via App CUIDI'}
                </p>
             </div>
          </div>

          <div className="space-y-6">
            {isAccept && (
              <div className="p-6 border bg-slate-50 rounded-2xl border-slate-200 space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Resumo do Planejamento</p>
                 <div className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase">
                    <div>
                       <p className="mb-1 text-slate-400">Setor Designado</p>
                       <p className="text-slate-900">{modalData.sector}</p>
                    </div>
                    <div>
                       <p className="mb-1 text-slate-400">Médico Responsável</p>
                       <p className="text-slate-900">{modalData.doctor}</p>
                    </div>
                    <div>
                       <p className="mb-1 text-slate-400">Modalidade</p>
                       <p className="text-blue-600">{modalData.modality}</p>
                    </div>
                    <div>
                       <p className="mb-1 text-slate-400">Data Prevista</p>
                       <p className="text-slate-900">{modalData.date}</p>
                    </div>
                 </div>
              </div>
            )}

            {isDocReq && (
              <div className="space-y-4">
                 <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-4 text-blue-900">
                    <Smartphone size={24} className="shrink-0 text-blue-600" />
                    <p className="text-[10px] font-medium leading-relaxed italic">"O paciente {modalData.patient} receberá uma notificação push para anexar os documentos via portal do cidadão."</p>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Selecione o Documento Faltante</label>
                    <select className="w-full p-4 font-black outline-none bg-slate-50 border border-slate-200 rounded-xl text-[10px] shadow-inner">
                       <option>DOCUMENTO DE IDENTIDADE COM FOTO</option>
                       <option>COMPROVANTE DE RESIDÊNCIA ATUALIZADO</option>
                       <option>EXAMES LABORATORIAIS ANTERIORES</option>
                       <option>LAUDOS DE IMAGEM ESPECÍFICOS</option>
                    </select>
                 </div>
              </div>
            )}

            {isReject && (
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 px-1 tracking-widest uppercase">Motivo da Recusa (Obrigatório)</label>
                    <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black outline-none shadow-inner">
                       <option>INCOMPATIBILIDADE TÉCNICA</option>
                       <option>FALTA DE INSUMOS ESPECÍFICOS</option>
                       <option>ERRO DE TRIAGEM REGULATÓRIA</option>
                       <option>CAPACIDADE ESGOTADA (NÓ LOTADO)</option>
                    </select>
                 </div>
                 <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all font-bold text-[11px] h-32 shadow-inner resize-none leading-relaxed"
                  placeholder="Justificativa técnica detalhada..."
                 />
              </div>
            )}

            <div className="relative p-6 overflow-hidden text-white shadow-2xl bg-slate-900 rounded-2xl space-y-3 border border-white/5">
               <div className="absolute top-0 right-0 p-3 opacity-5 rotate-12"><Database size={70}/></div>
               <div className="flex items-center gap-2 text-[8px] font-black text-blue-400 uppercase tracking-[0.3em] relative z-10">
                  <ShieldCheck size={14}/> Assinatura Digital do Nó
               </div>
               <p className="text-[9px] text-slate-400 font-medium leading-relaxed relative z-10 italic normal-case">
                 "Ao confirmar, este ato assistencial é registrado com validade jurídica no Ledger Federado Nacional."
               </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2">
             <button 
              onClick={handleAction}
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] text-white shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 ${isReject ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : isAccept ? 'bg-blue-600 hover:bg-blue-700' : isDocReq ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-900 hover:bg-slate-800'}`}
             >
               {loading ? <Zap className="animate-pulse" size={16}/> : <>{isAccept ? 'Confirmar e Aceitar Caso' : isReject ? 'Executar Recusa' : isDocReq ? 'Disparar Notificação' : 'Salvar Agenda'} <ArrowRight size={16}/></>}
             </button>
             <button onClick={closeModal} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors text-center py-2">Cancelar Operação</button>
          </div>
        </div>
      ) : (
        <div className="py-10 space-y-8 text-center animate-in zoom-in tracking-widest">
           <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative flex items-center justify-center w-24 h-24 text-white bg-green-500 rounded-full shadow-2xl shadow-green-200">
                <CheckIcon size={40} strokeWidth={4} />
              </div>
           </div>
           <div>
             <h2 className="text-3xl font-black leading-none text-slate-900 uppercase">Fluxo Sincronizado</h2>
             <p className="text-slate-500 text-[10px] font-bold mt-4 uppercase tracking-[0.3em]">Evento Assistencial Gravado no Ledger.</p>
           </div>
           <div className="p-5 space-y-2 text-left border bg-slate-50 rounded-2xl border-slate-100">
              <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Hash de Transmissão</p>
              <p className="font-mono text-[9px] text-blue-600 break-all leading-tight">0xFD9421A882BC172635D91823F019283CAE28BE1</p>
           </div>
           <button onClick={closeModal} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] active:scale-95 transition-all shadow-xl">Concluir</button>
        </div>
      )}
    </div>
  );
};