
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, Save, Globe, Shield, FileText, Server, Map, CheckCircle, AlertTriangle, Database, Activity, User, Calendar, Lock, Key } from 'lucide-react';

export const SystemAdminModals: React.FC = () => {
  const { activeModal, closeModal, modalData } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('INFO');

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Operação confirmada no Ledger.');
      closeModal();
    }, 1000);
  };

  // Render content based on modal type
  const renderContent = () => {
    switch (activeModal) {
      // --- SUB-PÁGINA: DETALHE DO NÓ ---
      case 'NodeDetailModal':
        return (
          <div className="flex flex-col h-full">
             <div className="flex border-b border-slate-200 mb-4">
                {['INFO', 'CAPACIDADES', 'APIS', 'POLÍTICAS'].map(tab => (
                   <button 
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === tab ? 'border-blue-800 text-blue-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                   >
                      {tab}
                   </button>
                ))}
             </div>
             <div className="flex-1 overflow-y-auto">
                {activeTab === 'INFO' && (
                   <div className="space-y-4">
                      <div className="p-4 bg-slate-50 border border-slate-200">
                         <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Identidade Institucional</h4>
                         <div className="grid grid-cols-2 gap-4 text-xs">
                            <div><p className="font-bold text-slate-400">Nome Oficial</p><p className="font-bold text-slate-900">{modalData?.name}</p></div>
                            <div><p className="font-bold text-slate-400">ID Técnico</p><p className="font-mono text-slate-900">NODE-{modalData?.id}</p></div>
                            <div><p className="font-bold text-slate-400">Tipo</p><p className="font-bold text-slate-900">{modalData?.type}</p></div>
                            <div><p className="font-bold text-slate-400">Status</p><p className="font-bold text-emerald-600">{modalData?.status}</p></div>
                         </div>
                      </div>
                      <div className="flex justify-end gap-2">
                         <button className="px-4 py-2 border border-red-200 text-red-700 font-bold text-[10px] uppercase hover:bg-red-50">Suspender Nó</button>
                         <button className="px-4 py-2 bg-blue-800 text-white font-bold text-[10px] uppercase hover:bg-blue-900">Editar Cadastro</button>
                      </div>
                   </div>
                )}
                {activeTab === 'CAPACIDADES' && <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase">Lista de serviços assistenciais publicados pelo nó.</div>}
                {activeTab === 'APIS' && <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase">Endpoints e status de conectividade.</div>}
                {activeTab === 'POLÍTICAS' && <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase">Regras de governança ativas neste nó.</div>}
             </div>
          </div>
        );

      // --- SUB-PÁGINA: DETALHE DO TERRITÓRIO ---
      case 'TerritoryDetailModal':
        return (
           <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                 <div className="p-4 border border-slate-200 bg-slate-50 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nós Vinculados</p>
                    <p className="text-2xl font-black text-slate-900">{modalData?.nodes}</p>
                 </div>
                 <div className="p-4 border border-slate-200 bg-slate-50 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">População Coberta</p>
                    <p className="text-2xl font-black text-slate-900">2.4M</p>
                 </div>
                 <div className="p-4 border border-slate-200 bg-slate-50 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacidade (Leitos)</p>
                    <p className="text-2xl font-black text-slate-900">450</p>
                 </div>
              </div>
              <div className="border border-slate-300">
                 <div className="bg-slate-100 p-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-300">Nós do Território</div>
                 <div className="p-4 text-xs font-medium text-slate-500 italic text-center">Tabela de nós vinculados a {modalData?.name}</div>
              </div>
           </div>
        );

      // --- SUB-PÁGINA: TRILHA DE AUDITORIA COMPLETA (REDESENHADA - TABELAS) ---
      case 'AuditTraceModal':
        return (
           <div className="space-y-8">
              {/* Header Técnico - Ledger Info */}
              <div className="bg-slate-900 p-4 rounded-xl flex justify-between items-center text-white shadow-lg">
                 <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-lg"><Database size={18}/></div>
                    <div>
                       <h3 className="text-sm font-black uppercase tracking-widest">Evento de Auditoria #12402192</h3>
                       <p className="text-[10px] font-mono text-blue-400 mt-0.5">HASH: 0x8f2a...91b2</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Carimbo de Tempo</p>
                    <p className="text-xs font-mono font-bold text-white">{modalData?.timestamp}</p>
                 </div>
              </div>
              
              <div className="space-y-8">
                 
                 {/* 1. Tabela de Contexto */}
                 <section className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-2">
                       <User size={14} className="text-blue-600"/> 1. Contexto do Pedido
                    </h4>
                    <div className="border border-slate-200 rounded-sm overflow-hidden">
                       <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[9px] tracking-widest border-b border-slate-200">
                             <tr>
                                <th className="px-4 py-2 w-1/3">Atributo</th>
                                <th className="px-4 py-2">Valor Registrado</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                             <tr><td className="px-4 py-2 text-slate-500">Ator (Usuário)</td><td className="px-4 py-2 font-bold uppercase">{modalData?.actor}</td></tr>
                             <tr><td className="px-4 py-2 text-slate-500">Papel (Role)</td><td className="px-4 py-2 uppercase">{modalData?.role}</td></tr>
                             <tr><td className="px-4 py-2 text-slate-500">Nó de Origem</td><td className="px-4 py-2 uppercase">{modalData?.node}</td></tr>
                             <tr><td className="px-4 py-2 text-slate-500">Ação Solicitada</td><td className="px-4 py-2 font-mono text-blue-700">{modalData?.action}</td></tr>
                          </tbody>
                       </table>
                    </div>
                 </section>

                 {/* 2. Tabela de Dados */}
                 <section className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-2">
                       <Database size={14} className="text-indigo-600"/> 2. Objeto do Acesso
                    </h4>
                    <div className="border border-slate-200 rounded-sm overflow-hidden">
                       <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[9px] tracking-widest border-b border-slate-200">
                             <tr>
                                <th className="px-4 py-2 w-1/3">Parâmetro</th>
                                <th className="px-4 py-2">Detalhe</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                             <tr><td className="px-4 py-2 text-slate-500">Paciente (Ref. Anonimizada)</td><td className="px-4 py-2 font-mono">{modalData?.patient}</td></tr>
                             <tr><td className="px-4 py-2 text-slate-500">Tipo de Dado</td><td className="px-4 py-2 uppercase font-bold text-indigo-700">Prontuário Clínico / Resumo</td></tr>
                             <tr><td className="px-4 py-2 text-slate-500">Finalidade Declarada</td><td className="px-4 py-2 uppercase">Continuidade do Cuidado (Treatment)</td></tr>
                          </tbody>
                       </table>
                    </div>
                 </section>

                 {/* 3. Tabela de Governança */}
                 <section className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-2">
                       <Shield size={14} className="text-emerald-600"/> 3. Validação de Governança
                    </h4>
                    <div className="border border-slate-200 rounded-sm overflow-hidden">
                       <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[9px] tracking-widest border-b border-slate-200">
                             <tr>
                                <th className="px-4 py-2">Critério</th>
                                <th className="px-4 py-2 text-center w-24">Status</th>
                                <th className="px-4 py-2">Referência</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                             <tr>
                                <td className="px-4 py-2 text-slate-500">Política de Acesso</td>
                                <td className="px-4 py-2 text-center"><CheckCircle size={14} className="text-emerald-500 mx-auto"/></td>
                                <td className="px-4 py-2 font-mono text-[10px]">{modalData?.policy || 'POL-FED-DEFAULT-V2'}</td>
                             </tr>
                             <tr>
                                <td className="px-4 py-2 text-slate-500">Consentimento do Titular</td>
                                <td className="px-4 py-2 text-center"><CheckCircle size={14} className="text-emerald-500 mx-auto"/></td>
                                <td className="px-4 py-2 uppercase text-[10px]">Vigente (Token #9921)</td>
                             </tr>
                             <tr>
                                <td className="px-4 py-2 text-slate-500">Base Legal LGPD</td>
                                <td className="px-4 py-2 text-center"><CheckCircle size={14} className="text-emerald-500 mx-auto"/></td>
                                <td className="px-4 py-2 uppercase text-[10px]">Art. 7, II (Tutela da Saúde)</td>
                             </tr>
                          </tbody>
                       </table>
                    </div>
                 </section>

                 {/* 4. Decisão Final (Estilo Bloco) */}
                 <div className={`p-6 border-l-4 rounded-r-lg shadow-sm flex justify-between items-center ${modalData?.result === 'APPROVED' ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500'}`}>
                    <div>
                       <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${modalData?.result === 'APPROVED' ? 'text-emerald-700' : 'text-red-700'}`}>Decisão do Motor de Regras</p>
                       <h2 className={`text-2xl font-black uppercase tracking-tight ${modalData?.result === 'APPROVED' ? 'text-emerald-900' : 'text-red-900'}`}>{modalData?.result}</h2>
                       <p className="text-xs text-slate-600 mt-1 max-w-md">A transação foi registrada no bloco #12,402,192 e assinada digitalmente pelo nó regulador.</p>
                    </div>
                    <div className="text-right">
                       <div className="flex items-center gap-2 justify-end text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          <Lock size={12}/> Assinatura Digital
                       </div>
                       <p className="font-mono text-[10px] text-slate-500 bg-white px-3 py-1.5 rounded border border-slate-200">
                          SIG: 3a1f...e920...8d1c
                       </p>
                    </div>
                 </div>

              </div>
           </div>
        );

      // --- SUB-PÁGINA: EDITOR DE POLÍTICA ---
      case 'PolicyEditorModal':
        return (
           <div className="space-y-6">
              <div className="space-y-4">
                 <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Segmentos Afetados</label>
                    <div className="flex gap-4">
                       {['APS', 'UPA', 'HOSPITAL', 'REGULADOR'].map(s => (
                          <label key={s} className="flex items-center gap-2 cursor-pointer">
                             <input type="checkbox" className="w-4 h-4 rounded-sm border-slate-300"/>
                             <span className="text-xs font-bold text-slate-700">{s}</span>
                          </label>
                       ))}
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tipo de Dado</label>
                       <select className="w-full p-2 border border-slate-300 rounded-sm text-xs font-bold uppercase"><option>CLÍNICO</option><option>SENSÍVEL</option></select>
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Finalidade</label>
                       <select className="w-full p-2 border border-slate-300 rounded-sm text-xs font-bold uppercase"><option>TRATAMENTO</option><option>PESQUISA</option></select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Obrigações de Compliance</label>
                    <div className="space-y-2">
                       <label className="flex items-center gap-2"><input type="checkbox" checked disabled className="w-4 h-4"/><span className="text-xs text-slate-500">Registro em Ledger (Obrigatório)</span></label>
                       <label className="flex items-center gap-2"><input type="checkbox" className="w-4 h-4"/><span className="text-xs text-slate-700">Notificar Paciente</span></label>
                       <label className="flex items-center gap-2"><input type="checkbox" className="w-4 h-4"/><span className="text-xs text-slate-700">Exigir Consentimento Explícito</span></label>
                    </div>
                 </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                 <button onClick={closeModal} className="px-4 py-2 border border-slate-300 text-slate-600 font-bold text-xs uppercase hover:bg-slate-50">Cancelar</button>
                 <button onClick={handleSave} className="px-4 py-2 bg-blue-800 text-white font-bold text-xs uppercase hover:bg-blue-900 flex items-center gap-2"><Save size={14}/> Salvar Política</button>
              </div>
           </div>
        );

      // --- LEGACY: CADASTRO NÓ (MANTIDO) ---
      case 'RegisterNodeModal':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Nome Técnico (CNES/ID)</label>
                <input className="w-full p-3 border border-slate-300 rounded-sm text-xs font-bold" placeholder="BR-SP-HOSP-001" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tipo de Nó</label>
                  <select className="w-full p-3 border border-slate-300 rounded-sm text-xs font-bold uppercase">
                    <option>HOSPITAL</option>
                    <option>APS/UBS</option>
                    <option>LABORATÓRIO</option>
                    <option>SECRETARIA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Região</label>
                  <select className="w-full p-3 border border-slate-300 rounded-sm text-xs font-bold uppercase">
                    <option>SÃO PAULO (SP)</option>
                    <option>RIO DE JANEIRO (RJ)</option>
                    <option>MINAS GERAIS (MG)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Endpoint Base (API)</label>
                <input className="w-full p-3 border border-slate-300 rounded-sm text-xs font-mono" placeholder="https://api.node.gov.br/v1" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 text-slate-500 font-bold text-xs uppercase hover:bg-slate-100 rounded-sm">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-slate-900 text-white font-bold text-xs uppercase rounded-sm hover:bg-slate-800 flex items-center gap-2">
                {loading ? 'Processando...' : <><Server size={14}/> Registrar Nó</>}
              </button>
            </div>
          </>
        );

      case 'CreateTerritoryModal':
         return (
            <div className="space-y-4">
               <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Nome</label><input className="w-full p-3 border border-slate-300 rounded-sm text-xs font-bold"/></div>
               <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">UF</label><input className="w-full p-3 border border-slate-300 rounded-sm text-xs font-bold"/></div>
               <div className="flex justify-end gap-2 mt-4"><button onClick={handleSave} className="px-4 py-2 bg-slate-900 text-white font-bold text-xs uppercase rounded-sm">Salvar</button></div>
            </div>
         );

      default:
        return null;
    }
  };

  if (!activeModal) return null;

  // Renderizador do Modal Genérico (Estilo Institucional)
  return (
    <div className="bg-white w-full max-w-4xl mx-auto overflow-hidden shadow-2xl border border-slate-200 h-[80vh] flex flex-col">
      <div className="p-5 border-b-2 border-slate-900 bg-slate-100 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center font-bold">
             {activeModal.charAt(0)}
          </div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
            {activeModal.replace(/([A-Z])/g, ' $1').trim()} {/* Formata CamelCase para Texto */}
          </h2>
        </div>
        <button onClick={closeModal} className="p-2 hover:bg-slate-200 text-slate-500"><X size={16}/></button>
      </div>
      <div className="p-8 flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};
