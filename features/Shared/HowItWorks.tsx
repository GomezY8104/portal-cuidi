import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CuidiLogo } from '../../components/ui/CuidiLogo';
import { 
  HelpCircle, ArrowRight, Menu, User, FileText, Lock, ShieldCheck, 
  Heart, Calendar, Bell, Search, CheckCircle, Eye, Clock, ChevronLeft, ChevronRight, Layers, Server
} from 'lucide-react';

interface Slide {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

const patientSlides: Slide[] = [
  {
    icon: <User className="text-blue-600" size={64} />,
    title: "Seu portal pessoal de saúde",
    description: "Acesse seu histórico clínico, controle consentimentos e acompanhe acessos, com privacidade e transparência.",
    features: [
      "Histórico completo de consultas e procedimentos",
      "Exames e resultados de laboratório",
      "Prescrições e receituário médico",
      "Acesso 24/7 de qualquer dispositivo"
    ]
  },
  {
    icon: <Lock className="text-emerald-600" size={64} />,
    title: "Você controla seus dados",
    description: "Gerencie quem pode acessar suas informações de saúde conforme a LGPD. Defina finalidades, prazos e revogue consentimentos a qualquer momento.",
    features: [
      "Criar e revogar consentimentos a qualquer momento",
      "Definir finalidade e prazo de validade",
      "Aprovar ou negar solicitações de acesso",
      "Total transparência e auditoria"
    ]
  },
  {
    icon: <Eye className="text-indigo-600" size={64} />,
    title: "Rastreie cada acesso",
    description: "Visualize todos os acessos realizados aos seus dados, com registro detalhado e auditoria permanente.",
    features: [
      "Registro completo de todos os acessos",
      "Notificações em tempo real",
      "Histórico permanente e imutável",
      "Relatórios de auditoria detalhados"
    ]
  },
  {
    icon: <Heart className="text-rose-600" size={64} />,
    title: "Perfil de emergência",
    description: "Informações essenciais disponíveis para atendimento de urgência, respeitando privacidade e governança.",
    features: [
      "Alergias e condições médicas importantes",
      "Contatos de emergência",
      "Tipo sanguíneo e medicações em uso",
      "Acesso rápido em situações críticas"
    ]
  }
];

const professionalSlides: Slide[] = [
  {
    icon: <Search className="text-blue-600" size={64} />,
    title: "Busca federada de documentos",
    description: "Localize informações clínicas em toda a rede federada, respeitando políticas institucionais e consentimentos.",
    features: [
      "Pesquisa por CPF em nós federados",
      "Visualização de metadados sem consentimento",
      "Acesso ao conteúdo mediante aprovação",
      "Integração com seu prontuário local"
    ]
  },
  {
    icon: <FileText className="text-emerald-600" size={64} />,
    title: "Solicite documentos ao paciente",
    description: "Solicite acesso a exames e documentos de forma transparente, com registro e aprovação do paciente.",
    features: [
      "Solicitação formal com justificativa",
      "Paciente recebe notificação e decide",
      "Prazos de validade configuráveis",
      "Registro completo da interação"
    ]
  },
  {
    icon: <ShieldCheck className="text-indigo-600" size={64} />,
    title: "Políticas e governança",
    description: "Cada acesso é validado por políticas institucionais e consentimentos, garantindo conformidade e rastreabilidade.",
    features: [
      "Controle por papel e organização",
      "Finalidade clínica obrigatória",
      "Obrigações de retenção e masking",
      "Auditoria em ledger imutável"
    ]
  },
  {
    icon: <Clock className="text-rose-600" size={64} />,
    title: "Continuidade assistencial",
    description: "Acesse o histórico necessário para apoiar o cuidado ao paciente, com visão longitudinal e integração federada.",
    features: [
      "Visão longitudinal do cuidado",
      "Timeline de eventos clínicos",
      "Integração com telemedicina",
      "Suporte a regulação e encaminhamentos"
    ]
  }
];

// Novo workflow para o usuário
const workflowCards = [
  {
    icon: <ShieldCheck className="text-blue-600" size={48} />,
    title: 'Governança Federada',
    desc: 'Acesso e compartilhamento de dados são regidos por políticas institucionais e consentimentos, garantindo soberania e rastreabilidade.'
  },
  {
    icon: <Layers className="text-emerald-600" size={48} />,
    title: 'Integração Sustentável',
    desc: 'A arquitetura modular permite integração progressiva, respeitando a sustentabilidade institucional e a evolução tecnológica.'
  },
  {
    icon: <Server className="text-indigo-600" size={48} />,
    title: 'Espaço de Dados Federado',
    desc: 'Os dados permanecem sob controle das instituições, com interoperabilidade e conformidade regulatória em todo o ecossistema.'
  },
  {
    icon: <CheckCircle className="text-blue-600" size={48} />,
    title: 'Transparência e Auditoria',
    desc: 'Todas as operações são auditáveis, promovendo confiança, segurança e conformidade com a legislação vigente.'
  }
];

export const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = React.useState<'patient' | 'professional'>('patient');
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const slides = role === 'patient' ? patientSlides : professionalSlides;
  const totalSlides = slides.length;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goToSlide = (index: number) => setCurrentSlide(index);

