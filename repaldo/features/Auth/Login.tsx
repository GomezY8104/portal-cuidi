
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_USERS } from '../../mocks/seed';
import { CuidiLogo } from '../../components/ui/CuidiLogo';
import { 
  Shield, ChevronRight, Lock, Mail, Key, 
  User as UserIcon, Fingerprint, HelpCircle, Ticket, 
  ExternalLink, Smartphone, AlertCircle, Building2
} from 'lucide-react';

/**
 * Ícones Oficiais (Social)
 */
const GoogleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
);

const AppleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.48-2.53 3.22l-.98-.04z"/><path d="M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
);

const GovBrIcon = ({ inverted = false }) => (
  <img 
    src="/gov-br-logo.png"
    alt="gov.br"
    width="80"
    height="48"
    style={{
      objectFit: 'contain',
      filter: inverted ? 'brightness(0) invert(1)' : 'none'
    }}
  />
);

export const LoginPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const initialTab = searchParams.get('tab') === 'patient' ? 'pat' : 'inst';
  const [activeTab, setActiveTab] = useState<'inst' | 'pat'>(initialTab);
  const [patientMethod, setPatientMethod] = useState<'email' | 'cpf' | 'govbr'>('cpf');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const setUser = useAppStore((s) => s.setUser);
  const openModal = useAppStore((s) => s.openModal);

  const handleInviteCTA = () => {
    const token = window.prompt('Insira seu token de convite');
    if (token) navigate(`/invite/${token}`);
  };

  const handleInstitutionalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert('Por favor, preencha email e senha.');
    const demoUser = MOCK_USERS.find(u => u.role !== 'PATIENT');
    if (demoUser) handleDemoLogin(demoUser);
  };

  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setLoading(true);
      setTimeout(() => {
        setOtpSent(true);
        setLoading(false);
      }, 1000);
    } else {
      const patientUser = MOCK_USERS.find(u => u.role === 'PATIENT');
      if (patientUser) handleDemoLogin(patientUser);
    }
  };

  const handleDemoLogin = (user: any) => {
    setLoading(true);
    setTimeout(() => {
      setUser(user);
      setLoading(false);
      if (user.role === 'SYSTEM_ADMIN') navigate('/system');
      else if (user.role === 'NODE_ADMIN') navigate('/node-admin');
      else if (user.role === 'PATIENT') navigate('/patient');
      else navigate(`/${user.role.toLowerCase()}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      
      {/* Lado Esquerdo - Branding */}
      <div className="lg:w-[40%] bg-slate-900 text-white p-10 lg:p-20 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12 scale-150">
          <Shield size={400} />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-black leading-tight mb-6">Regulação Federada com Soberania.</h1>
          <p className="text-xl text-slate-400 max-w-md leading-relaxed">
            A infraestrutura do SUS para compartilhamento seguro de dados clínicos, governança ativa e transparência total do cidadão.
          </p>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <Lock className="text-blue-400 mb-2" size={20} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Privacidade</p>
              <p className="text-xs font-medium text-slate-300">Criptografia em cada nó federado.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <Shield className="text-blue-400 mb-2" size={20} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Auditoria</p>
              <p className="text-xs font-medium text-slate-300">Ledger imutável de acessos.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Interface de Login */}
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-6 lg:p-20 min-h-screen relative">
        
        {/* Logo no topo centro */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 lg:top-12">
          <CuidiLogo size={100} className="opacity-80 hover:opacity-100 transition-opacity" />
        </div>

        <div className="w-full max-w-md space-y-10 mt-20">
          
          <div className="flex bg-white p-2 rounded-[2.5rem] shadow-sm border border-slate-200">
            <button 
              onClick={() => { setActiveTab('inst'); setOtpSent(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[2rem] font-bold transition-all ${activeTab === 'inst' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Building2 size={18} /> Profissional
            </button>
            <button 
              onClick={() => { setActiveTab('pat'); setOtpSent(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[2rem] font-bold transition-all ${activeTab === 'pat' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <UserIcon size={18} /> Cidadão
            </button>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleInviteCTA}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              <Ticket size={16} /> Recebi um convite
            </button>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'inst' ? (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight text-center">Acesso Profissional</h2>
                </div>

                <form onSubmit={handleInstitutionalLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Profissional</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="exemplo@instituicao.gov.br" 
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-end px-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Senha</label>
                      <button 
                        type="button" 
                        onClick={() => navigate('/forgot?tab=inst')} 
                        className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-widest"
                      >
                        Esqueci a senha
                      </button>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? <RefreshCw className="animate-spin" size={20} /> : 'Entrar no Sistema'}
                  </button>
                </form>

                <div className="flex items-center gap-4 py-2">
                  <div className="h-[1px] bg-slate-200 flex-1"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Autenticação Federada</span>
                  <div className="h-[1px] bg-slate-200 flex-1"></div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <button onClick={() => openModal('SocialAuthModal', { provider: 'Google' })} className="py-6 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-3 hover:bg-slate-50 transition-colors shadow-sm">
                    <GoogleIcon />
                  </button>
                  <button onClick={() => openModal('SocialAuthModal', { provider: 'Apple' })} className="py-6 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-3 hover:bg-slate-50 transition-colors shadow-sm text-slate-900">
                    <AppleIcon />
                  </button>
                  <button onClick={() => openModal('SocialAuthModal', { provider: 'GovBr' })} className="py-6 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-3 hover:bg-slate-50 transition-colors shadow-sm">
                    <GovBrIcon />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight text-center">Identificação Cidadã</h2>
                  <p className="text-slate-500 text-center text-sm">Acesse seus dados e autorize compartilhamentos.</p>
                </div>

                <form onSubmit={handlePatientLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">CPF ou Email</label>
                    <div className="relative">
                      <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input 
                        type="text" 
                        placeholder="000.000.000-00 ou seu-email@exemplo.com"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-end px-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Senha</label>
                      <button 
                        type="button" 
                        onClick={() => navigate('/forgot?tab=patient')} 
                        className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-widest"
                      >
                        Esqueci a senha
                      </button>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? <RefreshCw className="animate-spin" size={20} /> : 'Entrar no Sistema'}
                  </button>
                </form>

                <div className="flex items-center gap-4 py-2">
                  <div className="h-[1px] bg-slate-200 flex-1"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Ou continuar com</span>
                  <div className="h-[1px] bg-slate-200 flex-1"></div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <button onClick={() => openModal('SocialAuthModal', { provider: 'Google' })} className="py-6 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-3 hover:bg-slate-50 transition-colors shadow-sm">
                    <GoogleIcon />
                  </button>
                  <button onClick={() => openModal('SocialAuthModal', { provider: 'Apple' })} className="py-6 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-3 hover:bg-slate-50 transition-colors shadow-sm text-slate-900">
                    <AppleIcon />
                  </button>
                  <button onClick={() => openModal('SocialAuthModal', { provider: 'GovBr' })} className="py-6 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-3 hover:bg-slate-50 transition-colors shadow-sm">
                    <GovBrIcon />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <button onClick={() => navigate('/help')} className="hover:text-slate-600">Suporte</button>
          </div>

        </div>
      </div>
    </div>
  );
};

const RefreshCw = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
  </svg>
);
