
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, AlertCircle, Send, CheckCircle, 
  ArrowLeft, FileText, Lock, ShieldCheck, 
  Info, ArrowRight, Activity, Zap, ClipboardCheck,
  Bell, FileDigit, Globe, Building2, Database,
  CornerUpLeft, Ban, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RegulationActionModals: React.FC = () => {
  const { activeModal, closeModal, modalData, addNotification } = useAppStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notes, setNotes] = useState('');

  const isReturn = activeModal === 'ReturnCaseModal';
  const isRecusal = activeModal === 'NotificationRecusalModal';
  const isDocRequest = activeModal === 'DocRequestModal';
  const isEligibility = activeModal === 'EligibilityModal';

  const handleAction = () => {
    if (!notes && !isEligibility) { // Justificativa obrigatória para recusas/devoluções
        addNotification({ type: 'warning', message: 'Por favor, descreva o motivo da ação.' });
        return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      if (isEligibility) {
        setTimeout(() => {
           closeModal();
           navigate('/regulator');
        }, 2000);
      }
    }, 1500);
  };

  const getVisual = () => {
    if (isReturn) return { icon: <CornerUpLeft size={32}/>, color: 'bg-amber-100 text-amber-700', title: 'Devolver à Origem', desc: 'O caso retornará para a fila da unidade solicitante para ajustes.' };
    if (isRecusal) return { icon: <Ban size={32}/>, color: 'bg-red-100 text-red-700', title: 'Indeferir Solicitação', desc: 'O protocolo será encerrado como INAPTO. A decisão é auditável.' };
    if (isDocRequest) return { icon: <FileText size={32}/>, color: 'bg-blue-100 text-blue-700', title: 'Solicitar Documentos', desc: 'O caso ficará pendente até o envio dos anexos solicitados.' };
    return { icon: <CheckCircle size={32}/>, color: 'bg-emerald-100 text-emerald-700', title: 'Homologar Regulação', desc: 'Confirmar a decisão e disparar as ordens de serviço na rede.' };
  };

  const visual = getVisual();

  return (
    <div className="bg-white w-full max-w-lg mx-auto flex flex-col max-h-[90vh]">
      {!success ? (
        <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${visual.color}`}>
                     {visual.icon}
                  </div>
                  <div>
                     <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">{visual.title}</h2>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ação Regulatória</p>
                  </div>
               </div>
               <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
            </div>

            <div className="p-8 space-y-6 flex-1 overflow-y-auto">
               <p className="text-xs font-medium text-slate-500 leading-relaxed bg-slate-50 p-4 border border-slate-200 rounded-sm">
                  {visual.desc}
               </p>

               {/* Campos Específicos */}
               {(isReturn || isRecusal || isDocRequest) && (
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                        {isDocRequest ? 'Documentos Faltantes' : 'Motivo / Despacho'} <span className="text-red-500">*</span>
                     </label>
                     <textarea 
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="w-full p-4 border border-slate-300 rounded-sm text-xs font-medium text-slate-900 h-32 resize-none outline-none focus:border-blue-600 focus:bg-slate-50 transition-all"
                        placeholder={isDocRequest ? "Liste os exames ou laudos necessários..." : "Justifique tecnicamente a decisão..."}
                     />
                  </div>
               )}

               {isEligibility && (
                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm">
                           <p className="text-[9px] font-black text-slate-400 uppercase">Prioridade</p>
                           <p className="font-black text-slate-900 text-sm">{modalData.priority}</p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm">
                           <p className="text-[9px] font-black text-slate-400 uppercase">Destino(s)</p>
                           <p className="font-black text-slate-900 text-sm">{modalData.vagas?.length || 1} Unidade(s)</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-sm text-blue-800">
                        <Lock size={16} className="shrink-0"/>
                        <p className="text-[10px] font-bold leading-tight">Esta ação será assinada com seu certificado digital e registrada no Ledger.</p>
                     </div>
                  </div>
               )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
               <button onClick={closeModal} className="flex-1 py-4 bg-white border border-slate-300 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 rounded-sm">Cancelar</button>
               <button 
                  onClick={handleAction}
                  disabled={loading}
                  className={`flex-[2] py-4 text-white font-black text-[10px] uppercase tracking-widest rounded-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all ${
                     isRecusal ? 'bg-red-600 hover:bg-red-700' : 
                     isReturn ? 'bg-amber-600 hover:bg-amber-700' : 
                     'bg-slate-900 hover:bg-blue-700'
                  }`}
               >
                  {loading ? <Activity className="animate-spin" size={16}/> : <>{isRecusal ? <Ban size={16}/> : <Check size={16}/>} Confirmar Ação</>}
               </button>
            </div>
        </>
      ) : (
        <div className="p-12 text-center space-y-6 animate-in zoom-in h-full flex flex-col justify-center">
           <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-200">
             <CheckCircle size={40} />
           </div>
           <div>
             <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Operação Concluída</h2>
             <p className="text-slate-500 font-medium text-xs mt-2 max-w-xs mx-auto">
               O trâmite foi registrado e as notificações enviadas aos atores da rede.
             </p>
           </div>
           <div className="bg-slate-100 p-4 rounded-sm text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hash da Transação</p>
              <p className="text-[10px] font-mono font-bold text-slate-700 break-all">0x8f2a...91b2...e410</p>
           </div>
        </div>
      )}
    </div>
  );
};
