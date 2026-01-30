
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Mail, CheckCircle, AlertCircle, 
  RefreshCw, User as UserIcon, Building2, Fingerprint, 
  Smartphone, Info 
} from 'lucide-react';
import { CuidiLogo } from '../../components/ui/CuidiLogo';

/**
 * Página 2: Recuperação de Acesso (/forgot)
 * Unificada para Institucional e Paciente com suporte ao Logo Oficial.
 */
export const ForgotPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Tabs: 'inst' (Institucional) | 'pat' (Paciente)
  const initialTab = searchParams.get('tab') === 'patient' ? 'pat' : 'inst';
  const [activeTab, setActiveTab] = useState<'inst' | 'pat'>(initialTab);
  
  // Sub-métodos para paciente
  const [patientMethod, setPatientMethod] = useState<'cpf' | 'email'>('cpf');
  
  // Estados de formulário
  const [inputValue, setInputValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleTab = (tab: 'inst' | 'pat') => {
    setActiveTab(tab);
    setIsSubmitted(false);
    setInputValue('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;

    setLoading(true);
    // Simulação de governança e envio de token/SMS
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Hero Background */}
      <div className={`absolute top-0 left-0 w-full h-1/2 transition-all duration-1000 -z-10 ${activeTab === 'inst' ? 'bg-slate-900' : 'bg-blue-900'}`}>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>
      
      <div className="w-full max-w-xl bg-white rounded-[3.5rem] shadow-2xl shadow-black/30 overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-500">
        <div className="p-10 lg:p-14">
          
          {/* Official CUIDI Branding */}
          <div className="flex flex-col items-center text-center mb-10">
            <CuidiLogo size={160} className="mb-6 hover:scale-105 transition-transform cursor-pointer" />
            
            {!isSubmitted ? (
              <>
                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Recuperar Acesso</h1>
                <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium">
                  {activeTab === 'inst' 
                    ? 'Identifique seu nó institucional para redefinir credenciais.' 
                    : 'Acesse seu histórico de saúde através da verificação de identidade.'}
                </p>
              </>
            ) : (
              <div className="animate-in slide-in-from-top-4 duration-500">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner">
                  <CheckCircle size={40} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Instruções Enviadas</h1>
                <p className="text-slate-500 text-sm font-medium">Validamos sua identidade na rede. Verifique seu e-mail ou celular.</p>
              </div>
            )}
          </div>

          {!isSubmitted ? (
            <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
              
              {/* Profile Selector Tabs */}
              <div className="flex bg-slate-100 p-2 rounded-2xl border border-slate-200 shadow-inner">
                <button 
                  onClick={() => handleToggleTab('inst')}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all text-xs uppercase tracking-widest ${activeTab === 'inst' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <Building2 size={16} /> Profissional
                </button>
                <button 
                  onClick={() => handleToggleTab('pat')}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all text-xs uppercase tracking-widest ${activeTab === 'pat' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <UserIcon size={16} /> Cidadão
                </button>
              </div>

              {/* Sub-methods Patient Only */}
              {activeTab === 'pat' && (
                <div className="flex gap-2 p-1 bg-blue-50/50 rounded-xl border border-blue-100/50">
                  <button 
                    onClick={() => { setPatientMethod('cpf'); setInputValue(''); }}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${patientMethod === 'cpf' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-400 hover:bg-blue-50'}`}
                  >
                    Via CPF
                  </button>
                  <button 
                    onClick={() => { setPatientMethod('email'); setInputValue(''); }}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${patientMethod === 'email' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-400 hover:bg-blue-50'}`}
                  >
                    Via E-mail
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    {activeTab === 'inst' ? 'E-mail Institucional' : patientMethod === 'cpf' ? 'Número do CPF' : 'E-mail Cadastrado'}
                  </label>
                  <div className="relative group">
                    {activeTab === 'inst' || (activeTab === 'pat' && patientMethod === 'email') ? (
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                    ) : (
                      <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                    )}
                    <input 
                      type={patientMethod === 'cpf' && activeTab === 'pat' ? 'text' : 'email'} 
                      required
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={activeTab === 'inst' ? 'admin@hospital.gov.br' : patientMethod === 'cpf' ? '000.000.000-00' : 'seu-email@provedor.com'} 
                      className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border-2 border-slate-100 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-semibold text-slate-900 bg-slate-50/50"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className={`w-full py-5 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 ${activeTab === 'inst' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'}`}
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={20} />
                  ) : (
                    <>
                      {activeTab === 'inst' ? 'Solicitar Redefinição Profissional' : 'Recuperar Acesso do Cidadão'}
                    </>
                  )}
                </button>
                
                <div className={`p-6 rounded-2xl border flex gap-4 text-xs transition-colors shadow-sm ${activeTab === 'inst' ? 'bg-blue-50 border-blue-100 text-blue-800' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                  {activeTab === 'inst' ? (
                    <AlertCircle size={24} className="shrink-0 text-blue-600" />
                  ) : (
                    <Smartphone size={24} className="shrink-0 text-slate-400" />
                  )}
                  <p className="leading-relaxed font-medium">
                    {activeTab === 'inst' 
                      ? 'O link de redefinição só será enviado para domínios governamentais (.gov.br) ou e-mails corporativos previamente autorizados no nó federado.' 
                      : 'Um código de verificação seguro será enviado via SMS para o celular vinculado ao seu CPF no Sistema Único de Saúde.'}
                  </p>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 relative overflow-hidden shadow-inner">
                <div className="absolute top-0 right-0 p-6 opacity-5"><Info size={100} /></div>
                <p className="text-base text-slate-600 leading-relaxed text-center font-bold italic">
                  "As instruções de segurança foram enviadas para <strong>{inputValue}</strong>. Caso não receba em 5 minutos, procure a Unidade de Saúde mais próxima."
                </p>
              </div>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="w-full py-4 text-blue-600 font-black hover:bg-blue-50 rounded-2xl transition-all text-xs uppercase tracking-widest border border-transparent hover:border-blue-100"
              >
                Não recebeu o código? Tentar novamente
              </button>
            </div>
          )}

          <div className="mt-14 pt-8 border-t border-slate-100">
            <button 
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-3 text-slate-400 hover:text-blue-600 font-black transition-all text-xs uppercase tracking-[0.2em] group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Voltar para o portal de login
            </button>
          </div>
        </div>
      </div>

      {/* Institutional Footer */}
      <div className="mt-12 flex flex-col items-center gap-4 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] relative z-10">
        <div className="flex items-center gap-8">
          <span className="hover:text-white cursor-pointer transition-colors">Transparência SUS</span>
          <span className="w-2 h-2 bg-white/20 rounded-full"></span>
          <span className="hover:text-white cursor-pointer transition-colors">Suporte Federado</span>
          <span className="w-2 h-2 bg-white/20 rounded-full"></span>
          <span className="hover:text-white cursor-pointer transition-colors">LGPD Compliance</span>
        </div>
        <p className="opacity-20">PLATAFORMA CUIDI • MINISTÉRIO DA SAÚDE • GOVERNO FEDERAL</p>
      </div>
    </div>
  );
};
