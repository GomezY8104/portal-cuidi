
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { 
  Key, ShieldCheck, CheckCircle, RefreshCw, 
  ArrowRight, Lock, User, Info, AlertCircle 
} from 'lucide-react';

/**
 * Página 4: Aceite de Convite (/invite/:token)
 * Onde o usuário convidado define sua senha e confirma perfil.
 */
export const InviteAcceptPage: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Validação, 2: Senha, 3: Sucesso

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Simula validação do token ao carregar
    const timer = setTimeout(() => {
      if (token === 'expired') {
        alert('Este convite expirou. Solicite um novo ao administrador do seu nó.');
        navigate('/login');
      } else {
        setStep(2);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [token, navigate]);

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert('Senhas não conferem.');
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Visual de fundo tecnológico */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
      </div>

      <div className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden relative z-10">
        <div className="p-10 lg:p-14 text-center">
          
          {step === 1 && (
            <div className="space-y-6 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto animate-pulse">
                <RefreshCw size={40} className="animate-spin" />
              </div>
              <h1 className="text-3xl font-black text-slate-900">Validando Convite...</h1>
              <p className="text-slate-500">Estamos verificando sua autorização na rede federada CUIDI.</p>
              <div className="font-mono text-xs bg-slate-100 p-2 rounded-lg text-slate-400">TOKEN: {token}</div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500 text-left">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mb-6">
                  <ShieldCheck size={40} />
                </div>
                <h1 className="text-3xl font-black text-slate-900">Bem-vindo à Rede</h1>
                <p className="text-slate-500">Convite validado para a instituição <strong>Hospital Regional Sul</strong>.</p>
              </div>

              <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex gap-4 text-blue-800 text-sm">
                <User size={24} className="shrink-0" />
                <div>
                  <p className="font-black">Seu Perfil: Regulador Local</p>
                  <p className="opacity-70">Sua finalidade assistencial está pré-configurada conforme política do nó.</p>
                </div>
              </div>

              <form onSubmit={handleFinish} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Defina sua Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Confirme a Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                      type="password" 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95"
                >
                  {loading ? <RefreshCw className="animate-spin" size={24} /> : <>Ativar minha conta <ArrowRight size={24}/></>}
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-200">
                <CheckCircle size={56} />
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-900 mb-2">Conta Ativada!</h1>
                <p className="text-slate-500 text-lg">Sua identidade foi integrada com sucesso à federação SUS CUIDI.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Próximos Passos</p>
                <div className="flex gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                  <p>Acesse o dashboard institucional.</p>
                </div>
                <div className="flex gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                  <p>Verifique as políticas LGPD ativas.</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/login')}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
              >
                Ir para o Login
              </button>
            </div>
          )}

        </div>
      </div>

      <div className="mt-12 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-4">
        <Info size={14} /> Auditoria Ledger: ON
      </div>
    </div>
  );
};
