
import React from 'react';
import { HelpCircle, Search, Book, MessageCircle, FileText, ArrowRight, PlayCircle, Home, Mail, ShieldCheck as ShieldCheckIcon, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CuidiLogo } from '../../components/ui/CuidiLogo';

export const HelpCenterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}> 
            <CuidiLogo size={80} />
            <span className="text-xl font-extrabold tracking-tight text-slate-900">Portal CUIDI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Voltar ao Início</button>
          </div>
          <button className="md:hidden p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </div>
      </nav>
      {/* Conteúdo centralizado, sem menu lateral */}
      <header className="pt-48 pb-20 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50 -skew-x-12 origin-top -z-10 translate-x-20"></div>
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
              <HelpCircle size={14} /> Central de Ajuda CUIDI
            </div>
            <h1 className="text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1]">
              Suporte, Governança e Integração Federada
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl">
              Encontre informações técnicas, orientações de uso e suporte institucional sobre integração, governança federada e sustentabilidade de dados em saúde.
            </p>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
              { 
                title: 'Primeiros Passos', 
                icon: <PlayCircle className="text-blue-500" size={32}/>, 
                desc: 'Guia para ativação institucional e primeiros acessos à plataforma.',
                articles: 5
              },
              { 
                title: 'Manuais de Uso', 
                icon: <Book className="text-indigo-500" size={32}/>, 
                desc: 'Orientações para profissionais, gestores e pacientes sobre as principais funcionalidades.',
                articles: 12
              },
              { 
                title: 'Conformidade LGPD', 
                icon: <ShieldCheckIcon className="text-emerald-500" size={32}/>, 
                desc: 'Saiba como a CUIDI garante a proteção e soberania dos dados conforme a legislação.',
                articles: 8
              },
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-[2rem] border border-slate-200 hover:shadow-lg transition-all cursor-pointer group">
               <div className="mb-6">{item.icon}</div>
               <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
               <p className="text-[12px] font-bold text-slate-400 mb-4 uppercase tracking-widest">{item.articles} artigos</p>
               <p className="text-slate-500 text-sm leading-relaxed mb-6">{item.desc}</p>
               <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">Ver Artigos <ArrowRight size={14}/></button>
            </div>
          ))}
        </div>
        {/* FAQ Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-slate-900">Perguntas Frequentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: 'Como criar um nó na federação?', a: 'Solicite um token institucional junto à equipe CUIDI. O processo segue critérios técnicos e de conformidade.' },
              { q: 'Como exportar dados dos pacientes?', a: 'Os dados podem ser exportados em formatos compatíveis com padrões nacionais e internacionais. Consulte o manual técnico.' },
              { q: 'Qual é o SLA de disponibilidade?', a: 'A plataforma opera com alta disponibilidade e monitoramento contínuo. Consulte o status em tempo real.' },
              { q: 'Como reportar um incidente de segurança?', a: 'Envie um relatório detalhado para security@cuidi.gov.br. Incidentes são tratados com prioridade e confidencialidade.' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                <h4 className="font-bold text-slate-900 mb-2 text-sm">{item.q}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Support Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-12">
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <MessageCircle className="text-blue-600" size={48} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Ainda precisa de suporte?</h3>
              <p className="text-slate-600 font-medium">Entre em contato com a equipe CUIDI para dúvidas técnicas, integração ou governança de dados.</p>
            </div>
            <button onClick={() => navigate('/contact')} className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
              <Mail size={18} />
              Contatar Suporte
            </button>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center text-sm font-medium text-slate-400">
          <p>© 2026 CUIDI - Integração Digital de Informações em Processos de Saúde</p>
        </div>
      </footer>
    </div>
  );
};