  React.useEffect(() => {
    setCurrentSlide(0);
  }, [role]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar igual a Landing */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}> 
            <CuidiLogo size={80} />
            <span className="text-xl font-extrabold tracking-tight text-slate-900">Portal CUIDI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/privacy')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Privacidade & LGPD</button>
            <button onClick={() => navigate('/help')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Centro de Ajuda</button>
            <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
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
      {/* Botão Voltar */}
      <div className="max-w-7xl mx-auto px-6 pt-36 pb-0">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest transition-colors mb-8">
          <ChevronLeft size={16} /> Voltar
        </button>
      </div>
      {/* Hero */}
      <header className="pt-48 pb-16 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50 -skew-x-12 origin-top -z-10 translate-x-20"></div>
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
            <HelpCircle size={14} /> Tour Interativo
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1]">
            Conheça o CUIDI
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Descubra como a integração digital de dados em saúde pode apoiar decisões clínicas, gestão e segurança da informação. Escolha seu perfil e explore os recursos.
          </p>

          {/* Role Selector */}
          <div className="inline-flex bg-slate-100 rounded-full p-1 shadow-inner">
            <button 
              onClick={() => setRole('patient')} 
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${role === 'patient' ? 'bg-white shadow-lg text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Sou Paciente
            </button>
            <button 
              onClick={() => setRole('professional')} 
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${role === 'professional' ? 'bg-white shadow-lg text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Sou Profissional de Saúde
            </button>
          </div>
        </div>
      </header>

      {/* Slide Viewer */}
      <main className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden">
          {/* Slide Content */}
          <div className="p-16 min-h-[600px] flex flex-col items-center justify-center text-center space-y-8 relative">
            {/* Icon with Animation */}
            <div 
              key={`icon-${currentSlide}`}
              className="animate-in fade-in zoom-in duration-500"
            >
              {slides[currentSlide].icon}
            </div>

            {/* Title */}
            <h2 
              key={`title-${currentSlide}`}
              className="text-4xl font-extrabold text-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100"
            >
              {slides[currentSlide].title}
            </h2>

            {/* Description */}
            <p 
              key={`desc-${currentSlide}`}
              className="text-xl text-slate-600 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200"
            >
              {slides[currentSlide].description}
            </p>

            {/* Features List */}
            <ul 
              key={`features-${currentSlide}`}
              className="space-y-3 text-left max-w-xl w-full animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300"
            >
              {slides[currentSlide].features.map((feature, idx) => (
                <li 
                  key={idx}
                  className="flex items-start gap-3 text-slate-700"
                  style={{ animationDelay: `${300 + idx * 50}ms` }}
                >
                  <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-base">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-8 pointer-events-none">
              <button
                onClick={prevSlide}
                className="pointer-events-auto w-14 h-14 rounded-full bg-white border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all shadow-lg flex items-center justify-center text-slate-600 hover:text-blue-600 group"
                aria-label="Slide anterior"
              >
                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={nextSlide}
                className="pointer-events-auto w-14 h-14 rounded-full bg-white border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all shadow-lg flex items-center justify-center text-slate-600 hover:text-blue-600 group"
                aria-label="Próximo slide"
              >
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="bg-slate-50 border-t border-slate-200 px-16 py-8 flex items-center justify-center gap-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`transition-all ${
                  idx === currentSlide 
                    ? 'w-12 h-3 bg-blue-600' 
                    : 'w-3 h-3 bg-slate-300 hover:bg-slate-400'
                } rounded-full`}
                aria-label={`Ir para slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-16 py-12 text-center text-white space-y-6">
            <h3 className="text-2xl font-black">Pronto para começar?</h3>
            <p className="text-blue-100 max-w-xl mx-auto">
              {role === 'patient' 
                ? 'Crie sua conta e tenha acesso completo ao seu histórico de saúde.' 
                : 'Acesse a plataforma e otimize a gestão e o cuidado aos pacientes.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button 
                onClick={() => navigate('/login')} 
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl flex items-center justify-center gap-2 group"
              >
                Entrar no Portal <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/help')} 
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                Centro de Ajuda
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">
          <p>© 2026 CUIDI - Integração Digital de Informações em Processos de Saúde</p>
        </div>
      </footer>
    </div>
  );
};