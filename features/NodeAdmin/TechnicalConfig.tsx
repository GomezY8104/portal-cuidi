import React, { useState } from 'react';
import { Settings, Server, Key, Terminal, RefreshCw, CheckCircle, Globe, Shield, Save, Edit, ToggleRight, ToggleLeft } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const TechnicalConfigPage: React.FC = () => {
  const { openModal } = useAppStore();
  const [securityConfig, setSecurityConfig] = useState({
    requireConsent: true,
    logRetention: '90',
    logLevel: 'DETAILED',
    defaultAnonymization: false
  });

  const endpoints = [
    { name: 'Document Metadata', url: 'https://api.node.gov.br/v1/docs', method: 'GET', version: 'v1.2', active: true },
    { name: 'Consent Check', url: 'https://api.node.gov.br/v1/consent', method: 'POST', version: 'v2.0', active: true },
    { name: 'Audit Hook', url: 'https://api.node.gov.br/v1/audit', method: 'POST', version: 'v1.0', active: true },
    { name: 'Case Status', url: 'https://api.node.gov.br/v1/case/status', method: 'PUT', version: 'v1.1', active: false },
  ];

  const handleSaveSecurity = () => {
    alert('Políticas de segurança atualizadas e evento de auditoria gerado.');
  };

  return (
    <div className="space-y-10 animate-fade-in-up pb-20">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Configuração Técnica</h1>
        <p className="text-slate-500 mt-2 text-lg font-medium">Parâmetros de conectividade, endpoints e segurança do nó.</p>
      </div>

      {/* SEÇÃO 1: IDENTIDADE DO NÓ */}
      <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
         <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2"><Globe size={14}/> Identidade na Federação</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Org ID', value: 'NODE-SP-01' },
              { label: 'Nome Técnico', value: 'hosp-central-sp-main' },
              { label: 'Região', value: 'São Paulo / SP' },
              { label: 'Tipo de Nó', value: 'HOSPITALAR (FULL)' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                 <p className="text-sm font-bold text-slate-900 font-mono">{item.value}</p>
              </div>
            ))}
         </div>
         <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800">
            <CheckCircle size={20} className="text-emerald-600"/>
            <div className="flex-1">
               <p className="text-xs font-bold uppercase tracking-wide">Certificado Digital Válido</p>
               <p className="text-[10px] opacity-80">Emitido por ICP-Brasil • Expira em 12/2025</p>
            </div>
            <span className="px-3 py-1 bg-white rounded-lg text-[9px] font-black text-emerald-600 uppercase tracking-widest shadow-sm">Ativo</span>
         </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         
         {/* SEÇÃO 2: ENDPOINTS PUBLICADOS */}
         <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 h-fit">
            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2"><Server size={14}/> Endpoints Publicados</h3>
            <div className="space-y-3">
               {endpoints.map((ep, idx) => (
                 <div key={idx} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-indigo-200 transition-all">
                    <div>
                       <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${ep.method === 'GET' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{ep.method}</span>
                          <p className="text-sm font-bold text-slate-900">{ep.name}</p>
                       </div>
                       <p className="text-[10px] font-mono text-slate-400 mt-1 truncate max-w-[250px]">{ep.url}</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className={`w-2 h-2 rounded-full ${ep.active ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                       <button onClick={() => openModal('EditEndpointModal', ep)} className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"><Edit size={16}/></button>
                    </div>
                 </div>
               ))}
            </div>
         </section>

         {/* SEÇÃO 3: POLÍTICAS DE SEGURANÇA */}
         <section className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl space-y-8 h-fit border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5"><Shield size={120}/></div>
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 relative z-10"><Key size={14}/> Políticas Técnicas de Segurança</h3>
            
            <div className="space-y-6 relative z-10">
               <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                     <p className="text-xs font-bold">Consentimento Ativo Obrigatório</p>
                     <p className="text-[9px] text-slate-400 mt-1">Rejeitar requisições sem token de consentimento válido</p>
                  </div>
                  <button onClick={() => setSecurityConfig({...securityConfig, requireConsent: !securityConfig.requireConsent})} className="text-blue-400 hover:text-white transition-colors">
                     {securityConfig.requireConsent ? <ToggleRight size={32}/> : <ToggleLeft size={32} className="text-slate-600"/>}
                  </button>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Retenção de Logs (Dias)</label>
                     <input 
                        type="number" 
                        value={securityConfig.logRetention}
                        onChange={e => setSecurityConfig({...securityConfig, logRetention: e.target.value})}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white outline-none focus:border-blue-500 transition-all"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nível de Logging</label>
                     <select 
                        value={securityConfig.logLevel}
                        onChange={e => setSecurityConfig({...securityConfig, logLevel: e.target.value})}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                     >
                        <option value="BASIC">BÁSICO</option>
                        <option value="DETAILED">DETALHADO</option>
                        <option value="DEBUG">DEBUG (DEV)</option>
                     </select>
                  </div>
               </div>

               <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                     <p className="text-xs font-bold">Anonimização por Padrão</p>
                     <p className="text-[9px] text-slate-400 mt-1">Ocultar PII em respostas de lista</p>
                  </div>
                  <button onClick={() => setSecurityConfig({...securityConfig, defaultAnonymization: !securityConfig.defaultAnonymization})} className="text-blue-400 hover:text-white transition-colors">
                     {securityConfig.defaultAnonymization ? <ToggleRight size={32}/> : <ToggleLeft size={32} className="text-slate-600"/>}
                  </button>
               </div>

               <button 
                  onClick={handleSaveSecurity}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
               >
                  <Save size={16}/> Salvar Políticas
               </button>
            </div>
         </section>
      </div>
    </div>
  );
};