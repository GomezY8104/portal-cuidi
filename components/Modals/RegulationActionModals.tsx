import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, AlertCircle, Send, CheckCircle, 
  ArrowLeft, FileText, Lock, ShieldCheck, 
  Info, ArrowRight, Activity, Zap, ClipboardCheck,
  Bell, FileDigit, Globe, Building2, Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RegulationActionModals: React.FC = () => {
  const { activeModal, closeModal, modalData } = useAppStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isReturn = activeModal === 'ReturnCaseModal';
  const isRecusal = activeModal === 'NotificationRecusalModal';
  const isDocRequest = activeModal === 'DocRequestModal';
  const isEligibility = activeModal === 'EligibilityModal';

  const handleAction = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      if (isEligibility) {
        setTimeout(() => {
           closeModal();
           navigate('/regulator');
        }, 2500);
      }
    }, 2000);
  };

  const getVisual = () => {
    if (isReturn) return { icon: <ArrowLeft size={40}/>, color: 'bg-amber-100 text-amber-600', title: 'Devolver Protocolo', desc: 'Retorno à unidade de origem para complementação documental.' };
    if (isRecusal) return { icon: <X size={40}/>, color: 'bg-red-100 text-red-600', title: 'Homologar Recusa (INAPTO)', desc: 'Notificação global de encerramento do protocolo assistencial.' };
    if (isDocRequest) return { icon: <FileDigit size={40}/>, color: 'bg-blue-100 text-blue-600', title: 'Solicitar Documentação', desc: 'Protocolo aguardará documentos técnicos do cidadão.' };
    return { icon: <ClipboardCheck size={40}/>, color: 'bg-emerald-100 text-emerald-600', title: 'Homologar Decisão', desc: 'Concluir ato regulatório para transferência ou agendamento.' };
  };

  const visual = getVisual();

  return (
    <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
      {!success ? (
        <div className="space-y-6 animate-in zoom-in">
          <div className="flex justify-between items-center">
             <button onClick={closeModal} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ArrowLeft size={16}/> Voltar</button>
             <button onClick={closeModal} className="p-2 hover:bg-slate-50 rounded-full text-slate-300"><X size={20}/></button>
          </div>

          <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl ${visual.color}`}>
            {visual.icon}
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">{visual.title}</h2>
            <p className="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto text-xs">
              {visual.desc}
            </p>
          </div>

          <div className="space-y-5">
            {(isRecusal || isDocRequest || isReturn) && (
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Mensagem Técnica Federada</label>
                 <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-slate-900 transition-all font-medium text-sm h-28 shadow-inner resize-none leading-relaxed"
                  placeholder="Instruções detalhadas para as unidades e paciente..."
                 />
              </div>
            )}

            {isRecusal && (
               <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-800">
                  <Bell size={18} className="shrink-0" />
                  <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">ALERTA: Esta ação encerrará o protocolo e notificará o paciente imediatamente.</p>
               </div>
            )}

            <div className="bg-slate-900 p-5 rounded-[1.8rem] text-white space-y-3 border border-slate-800 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-3 opacity-5"><Lock size={80}/></div>
               <div className="flex items-center gap-2 text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] relative z-10">
                  <ShieldCheck size={14}/> Protocolo Ledger Federado
               </div>
               <p className="text-[9px] text-slate-400 font-medium leading-relaxed relative z-10 italic">
                 "Este ato gera uma prova imutável na rede nacional SUS."
               </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
             <button 
               onClick={closeModal} 
               className="w-full py-5 bg-slate-100 text-slate-500 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all active:scale-95"
             >
               Cancelar
             </button>
             <button 
              onClick={handleAction}
              disabled={loading}
              className={`w-full py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest text-white shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 ${isRecusal ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'}`}
             >
               {loading ? <span className="flex items-center gap-2"><Zap className="animate-pulse" size={18}/> Transmitindo...</span> : <>{visual.title} <ArrowRight size={18}/></>}
             </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-8 animate-in zoom-in">
           <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-200">
                <CheckCircle size={48} />
              </div>
           </div>
           <div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Ação Sincronizada</h2>
             <p className="text-slate-500 text-sm font-medium mt-3">Veredito transmitido com integridade à rede federada.</p>
           </div>
           <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-left space-y-2 shadow-inner">
              <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]"><Database size={12}/> Proof of Authority Hash</div>
              <p className="font-mono text-[10px] text-slate-600 break-all leading-relaxed">0xFD9421A882BC172635D91823F019283CAE28BE1</p>
           </div>
           <button onClick={closeModal} className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-xl">Fechar Painel</button>
        </div>
      )}
    </div>
  );
};