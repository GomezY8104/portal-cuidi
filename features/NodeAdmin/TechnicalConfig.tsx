
import React, { useState } from 'react';
import { 
  Settings, Server, Key, Globe, Shield, Save, Edit, 
  CheckCircle, AlertTriangle, ToggleRight, ToggleLeft 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const TechnicalConfigPage: React.FC = () => {
  const { openModal, addNotification } = useAppStore();
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
    addNotification({ type: 'success', message: 'Parâmetros de segurança propagados.' });
  };

  const handleEditIdentity = (field: string) => {
      openModal('InputModal', {
        title: `Editar ${field}`,
        label: `Novo ${field}`,
        defaultValue: '',
        onConfirm: (newValue: string) => {
          if (newValue) {
            addNotification({ type: 'info', message: `Solicitação para "${newValue}" enviada para aprovação.` });
          }
        }
      });
  };

  const handleMoveRegion = () => {
      addNotification({ type: 'warning', message: 'Alteração de região requer re-validação de certificado.' });
  };

  const handleSuspendNode = () => {
      openModal('ConfirmationModal', {
        title: 'Suspender Nó',
        message: 'ATENÇÃO: Suspender o nó irá interromper todo tráfego federado. Confirmar?',
        type: 'danger',
        onConfirm: () => {
          addNotification({ type: 'error', message: 'Nó suspenso. Propagação em 60s.' });
        }
      });
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-20 font-sans">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-1">
           <Settings size={16} className="text-slate-500" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Administração de Sistema</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Configuração Técnica</h1>
        <p className="text-slate-500 text-xs font-medium mt-1">
          Definições de conectividade, endpoints públicos e parâmetros de segurança do nó.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* SEÇÃO 1: IDENTIDADE DO NÓ (TABELA) */}
         <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-2">
               <Globe size={14}/> 1. Identidade do Nó
            </h3>
            <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
               <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <tr>
                        <th className="px-4 py-2">Campo</th>
                        <th className="px-4 py-2">Valor Atual</th>
                        <th className="px-4 py-2 text-right">Ação</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                     <tr>
                        <td className="px-4 py-3 font-bold text-slate-500 uppercase">Org ID</td>
                        <td className="px-4 py-3 font-mono">NODE-SP-01</td>
                        <td className="px-4 py-3 text-right">
                            <button onClick={() => handleEditIdentity('Org ID')} className="text-blue-600 font-bold hover:underline uppercase text-[10px]">Editar</button>
                        </td>
                     </tr>
                     <tr>
                        <td className="px-4 py-3 font-bold text-slate-500 uppercase">Nome Técnico</td>
                        <td className="px-4 py-3 font-mono">hosp-central-sp-main</td>
                        <td className="px-4 py-3 text-right">
                            <button onClick={() => handleEditIdentity('Nome Técnico')} className="text-blue-600 font-bold hover:underline uppercase text-[10px]">Editar</button>
                        </td>
                     </tr>
                     <tr>
                        <td className="px-4 py-3 font-bold text-slate-500 uppercase">Tipo de Nó</td>
                        <td className="px-4 py-3">HOSPITALAR (FULL)</td>
                        <td className="px-4 py-3 text-right"><button className="text-slate-300 font-bold cursor-not-allowed uppercase text-[10px]">Fixo</button></td>
                     </tr>
                     <tr>
                        <td className="px-4 py-3 font-bold text-slate-500 uppercase">Região</td>
                        <td className="px-4 py-3">SÃO PAULO / SP</td>
                        <td className="px-4 py-3 text-right">
                            <button onClick={handleMoveRegion} className="text-blue-600 font-bold hover:underline uppercase text-[10px]">Mover</button>
                        </td>
                     </tr>
                     <tr>
                        <td className="px-4 py-3 font-bold text-slate-500 uppercase">Status Federado</td>
                        <td className="px-4 py-3 text-emerald-600 font-black uppercase flex items-center gap-1"><CheckCircle size={12}/> ATIVO</td>
                        <td className="px-4 py-3 text-right">
                            <button onClick={handleSuspendNode} className="text-red-600 font-bold hover:underline uppercase text-[10px]">Suspender</button>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </section>

         {/* SEÇÃO 3: PARÂMETROS DE SEGURANÇA (FORMULÁRIO) */}
         <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-2">
               <Shield size={14}/> 3. Parâmetros de Segurança
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-md p-6 space-y-5">
               
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-xs font-bold text-slate-700 uppercase">Consentimento Obrigatório</p>
                     <p className="text-[10px] text-slate-500">Rejeitar requisições sem token de consentimento válido</p>
                  </div>
                  <button onClick={() => setSecurityConfig({...securityConfig, requireConsent: !securityConfig.requireConsent})} className="text-blue-600 hover:text-blue-800">
                     {securityConfig.requireConsent ? <ToggleRight size={28}/> : <ToggleLeft size={28} className="text-slate-400"/>}
                  </button>
               </div>

               <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                  <div>
                     <p className="text-xs font-bold text-slate-700 uppercase">Anonimização Padrão</p>
                     <p className="text-[10px] text-slate-500">Ocultar PII em respostas de lista pública</p>
                  </div>
                  <button onClick={() => setSecurityConfig({...securityConfig, defaultAnonymization: !securityConfig.defaultAnonymization})} className="text-blue-600 hover:text-blue-800">
                     {securityConfig.defaultAnonymization ? <ToggleRight size={28}/> : <ToggleLeft size={28} className="text-slate-400"/>}
                  </button>
               </div>

               <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4">
                  <div className="space-y-1">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Retenção Logs (Dias)</label>
                     <input 
                        type="number" 
                        value={securityConfig.logRetention}
                        onChange={e => setSecurityConfig({...securityConfig, logRetention: e.target.value})}
                        className="w-full p-2 bg-white border border-slate-300 rounded-sm text-xs font-bold outline-none focus:border-blue-500"
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nível de Log</label>
                     <select 
                        value={securityConfig.logLevel}
                        onChange={e => setSecurityConfig({...securityConfig, logLevel: e.target.value})}
                        className="w-full p-2 bg-white border border-slate-300 rounded-sm text-xs font-bold outline-none focus:border-blue-500"
                     >
                        <option value="BASIC">BÁSICO</option>
                        <option value="DETAILED">DETALHADO</option>
                        <option value="DEBUG">DEBUG (DEV)</option>
                     </select>
                  </div>
               </div>

               <button 
                  onClick={handleSaveSecurity}
                  className="w-full py-3 bg-slate-900 text-white rounded-sm font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 flex items-center justify-center gap-2 mt-2 active:scale-95 transition-all"
               >
                  <Save size={14}/> Salvar Parâmetros
               </button>
            </div>
         </section>

      </div>

      {/* SEÇÃO 2: ENDPOINTS (FULL WIDTH TABLE) */}
      <section className="space-y-4">
         <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-2">
            <Server size={14}/> 2. Endpoints Publicados (API Gateway)
         </h3>
         <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                     <th className="px-6 py-3">Serviço</th>
                     <th className="px-6 py-3">URL</th>
                     <th className="px-6 py-3 text-center">Método</th>
                     <th className="px-6 py-3 text-center">Versão</th>
                     <th className="px-6 py-3 text-center">Estado</th>
                     <th className="px-6 py-3 text-right">Ação</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                  {endpoints.map((ep, idx) => (
                     <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 font-bold uppercase">{ep.name}</td>
                        <td className="px-6 py-3 font-mono text-slate-500">{ep.url}</td>
                        <td className="px-6 py-3 text-center">
                           <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${ep.method === 'GET' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{ep.method}</span>
                        </td>
                        <td className="px-6 py-3 text-center font-mono">{ep.version}</td>
                        <td className="px-6 py-3 text-center">
                           <div className="flex items-center justify-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${ep.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <span className="text-[10px] font-bold uppercase">{ep.active ? 'ATIVO' : 'INATIVO'}</span>
                           </div>
                        </td>
                        <td className="px-6 py-3 text-right">
                           <div className="flex justify-end gap-2">
                              <button onClick={() => openModal('EditEndpointModal', ep)} className="text-slate-500 hover:text-blue-600"><Edit size={14}/></button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>

    </div>
  );
};
