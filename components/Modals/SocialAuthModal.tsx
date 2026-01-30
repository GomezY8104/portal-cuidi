import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
// Updated import for v6
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../../mocks/seed';
import { ShieldCheck, User, ArrowRight, Loader2, Globe } from 'lucide-react';

export const SocialAuthModal: React.FC = () => {
  const { modalData, closeModal, setUser } = useAppStore();
  // useHistory() is now useNavigate() in v6
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => setStep(2), 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const provider = modalData?.provider || 'Prestador';

  const handleFinish = () => {
    if (!selectedProfile) return alert('Selecione um perfil para continuar.');
    setUser(selectedProfile);
    closeModal();
    
    const role = selectedProfile.role;
    if (role === 'SYSTEM_ADMIN') navigate('/system');
    else if (role === 'NODE_ADMIN') navigate('/node-admin');
    else if (role === 'PATIENT') navigate('/patient');
    else navigate(`/${role.toLowerCase()}`);
  };

  return (
    <div className="p-8">
      {step === 1 ? (
        <div className="flex flex-col items-center py-10 space-y-6 text-center animate-in fade-in zoom-in">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center border-4 border-blue-100 animate-pulse">
              <Globe size={40} className="text-blue-600" />
            </div>
            <Loader2 className="absolute inset-0 w-24 h-24 text-blue-600 animate-spin opacity-20" size={96} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Autenticando via {provider}</h3>
            <p className="text-slate-500 max-w-xs mx-auto leading-relaxed">
              Estamos estabelecendo uma conexão segura com o prestador de identidade federado...
            </p>
          </div>
          <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 animate-progress origin-left w-full"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
            <div className="p-2 bg-green-500 text-white rounded-lg">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-green-900">Autenticação bem-sucedida!</p>
              <p className="text-xs text-green-700">Selecione o perfil que deseja utilizar nesta sessão.</p>
            </div>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {MOCK_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedProfile(user)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                  selectedProfile?.id === user.id 
                    ? 'border-blue-600 bg-blue-50/50 shadow-md' 
                    : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    selectedProfile?.id === user.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{user.name}</p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                      {user.role.replace('_', ' ')} • {user.nodeName}
                    </p>
                  </div>
                </div>
                {selectedProfile?.id === user.id && (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <CheckCircle2 size={14} />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button
              onClick={handleFinish}
              disabled={!selectedProfile}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                selectedProfile 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 active:scale-[0.98]' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Continuar para o Dashboard <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckCircle2 = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);