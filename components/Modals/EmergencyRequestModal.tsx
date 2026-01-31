
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, Siren, AlertTriangle, CheckCircle, Activity, Ambulance } from 'lucide-react';

export const EmergencyRequestModal: React.FC = () => {
  const { closeModal, modalData, updateUpaCaseStatus, addNotification } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [justification, setJustification] = useState('');

  const handleRequest = () => {
    if (!justification) {
        addNotification({ type: 'error', message: 'A justificativa de risco iminente é obrigatória.' });
        return;
    }
    
    setLoading(true);
    setTimeout(() => {
      // Atualiza o status do caso se um ID foi passado
      if (modalData?.caseId) {
        updateUpaCaseStatus(modalData.caseId, 'REGULATION', 'VERMELHO');
      }
      
      setLoading(false);
      setConfirmed(true);
      
      setTimeout(() => {
        closeModal();
        if (modalData?.onSuccess) modalData.onSuccess();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="bg-white w-full max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
      {!confirmed ? (
        <>
          <div className="bg-red-600 p-6 text-white flex justify-between items-start">
            <div className="flex gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm animate-pulse">
                <Siren size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Vaga Zero</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-90 mt-1">Solicitação de Recurso Absoluto</p>
              </div>
            </div>
            <button onClick={closeModal} className="text-white/70 hover:text-white transition-colors"><X size={24}/></button>
          </div>

          <div className="p-8 space-y-6 flex-1 overflow-y-auto">
            <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl">
              <div className="flex items-center gap-2 text-red-700 font-black text-xs uppercase tracking-widest mb-2">
                <AlertTriangle size={16}/> Termo de Responsabilidade
              </div>
              <p className="text-xs font-medium text-red-900 leading-relaxed">
                A Vaga Zero é um recurso de exceção para risco iminente de morte ou perda funcional grave. O médico solicitante assume a responsabilidade legal pela veracidade da urgência.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Justificativa de Risco Iminente</label>
              <textarea 
                value={justification}
                onChange={e => setJustification(e.target.value)}
                placeholder="Descreva a instabilidade hemodinâmica, risco de via aérea ou necessidade de intervenção imediata..."
                className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-red-500 h-32 resize-none transition-all placeholder:font-normal"
              />
            </div>

            <div className="p-4 rounded-xl border-2 border-slate-100 flex items-center gap-4">
               <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                 <Ambulance size={20}/>
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transporte</p>
                 <p className="text-xs font-bold text-slate-700">SAMU/192 será acionado automaticamente</p>
               </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
            <button onClick={closeModal} className="flex-1 py-4 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 rounded-xl transition-all">Cancelar</button>
            <button 
              onClick={handleRequest}
              disabled={loading}
              className="flex-[2] py-4 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-red-700 shadow-xl shadow-red-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              {loading ? <Activity className="animate-spin" size={18}/> : <><Siren size={18}/> Acionar Vaga Zero</>}
            </button>
          </div>
        </>
      ) : (
        <div className="p-12 text-center space-y-6 animate-in zoom-in">
           <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-200">
             <CheckCircle size={48} />
           </div>
           <div>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Solicitação Enviada</h2>
             <p className="text-slate-500 font-medium text-sm mt-2 max-w-xs mx-auto">
               O complexo regulador e o SAMU foram notificados com prioridade máxima.
             </p>
           </div>
           <div className="bg-slate-100 p-4 rounded-xl text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocolo de Emergência</p>
              <p className="text-lg font-mono font-black text-slate-700">VZ-{Math.floor(Math.random() * 100000)}</p>
           </div>
        </div>
      )}
    </div>
  );
};
