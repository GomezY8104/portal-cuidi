
import React from 'react';
import { 
  Shield, Globe, Database, Book, Terminal, 
  Activity, CheckCircle, Mail, MessageSquare, 
  ArrowLeft, FileText, Lock, Server, Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({ title, subtitle, icon: Icon }: any) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 mb-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest transition-colors">
        <ArrowLeft size={16} /> Voltar
      </button>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-200">
          <Icon size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h1>
          <p className="text-slate-500 text-lg font-medium">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export const AboutPage: React.FC = () => (
  <div className="max-w-4xl mx-auto py-10 animate-fade-in-up">
    <PageHeader title="Sobre o CUIDI" subtitle="A revolução na regulação assistencial federada." icon={Globe} />
    <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm prose prose-slate max-w-none">
      <p className="text-xl leading-relaxed text-slate-600">
        O <strong>Portal CUIDI</strong> nasceu da necessidade de unificar o sistema de regulação do SUS, garantindo que o dado clínico acompanhe o cidadão em qualquer lugar do Brasil, respeitando integralmente a <strong>LGPD</strong>.
      </p>
      <h2 className="text-2xl font-black text-slate-900 mt-10">Nossa Missão</h2>
      <p className="text-slate-600">Eliminar barreiras de interoperabilidade entre estados e municípios através de uma arquitetura de nós federados e governança ativa.</p>
    </div>
  </div>
);

export const ApiDocsPage: React.FC = () => (
  <div className="max-w-5xl mx-auto py-10 animate-fade-in-up">
    <PageHeader title="Documentação API" subtitle="Integre sua unidade à rede nacional." icon={Terminal} />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-blue-400 font-mono text-sm overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Cpu size={120}/></div>
          <div className="flex items-center gap-2 text-slate-500 mb-6 border-b border-slate-800 pb-4">
            <Server size={14}/> <span>BASE URL: https://api.cuidi.gov.br/v3</span>
          </div>
          <p className="text-white font-bold mb-4">// GET /patient/history/:id</p>
          <pre className="text-xs">
{`{
  "status": "success",
  "data": {
    "patient_id": "000.000.000-00",
    "access_policy": "POL-FED-01",
    "ledger_proof": "0x842...abc"
  }
}`}
          </pre>
        </div>
      </div>
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-xl font-bold">Endpoints Principais</h3>
        <ul className="space-y-4">
          {['Auth (OIDC)', 'Patient Search', 'Ledger Audit', 'Consent Mgmt'].map(item => (
            <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <CheckCircle size={16} className="text-emerald-500"/> {item}
            </li>
          ))}
        </ul>
        <button className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest">Baixar Swagger</button>
      </div>
    </div>
  </div>
);

export const NetworkStatusPage: React.FC = () => (
  <div className="max-w-4xl mx-auto py-10 animate-fade-in-up">
    <PageHeader title="Status da Rede" subtitle="Monitoramento em tempo real dos nós federados." icon={Activity} />
    <div className="grid gap-4">
      {[
        { name: 'Node Core Brasília', status: 'OPERACIONAL', lat: '12ms' },
        { name: 'Regional São Paulo (SP-01)', status: 'OPERACIONAL', lat: '42ms' },
        { name: 'Regional Rio (RJ-01)', status: 'LATÊNCIA ALTA', lat: '180ms' },
        { name: 'Ledger Global Sync', status: 'OPERACIONAL', lat: '5ms' },
      ].map((n, i) => (
        <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full animate-pulse ${n.status === 'OPERACIONAL' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
            <span className="font-bold text-slate-800">{n.name}</span>
          </div>
          <div className="text-right">
            <span className={`text-[10px] font-black uppercase tracking-widest ${n.status === 'OPERACIONAL' ? 'text-green-600' : 'text-amber-600'}`}>{n.status}</span>
            <p className="text-[10px] text-slate-400 font-mono">{n.lat}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const LegalPage: React.FC<{ type: 'terms' | 'privacy' }> = ({ type }) => (
  <div className="max-w-4xl mx-auto py-10 animate-fade-in-up">
    <PageHeader 
      title={type === 'terms' ? 'Termos de Uso' : 'Privacidade'} 
      subtitle={type === 'terms' ? 'Regras da federação assistencial.' : 'Como protegemos a soberania do cidadão.'} 
      icon={type === 'terms' ? FileText : Lock} 
    />
    <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm space-y-6 text-slate-600 leading-relaxed font-medium">
      <p>Este documento estabelece as diretrizes para uso da plataforma CUIDI no âmbito do Sistema Único de Saúde.</p>
      <h3 className="text-xl font-bold text-slate-900 mt-8">1. Uso de Dados Assistenciais</h3>
      <p>O acesso a dados clínicos é permitido exclusivamente para finalidade de tratamento e cuidado assistencial, sob pena de sanções administrativas e penais.</p>
      <h3 className="text-xl font-bold text-slate-900 mt-8">2. Transparência ao Titular</h3>
      <p>O cidadão possui o direito de revogar qualquer consentimento a qualquer momento através do Portal do Cidadão.</p>
    </div>
  </div>
);

export const ContactPage: React.FC = () => (
  <div className="max-w-4xl mx-auto py-10 animate-fade-in-up">
    <PageHeader title="Contato & Suporte" subtitle="Estamos prontos para atender gestores e cidadãos." icon={MessageSquare} />
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-blue-600 p-10 rounded-[3rem] text-white space-y-8">
        <h3 className="text-2xl font-black">Canais Oficiais</h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <Mail className="text-blue-200"/>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">E-mail Suporte</p>
              <p className="font-bold">suporte@cuidi.saude.gov.br</p>
            </div>
          </div>
          <div className="flex gap-4">
            <MessageSquare className="text-blue-200"/>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Ouvidoria</p>
              <p className="font-bold">0800 123 4567</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-4">
          <input placeholder="Seu E-mail" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none" />
          <textarea placeholder="Sua Mensagem" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none h-32" />
          <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Enviar Mensagem</button>
        </div>
      </div>
    </div>
  </div>
);
