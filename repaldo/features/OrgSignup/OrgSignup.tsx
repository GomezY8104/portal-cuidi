
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { UserRole } from '../../types';
import { CuidiLogo } from '../../components/ui/CuidiLogo';
import { 
  Shield, ArrowLeft, Building2, MapPin, CheckCircle, 
  Info, User, Mail, ChevronRight, Lock, FileText,
  AlertTriangle, Globe, HelpCircle
} from 'lucide-react';

/**
 * P3: Cadastro de Novo Nó Federado (/org-signup)
 * Esta página permite que um administrador institucional (NODE_ADMIN) 
 * registre sua unidade na rede federada CUIDI usando um token de autorização.
 */
export const OrgSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, openModal } = useAppStore();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Estado do formulário de adesão
  const [formData, setFormData] = useState({
    token: '',
    orgName: '',
    orgType: 'HOSPITAL',
    territory: 'SP',
    adminName: '',
    adminEmail: '',
    agreed: false
  });

  // Validação de passos e lógica de negócio mock
  const handleNext = () => {
    if (step === 1) {
      // Regra de Ouro: Token deve ser válido. No mock aceitamos 'NODE-2024-TEST'
      if (formData.token !== 'NODE-2024-TEST') {
        openModal('HelpTokenModal'); // Abre modal de orientação se falhar
        return;
      }
    }
    if (step < 4) setStep(step + 1);
    else finishSignup();
  };

  // Finalização do fluxo: cria org e loga como admin do nó
  const finishSignup = () => {
    setLoading(true);
    setTimeout(() => {
      const newNodeAdmin = {
        id: 'node-admin-' + Math.random(),
        name: formData.adminName,
        email: formData.adminEmail,
        role: UserRole.NODE_ADMIN,
        orgId: 'new-org-id',
        nodeName: formData.orgName
      };
      setUser(newNodeAdmin);
      setLoading(false);
      navigate('/node-admin');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 lg:p-12 relative overflow-hidden">
      {/* Background Decorativo SUS */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-slate-900 -z-10">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>
      
      {/* Header do Cadastro */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-12 text-white">
        <button 
          onClick={() => navigate('/login')} 
          className="flex items-center gap-2 hover:text-blue-400 font-bold transition-all text-sm uppercase tracking-widest"
        >
           <ArrowLeft size={18} /> Voltar ao Login
        </button>
        <div className="flex gap-3">
          {[1,2,3,4].map(s => (
            <div key={s} className={`h-2 w-16 rounded-full transition-all duration-500 ${s <= step ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/20'}`}></div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-[3.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="p-10 lg:p-16">
          
          <div className="flex justify-center mb-10">
            <CuidiLogo size={140} />
          </div>

          {/* PASSO 1: VALIDAÇÃO DE TOKEN */}
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="text-center">
                <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Validar Autorização</h1>
                <p className="text-slate-500 text-lg">Insira o token emitido pelo Gestor Territorial para iniciar o nó federado.</p>
              </div>
              
              <div className="space-y-4">
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={24} />
                  <input 
                    type="text" 
                    value={formData.token}
                    onChange={(e) => setFormData({...formData, token: e.target.value.toUpperCase()})}
                    placeholder="NODE-XXXX-XXXX" 
                    className="w-full pl-16 pr-6 py-6 rounded-3xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 outline-none text-2xl font-mono text-center tracking-[0.2em] uppercase transition-all"
                  />
                </div>
                <button 
                  onClick={() => openModal('HelpTokenModal')}
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest"
                >
                  <HelpCircle size={14} /> Não possui um token de acesso?
                </button>
              </div>
            </div>
          )}

          {/* PASSO 2: DETALHES DA INSTITUIÇÃO */}
          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner"><Building2 size={32} /></div>
                <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Dados da Unidade</h1>
                <p className="text-slate-500 text-lg">Como o seu nó será identificado na rede nacional.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome Oficial (CNES)</label>
                  <input 
                    type="text" 
                    value={formData.orgName}
                    onChange={(e) => setFormData({...formData, orgName: e.target.value})}
                    placeholder="Ex: Hospital Municipal Sul" 
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-semibold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tipo de Unidade</label>
                  <select 
                    value={formData.orgType}
                    onChange={(e) => setFormData({...formData, orgType: e.target.value})}
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold"
                  >
                    <option value="HOSPITAL">Hospital</option>
                    <option value="UBS">APS / UBS</option>
                    <option value="UPA">UPA / Urgência</option>
                    <option value="REG">Central de Regulação</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Território (UF)</label>
                  <input 
                    type="text" 
                    value={formData.territory}
                    onChange={(e) => setFormData({...formData, territory: e.target.value.toUpperCase()})}
                    maxLength={2}
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASSO 3: ADMINISTRADOR RESPONSÁVEL */}
          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner"><User size={32} /></div>
                <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Administrador do Nó</h1>
                <p className="text-slate-500 text-lg">Responsável legal pelas políticas e governança de dados.</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome Completo</label>
                  <input 
                    type="text" 
                    value={formData.adminName}
                    onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                    placeholder="Nome do Responsável Técnico" 
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Institucional Corporativo</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                      type="email" 
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                      placeholder="admin@unidade.gov.br" 
                      className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASSO 4: TERMOS E COMPLIANCE */}
          {step === 4 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner"><FileText size={32} /></div>
                <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Soberania e Termos</h1>
                <p className="text-slate-500 text-lg">Compromisso com a privacidade e o cidadão.</p>
              </div>
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200 max-h-60 overflow-y-auto space-y-4 text-sm font-medium text-slate-700 leading-relaxed">
                <p><strong>1. Governança Ativa:</strong> O nó concorda em implementar o motor determinístico CUIDI para validação de consentimentos em tempo real.</p>
                <p><strong>2. Transparência:</strong> Toda leitura de dado clínico será registrada no ledger imutável, acessível para auditoria e para o paciente.</p>
                <p><strong>3. Responsabilidade:</strong> O administrador do nó responde pela autenticidade dos dados compartilhados na rede federada.</p>
              </div>
              <label className="flex items-center gap-4 cursor-pointer group p-5 bg-blue-50/50 rounded-2xl border-2 border-blue-100 transition-all hover:bg-blue-50">
                <input 
                  type="checkbox" 
                  checked={formData.agreed}
                  onChange={(e) => setFormData({...formData, agreed: e.target.checked})}
                  className="w-6 h-6 rounded-lg border-blue-300 text-blue-600 focus:ring-blue-500 transition-all" 
                />
                <span className="text-sm font-black text-blue-900">Confirmo as responsabilidades legais de Administrador do Nó Federado.</span>
              </label>
            </div>
          )}

          {/* Ações do Wizard */}
          <div className="mt-16 flex flex-col md:flex-row items-center gap-6">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="w-full md:w-auto px-10 py-5 text-slate-500 font-bold hover:bg-slate-100 rounded-3xl transition-all uppercase text-xs tracking-widest"
              >
                Anterior
              </button>
            )}
            <button 
              onClick={handleNext}
              className={`flex-1 w-full py-6 rounded-3xl font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] ${
                step === 4 && !formData.agreed ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
              }`}
              disabled={loading || (step === 4 && !formData.agreed)}
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white animate-spin rounded-full"></div>
              ) : (
                <>
                  {step === 4 ? 'Ativar Nó Federado' : 'Próximo Passo'}
                  <ChevronRight size={24} />
                </>
              )}
            </button>
          </div>

          {step === 1 && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => navigate('/invite/TESTTOKEN')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Testar convite
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 flex items-center gap-10 text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
        <div className="flex items-center gap-2"><Globe size={14} /> Federação SUS</div>
        <div className="flex items-center gap-2"><Shield size={14} /> Auditoria Ledger</div>
        <div className="flex items-center gap-2">Soberania Digital</div>
      </div>
    </div>
  );
};
