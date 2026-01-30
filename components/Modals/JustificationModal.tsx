
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, MessageSquareText, Save, Info, ShieldCheck, ArrowLeft } from 'lucide-react';

export const JustificationModal: React.FC = () => {
  const { closeModal, modalData } = useAppStore();
  const [text, setText] = useState(modalData?.text || '');

  const handleSave = () => {
    if (modalData?.onSave) {
      modalData.onSave(text);
    }
    closeModal();
  };

  return (
    <div className="bg-white max-h-[90vh] overflow-y-auto custom-scrollbar">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
            <MessageSquareText size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Justificativa Técnica</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Súmula do Médico Regulador</p>
          </div>
        </div>
        <button onClick={closeModal} className="p-2 hover:bg-white rounded-full text-slate-400"><X size={20}/></button>
      </div>

      <div className="p-8 space-y-6">
        <div className="space-y-3">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Parecer Clínico-Regulatório (Obrigatório)</label>
          <textarea 
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Descreva fundamentadamente os critérios clínicos para o veredito..."
            className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-sm h-64 shadow-inner resize-none leading-relaxed"
          />
        </div>

        <div className="bg-blue-50 p-5 rounded-[1.5rem] border border-blue-100 flex gap-4 text-blue-900">
           <ShieldCheck size={24} className="shrink-0 text-blue-600" />
           <p className="text-[10px] font-medium leading-relaxed italic">
             Este parecer será anexado ao protocolo assistencial e poderá ser auditado pelos órgãos de controle e pelo cidadão.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={closeModal}
            className="w-full py-5 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <ArrowLeft size={18}/> Voltar
          </button>
          <button 
            onClick={handleSave}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Save size={18}/> Salvar no Dossiê
          </button>
        </div>
      </div>
    </div>
  );
};
