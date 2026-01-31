import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Globe, Database, Users, 
  ArrowRight, CheckCircle, Lock, Server, 
  Layers, Search, FileText, Menu, X
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CuidiLogo } from '../../components/ui/CuidiLogo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  // Siempre limpiar la sesión al entrar a la landing
  React.useEffect(() => {
    localStorage.removeItem('cuidi_user_session');
  }, []);
  const openDrawer = useAppStore(s => s.openDrawer);

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <CuidiLogo size={80} />
            <span className="text-xl font-extrabold tracking-tight text-slate-900">CUIDI: Integração Digital de Informações em Processos de Saúde</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/about')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Sobre o Projeto</button>
            <button onClick={() => navigate('/how-it-works')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Como Funciona</button>
            <button onClick={() => navigate('/privacy')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Privacidade & LGPD</button>
            <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
            <button 
              onClick={() => navigate('/login?tab=patient')}
              className="text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              Portal do Paciente
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-lg hover:-translate-y-0.5"
            >
              Acesso Restrito
            </button>
          </div>

          <button className="md:hidden p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-12 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50 -skew-x-12 origin-top -z-10 translate-x-20"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
              <ShieldCheck size={14} /> Integração Digital em Saúde
            </div>
            <h1 className="text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1]">
              Integração, Governança e Soberania de Dados em Saúde
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-xl">
              O projeto CUIDI propõe uma solução objetiva para integração e síntese de dados em saúde, baseada em arquitetura federativa, interoperabilidade, conformidade regulatória e apoio à gestão clínica e administrativa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => navigate('/login')}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group"
              >
                Acessar Plataforma <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/org-signup')}
                className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all"
              >
                Solicitar Integração Institucional
              </button>
            </div>
          </div>
          <div className="relative animate-in zoom-in duration-1000 delay-200">
            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 rotate-3 hover:rotate-0 transition-transform duration-500 relative z-10 overflow-visible">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 flex items-center justify-center bg-white rounded-full shadow-lg overflow-visible">
                    <CuidiLogo size={80} />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900 animate-pulse">Governança em Tempo Real</p>
                    <p className="text-xs text-slate-400 animate-fade-in-up">Ledger Verificado • 100% LGPD</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-green-500 animate-fade-in">CONECTADO</span>
                </div>
              </div>
              <div className="space-y-4">
                {["Transações auditadas em tempo real", "Consentimentos sob governança federada", "Rastreabilidade completa de acessos"].map((txt, i) => (
                  <div key={i} className="h-12 bg-slate-50 rounded-xl flex items-center px-6 text-slate-700 font-bold text-base animate-in fade-in slide-in-from-bottom-4 duration-700" style={{animationDelay: `${300 + i * 200}ms`}}>
                    <span className="animate-pulse">{txt}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-full h-full bg-blue-600/10 rounded-[2rem] -z-0 -rotate-3"></div>
          </div>
        </div>
      </header>

      {/* Feature Section */}
      <section id="solucoes" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Integração, Governança e Eficiência</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">A CUIDI oferece um espaço de dados federativo, interoperável e seguro, com orquestração inteligente e conformidade regulatória, promovendo eficiência clínica e administrativa.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
                { icon: <Database className="text-blue-600" size={32} />, title: 'Registro Imutável', desc: 'Todos os acessos e operações são registrados de forma auditável e transparente.' },
                { icon: <Lock className="text-blue-600" size={32} />, title: 'Governança Federada', desc: 'Políticas distribuídas por instituição, com soberania dos dados e interoperabilidade.' },
                { icon: <Search className="text-blue-600" size={32} />, title: 'Busca Federada', desc: 'Localize e integre informações clínicas em múltiplos sistemas, respeitando consentimentos e políticas.' },
            ].map((f, i) => (
              <div key={i} className="p-10 bg-white rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100 transition-all group">
                <div className="mb-6 group-hover:scale-110 transition-transform origin-left">{f.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed mb-6">{f.desc}</p>
                <button 
                  onClick={() => navigate('/api-docs')}
                  className="text-sm font-bold text-blue-600 flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Saiba mais <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer tipo mega-menu */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-white">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <CuidiLogo size={54} />
              <span className="text-2xl font-extrabold">Portal CUIDI</span>
            </div>
            <p className="text-slate-300 text-base max-w-xs mb-2">Plataforma nacional de integração, governança e transparência de dados em saúde para o SUS.</p>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">Plataforma</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/about')} className="hover:underline text-left">Sobre o CUIDI</button></li>
              <li><button onClick={() => { window.location.hash = '#/how-it-works'; }} className="hover:underline text-left">Como Funciona</button></li>
              <li><button onClick={() => navigate('/changelog')} className="hover:underline text-left">Novidades e Versões</button></li>
              <li><button onClick={() => navigate('/api-docs')} className="hover:underline text-left">API para Desenvolvedores</button></li>
              <li><button onClick={() => navigate('/network-status')} className="hover:underline text-left">Status da Rede</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">Transparência</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/terms')} className="hover:underline text-left">Termos de Uso</button></li>
              <li><button onClick={() => navigate('/privacy')} className="hover:underline text-left">Privacidade & LGPD</button></li>
              <li><button onClick={() => { window.location.hash = '#/help'; }} className="hover:underline text-left">Canal de Suporte</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-6 flex flex-col md:flex-row items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-widest">
          <span>© 2026 CUIDI. Todos os direitos reservados.</span>
        </div>
      </footer>
    </div>
  );
};
