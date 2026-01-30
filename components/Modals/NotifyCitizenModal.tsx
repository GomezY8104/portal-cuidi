
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, Send, Smartphone, CheckCircle } from 'lucide-react';

export const NotifyCitizenModal: React.FC = () => {
  const { closeModal, modalData } = useAppStore();
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const presets = [
    "Olá! Faltam documentos para seu encaminhamento. Por favor, acesse seu portal.",
    "Seu encaminhamento foi qualificado! Aguarde o agendamento.",
    "Sua consulta foi agendada. Verifique os detalhes no Portal CUIDI.",
  ];

  const handleSend = () => {
    setSent(true);
    setTimeout(() => closeModal(), 1800);
  };

  return (
    <div className="bg-white w-full max-w-lg mx-auto">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Notificar Paciente</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Para: {modalData?.patient || 'Paciente'}</p>
        </div>
        <button onClick={closeModal} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all hover:text-slate-900"><X size={20}/></button>
      </div>

      <div className="p-6 space-y-6">
        {!sent ? (
          <>
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Mensagens Rápidas</label>
              <div className="space-y-1.5">
                {presets.map((p, i) => (
                  <button 
                    key={i} 
                    onClick={() => setMessage(p)}
                    className="w-full p-3.5 text-left bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-xl text-[11px] font-medium transition-colors leading-tight"
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Mensagem Personalizada</label>
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Escreva sua mensagem aqui..." 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold min-h-[100px] text-xs transition-all"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 text-blue-900">
               <Smartphone size={18} className="shrink-0 text-blue-600" />
               <p className="text-[10px] font-medium leading-relaxed">
                 O paciente receberá esta mensagem via Notificação Push (App) e SMS de forma instantânea.
               </p>
            </div>

            <button 
              onClick={handleSend}
              disabled={!message}
              className="w-full py-4.5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Send size={16}/> Enviar Notificação
            </button>
          </>
        ) : (
          <div className="py-12 text-center space-y-6 animate-in zoom-in">
             <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100">
               <CheckCircle size={32} />
             </div>
             <div>
               <h3 className="text-xl font-black text-slate-900">Enviado com Sucesso!</h3>
               <p className="text-slate-500 text-sm font-medium mt-1">O paciente será notificado em instantes.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
