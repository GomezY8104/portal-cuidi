import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CuidiLogo } from '../../components/ui/CuidiLogo';
import { 
  HelpCircle, ShieldCheck, Globe, Database, Users, 
  ArrowRight, CheckCircle, Lock, Server, Layers, FileText, Search, Menu
} from 'lucide-react';

// Página "Como funciona" — estilo igual ao Landing, dirigida a usuários finais
export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar (igual à Landing) */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}> 
            <CuidiLogo size={80} />
            <span className="text-xl font-extrabold tracking-tight text-slate-900">Portal CUIDI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/about')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Sobre nós</button>
            <button onClick={() => navigate('/privacy')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Privacidade & LGPD</button>
            <button onClick={() => navigate('/help')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Centro de Ajuda</button>
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
              Entrar
            </button>
          </div>
          <button className="md:hidden p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Hero explicativo */}
      <header className="pt-48 pb-20 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50 -skew-x-12 origin-top -z-10 translate-x-20"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
              <HelpCircle size={14} /> Integração Digital em Saúde
            </div>
            <h1 className="text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1]">
              Integração, Governança e Soberania de Dados
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl">
              O CUIDI é uma solução para integração e síntese de dados em saúde, estruturada como espaço de dados federativo, com governança, interoperabilidade e conformidade regulatória. O sistema permite a gestão de dados clínicos e administrativos, respeitando a soberania institucional e a privacidade do paciente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group">
                Entrar no Portal <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/privacy')} className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                Privacidade & LGPD
              </button>
            </div>
          </div>
          <div className="relative">
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

      {/* Seções dirigidas a usuários */}
      <main className="max-w-7xl mx-auto px-6 pb-24 space-y-20">
        {/* 1. O que você faz aqui */}
        <section className="grid md:grid-cols-3 gap-8">
          {[{
            title: 'Paciente',
            desc: 'Acesse seu histórico, gerencie consentimentos e autorize acessos conforme a LGPD.',
            items: ['Histórico Clínico', 'Solicitações', 'Consentimentos', 'Acessos Restritos'],
            action: () => navigate('/login?tab=patient')
          }, {
            title: 'Profissional de Saúde',
            desc: 'Regule casos, localize documentos federados e solicite dados ao paciente de forma segura.',
            items: ['Fila de Regulação', 'Localizar Documentos', 'Solicitar Documento', 'Solicitar Acesso Restrito'],
            action: () => navigate('/login')
          }, {
            title: 'Administrador',
            desc: 'Gerencie usuários, políticas institucionais e auditoria conforme as normas de governança.',
            items: ['Usuários do Nó', 'Políticas Locais', 'Auditoria', 'Relatórios'],
            action: () => navigate('/login')
          }].map((card, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-2">{card.title}</h3>
              <p className="text-slate-600 text-sm mb-4">{card.desc}</p>
              <ul className="space-y-2 mb-6">
                {card.items.map(it => (
                  <li key={it} className="flex items-center gap-2 text-sm font-bold text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> {it}</li>
                ))}
              </ul>
              <button onClick={card.action} className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Acessar</button>
            </div>
          ))}
        </section>

        {/* 2. Como garantimos segurança (LGPD + Governança) */}
        <section className="bg-slate-50 border border-slate-100 rounded-[2rem] p-10 grid md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              <ShieldCheck size={14}/> LGPD & Consentimentos
            </div>
            <p className="text-slate-600 text-sm">O acesso a dados pessoais exige consentimento ativo do paciente, finalidade definida e papel autorizado. O paciente controla quem acessa seus dados e pode revogar permissões a qualquer momento.</p>
            <button onClick={() => navigate('/privacy')} className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Ver Política</button>
          </div>
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
              <Layers size={14}/> Políticas por Instituição
            </div>
            <p className="text-slate-600 text-sm">Cada instituição define políticas locais de acesso conforme seu perfil e necessidades. A federação respeita o escopo permitido e a vigência das políticas institucionais.</p>
            <button onClick={() => navigate('/federation/policies')} className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Ver Políticas</button>
          </div>
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
              <Server size={14}/> Ledger & Auditoria
            </div>
            <p className="text-slate-600 text-sm">Todas as ações críticas geram eventos em ledger e auditoria, com rastreabilidade total. O paciente pode auditar acessos e exportar relatórios de conformidade.</p>
            <button onClick={() => navigate('/reports')} className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Ver Relatórios</button>
          </div>
        </section>

        {/* 3. Busca Federada de Documentos */}
        <section className="grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-black text-slate-900">Busca Federada</h3>
            <p className="text-slate-600 text-sm">Localize documentos clínicos em instituições federadas respeitando governança e consentimentos. Metadados são visíveis; o acesso completo depende de aprovação e conformidade.</p>
            <button onClick={() => navigate('/help')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Ver como usar</button>
          </div>
          <div className="bg-slate-900 text-blue-400 p-10 rounded-[2rem] font-mono text-sm overflow-hidden relative shadow-2xl">
            <div className="flex items-center gap-2 text-slate-500 mb-6 border-b border-slate-800 pb-4">
              <Search size={14}/> <span>FEDERATED SEARCH</span>
            </div>
            <pre className="text-xs text-white">
{`// Exemplo: localizar por paciente
actor: REGULATOR@org-123
purpose: continuity_of_care
requestedScope: metadata
→ Governance: APPROVED (metadata)
→ Ledger: event recorded
`}
            </pre>
          </div>
        </section>

        {/* 4. Chamada final */}
        <section className="text-center space-y-6">
          <h3 className="text-2xl font-black text-slate-900">Pronto para começar?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group">
              Entrar <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/help')} className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
              Centro de Ajuda
            </button>
          </div>
        </section>
      </main>

      {/* Footer simples */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-widest">
          <p>© 2026 CUIDI - Integração Digital de Informações em Processos de Saúde</p>
          <div className="flex gap-8">
            <span className="text-slate-500">BRASIL</span>
            <span className="text-slate-500">SUS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
