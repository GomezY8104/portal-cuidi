import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, Smartphone, CheckCircle, ShieldCheck, Fingerprint, Loader2, ArrowRight, AlertTriangle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SecurityModals: React.FC = () => {
  const { activeModal, closeModal, setUser } = useAppStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [confirmText, setConfirmText] = useState('');

  const isMFA = activeModal === 'MFASetupModal';
  const isDelete = activeModal === 'DeleteAccountModal';

  const handleAction = () => {
    setStep(2); // Simula processamento
    setTimeout(() => {
        setStep(3);
        if (isDelete) {
            setTimeout(() => {
                setUser(null);
                closeModal();
                navigate('/login');
            }, 2000);
        }
    }, 2000);
  };

  if (isDelete) {
      return (
        <div className="p-10 text-center space-y-8 bg-red-50/50">
           {step === 1 && (
             <div className="space-y-8 animate-in zoom-in">
                <div className="w-24 h-24 bg-red-100 text-red-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl">
                   <AlertTriangle size={48} />
                </div>
                <div className="space-y-4">
                   <h2 className="text-3xl font-black text-red-700 tracking-tight uppercase leading-none">Zona de Perigo</h2>
                   <p className="text-slate-600 font-medium leading-relaxed max-w-xs mx-auto text-sm">
                      Você está prestes a excluir permanentemente sua conta. Todos os seus dados de acesso e preferências serão removidos do nó local.
                   </p>
                   <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm text-left space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Para confirmar, digite <span className="text-red-600">DELETAR</span> abaixo:</p>
                      <input 
                        value={confirmText}
                        onChange={e => setConfirmText(e.target.value)}
                        className="w-full p-3 border-2 border-red-100 rounded-xl outline-none focus:border-red-500 font-black text-center text-red-600 uppercase tracking-widest"
                        placeholder="DELETAR"
                      />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <button onClick={closeModal} className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all">Cancelar</button>
                   <button 
                     onClick={handleAction}
                     disabled={confirmText !== 'DELETAR'}
                     className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-200 hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                   >
                     <Trash2 size={16}/> Confirmar Exclusão
                   </button>
                </div>
             </div>
           )}

           {step === 2 && (
             <div className="py-20 flex flex-col items-center space-y-6 animate-in fade-in">
                <Loader2 className="animate-spin text-red-600" size={64} />
                <p className="text-red-800 font-black uppercase text-xs tracking-widest">Apagando dados e revogando chaves...</p>
             </div>
           )}

           {step === 3 && (
             <div className="space-y-8 animate-in zoom-in">
                <div className="w-24 h-24 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-200">
                  <CheckCircle size={56} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Conta Excluída</h2>
                  <p className="text-slate-500 font-medium mt-2">Você será redirecionado para a tela de login.</p>
                </div>
             </div>
           )}
        </div>
      );
  }

  return (
    <div className="p-12 text-center space-y-8">
      {step === 1 && (
        <div className="space-y-8 animate-in zoom-in">
          <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ${isMFA ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
            {isMFA ? <Smartphone size={48} /> : <Fingerprint size={48} />}
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {isMFA ? 'Ativar Segundo Fator' : 'Registrar Passkey'}
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
              {isMFA 
                ? 'Receba códigos via SMS ou App para autorizar acessos sensíveis aos seus dados.' 
                : 'Use a biometria do seu dispositivo para logar sem senhas de forma criptografada.'}
            </p>
          </div>
          <button 
            onClick={handleAction}
            className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest text-white shadow-xl transition-all ${isMFA ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
          >
            Começar Configuração
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="py-20 flex flex-col items-center space-y-6 animate-in fade-in">
           <Loader2 className="animate-spin text-blue-600" size={64} />
           <p className="text-slate-500 font-black uppercase text-xs tracking-widest">Comunicando com Provedor de Segurança...</p>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8 animate-in zoom-in">
           <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-200">
             <CheckCircle size={56} />
           </div>
           <div>
             <h2 className="text-3xl font-black text-slate-900">Sucesso!</h2>
             <p className="text-slate-500 font-medium mt-2">Suas novas configurações de segurança já estão ativas na rede.</p>
           </div>
           <button 
            onClick={closeModal}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest"
           >
             Concluir
           </button>
        </div>
      )}
    </div>
  );
};