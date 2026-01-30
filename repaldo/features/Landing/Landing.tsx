
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
  const openDrawer = useAppStore(s => s.openDrawer);

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <CuidiLogo size={80} />
            <span className="text-xl font-extrabold tracking-tight text-slate-900">Portal CUIDI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/about')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Sobre nós</button>
            <button onClick={() => navigate('/how-it-works')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">A Federação</button>
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
              <ShieldCheck size={14} /> Sistema Federado SUS
            </div>
            <h1 className="text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1]">
              Sua Saúde, Seus Dados, <span className="text-blue-600">Nossa Federação.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-xl">
              Uma infraestrutura moderna de regulação assistencial focada em interoperabilidade segura, governança ativa e soberania total do paciente sobre seus dados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => navigate('/login')}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group"
              >
                Começar agora <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/org-signup')}
                className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all"
              >
                Cadastrar Instituição
              </button>
            </div>
          </div>
          <div className="relative animate-in zoom-in duration-1000 delay-200">
            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 rotate-3 hover:rotate-0 transition-transform duration-500 relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center"><CuidiLogo size={60} /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Governança em Tempo Real</p>
                    <p className="text-xs text-slate-400">Ledger Verificado • 100% LGPD</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-green-500">CONECTADO</span>
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse"></div>
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
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Arquitetura de Próxima Geração</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Desenvolvido com tecnologia de ponta para garantir que a regulação assistencial seja ágil, transparente e segura.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: <Database className="text-blue-600" size={32} />, 
                title: 'Sharing Ledger', 
                desc: 'Todo acesso aos dados é registrado de forma imutável e auditável em tempo real.' 
              },
              { 
                icon: <Lock className="text-blue-600" size={32} />, 
                title: 'Governança Federada', 
                desc: 'Políticas distribuídas por nó permitem soberania local com interoperabilidade nacional.' 
              },
              { 
                icon: <Search className="text-blue-600" size={32} />, 
                title: 'Busca Federada', 
                desc: 'Localize documentos clínicos em toda a rede respeitando os níveis de consentimento.' 
              },
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

      {/* Footer Atualizado */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <CuidiLogo size={70} />
                <span className="text-xl font-extrabold tracking-tight text-slate-900">Portal CUIDI</span>
              </div>
              <p className="text-slate-500 max-w-sm leading-relaxed">
                Plataforma de regulação federada. Conectando o SUS através da transparência e inovação tecnológica.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Sistema</h4>
              <ul className="space-y-4 text-slate-600 text-sm">
                <li><button onClick={() => navigate('/about')} className="hover:text-blue-600">Sobre nós</button></li>
                <li><button onClick={() => navigate('/how-it-works')} className="hover:text-blue-600">Como funciona</button></li>
                <li><button onClick={() => navigate('/api-docs')} className="hover:text-blue-600">Documentação API</button></li>
                <li><button onClick={() => navigate('/network-status')} className="hover:text-blue-600">Status da Rede</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Suporte</h4>
              <ul className="space-y-4 text-slate-600 text-sm">
                <li><button onClick={() => navigate('/help')} className="hover:text-blue-600">Central de Ajuda</button></li>
                <li><button onClick={() => navigate('/terms')} className="hover:text-blue-600">Termos de Uso</button></li>
                <li><button onClick={() => navigate('/privacy')} className="hover:text-blue-600">Política de Privacidade</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-blue-600">Contato</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <p>© 2026 Portal CUIDI - Governança Federada de Dados.</p>
            <div className="flex gap-8">
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
