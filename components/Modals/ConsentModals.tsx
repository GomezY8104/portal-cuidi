
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, Shield, Search, ArrowRight, Building2, 
  Lock, CheckCircle, User, Activity, FileText, 
  Pill, ShieldCheck, ChevronRight, Loader2,
  AlertTriangle, Check, Globe, Image as ImageIcon,
  Video, Mic, Calendar, Microscope, Trash2, AlertCircle,
  Clock, MapPin, Settings
} from 'lucide-react';

export const ConsentModals: React.FC = () => {
  const { closeModal, modalData, activeModal } = useAppStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  const isEdit = activeModal === 'EditConsentModal';
  const isGlobal = activeModal === 'GlobalConsentRulesModal';
  const isRevoke = activeModal === 'RevokeConsentModal';
  
  // Estado Granular de Permissões
  const [permissions, setPermissions] = useState(
    modalData?.permissions || {
      id: true,
      clinical: false,
      exams: false,
      prescriptions: false,
      images: false,
      videos: false,
      audio: false
    }
  );

  const [config, setConfig] = useState({
    validity: '30D',
    purpose: 'TREATMENT',
    research: false
  });

  const togglePermission = (key: string) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleFinish = () => {
    setLoading(true);
    // Simula latência de gravação no Ledger/Blockchain
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1800);
  };

  const federationNodes = [
    { name: 'Hospital das Clínicas da FMUSP', cnes: '2058391', type: 'HOSPITAL', city: 'São Paulo/SP' },
    { name: 'Hospital Sírio-Libanês', cnes: '2063388', type: 'HOSPITAL', city: 'São Paulo/SP' },
    { name: 'Laboratório Fleury', cnes: '3334567', type: 'LABORATÓRIO', city: 'Nacional' },
    { name: 'UPA 24h Campo Limpo', cnes: '4434567', type: 'UPA', city: 'São Paulo/SP' },
    { name: 'UBS Jardim das Flores', cnes: '5534567', type: 'APS', city: 'Osasco/SP' },
    { name: 'Santa Casa de Misericórdia', cnes: '1234567', type: 'HOSPITAL', city: 'Porto Alegre/RS' },
    { name: 'Hospital Israelita Albert Einstein', cnes: '7654321', type: 'HOSPITAL', city: 'São Paulo/SP' },
    { name: 'Laboratório Sérgio Franco', cnes: '9876543', type: 'LABORATÓRIO', city: 'Rio de Janeiro/RJ' },
    { name: 'Hospital Moinhos de Vento', cnes: '1122334', type: 'HOSPITAL', city: 'Porto Alegre/RS' },
    { name: 'Complexo Regulador Estadual', cnes: '0000001', type: 'REGULADOR', city: 'Secretaria Saúde' },
  ];

  const filteredNodes = useMemo(() => {
    if (!search) return federationNodes;
    return federationNodes.filter(n => 
      n.name.toLowerCase().includes(search.toLowerCase()) || 
      n.cnes.includes(search)
    );
  }, [search]);

  const handleSelectNode = (node: any) => {
    setSelectedNode(node);
    setStep(2);
  };

  const getHeader = () => {
    if (isGlobal) return { title: 'Regras Globais', sub: 'Baseline da Federação', icon: <Globe size={24}/> };
    if (isRevoke) return { title: 'Revogar Acesso', sub: modalData?.institution || 'Acesso Existente', icon: <Trash2 size={24}/> };
    if (isEdit) return { title: 'Ajustar Permissões', sub: modalData?.institution || 'Acesso Existente', icon: <Settings size={24}/> };
    return { title: 'Nova Autorização', sub: 'Conceder acesso a um nó da rede', icon: <ShieldCheck size={24}/> };
  };

  const header = getHeader();

  const dataCategories = [
    { key: 'id', label: 'Dados Cadastrais', desc: 'Nome, CPF, CNS, Contato', icon: <User size={18}/>, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { key: 'clinical', label: 'Resumo Clínico', desc: 'Diagnósticos, Alergias, Vacinas', icon: <Activity size={18}/>, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { key: 'exams', label: 'Exames & Laudos', desc: 'Laboratório e Patologia', icon: <FileText size={18}/>, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { key: 'prescriptions', label: 'Receituário', desc: 'Medicamentos em uso', icon: <Pill size={18}/>, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { key: 'images', label: 'Imagens DICOM', desc: 'Raios-X, Tomografias, RM', icon: <ImageIcon size={18}/>, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { key: 'sensitive', label: 'Dados Sensíveis', desc: 'Saúde Mental, Genética', icon: <Lock size={18}/>, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  ];

  return (
    <div className="flex flex-col max-h-[80vh] bg-white w-full">
       
       {/* HEADER ELEGANTE */}
       <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${isRevoke ? 'bg-red-50 text-red-600' : 'bg-slate-900 text-white'}`}>
               {header.icon}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">{header.title}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">{header.sub}</p>
            </div>
          </div>
          <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"><X size={20}/></button>
       </div>

       {/* BODY */}
       <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
          
          {/* STEP 3: SUCESSO */}
          {step === 3 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 px-8 animate-in zoom-in duration-300 text-center space-y-8">
               <div className="relative">
                 <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75"></div>
                 <div className="relative w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200">
                   <Check size={48} strokeWidth={3} />
                 </div>
               </div>
               
               <div className="space-y-2">
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight">Autorização Registrada!</h3>
                 <p className="text-slate-500 font-medium max-w-sm mx-auto">
                   O nó {selectedNode?.name} recebeu o token de acesso. Esta transação foi gravada no Ledger Nacional.
                 </p>
               </div>

               <div className="w-full max-w-sm bg-slate-50 rounded-2xl border border-slate-200 p-4 flex items-center gap-3 text-left">
                  <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                     <ShieldCheck size={20} className="text-blue-600"/>
                  </div>
                  <div className="flex-1 overflow-hidden">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocolo Ledger (Hash)</p>
                     <p className="font-mono text-[10px] text-slate-600 truncate">0x{Math.random().toString(16).substr(2, 20).toUpperCase()}...</p>
                  </div>
               </div>

               <button onClick={closeModal} className="w-full max-w-xs py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-lg">
                 Fechar Recibo
               </button>
            </div>
          ) : (
            <div className="p-8 space-y-8">
              
              {/* STEP PROGRESS */}
              {!isRevoke && !isEdit && (
                <div className="flex items-center justify-center gap-2 mb-4">
                   <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                   <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                </div>
              )}

              {/* STEP 1: BUSCA DE NÓS (AUTOCOMPLETE) */}
              {step === 1 && !isEdit && !isRevoke && (
                <div className="space-y-6 animate-in slide-in-from-right">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Selecione a Instituição</label>
                      <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20}/>
                        <input 
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          placeholder="Buscar Hospital, Laboratório ou CNES..."
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-sm text-slate-700"
                          autoFocus
                        />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">
                        Catálogo da Federação ({filteredNodes.length})
                      </p>
                      
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                        {filteredNodes.map((node, i) => (
                           <button 
                             key={i} 
                             onClick={() => handleSelectNode(node)}
                             className="w-full p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between group hover:border-blue-500 hover:shadow-md transition-all text-left"
                           >
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                                    <Building2 size={20}/>
                                 </div>
                                 <div>
                                    <p className="font-black text-slate-900 text-sm leading-tight group-hover:text-blue-700">{node.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wide flex items-center gap-1">
                                      <MapPin size={10}/> {node.city} • {node.type}
                                    </p>
                                 </div>
                              </div>
                              <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600"/>
                           </button>
                        ))}
                        {filteredNodes.length === 0 && (
                           <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                              <Globe size={32} className="mx-auto text-slate-300 mb-2"/>
                              <p className="text-xs font-bold text-slate-400">Nenhuma instituição encontrada com este nome.</p>
                           </div>
                        )}
                      </div>
                   </div>
                </div>
              )}

              {/* STEP 2: CONFIGURAÇÃO DE PERMISSÕES */}
              {(step === 2 || isEdit || isRevoke) && (
                <div className="space-y-8 animate-in slide-in-from-right">
                   
                   {/* INFO BOX */}
                   <div className={`p-4 rounded-xl border flex gap-3 items-start ${isRevoke ? 'bg-red-50 border-red-100 text-red-900' : 'bg-blue-50 border-blue-100 text-blue-900'}`}>
                      {isRevoke ? <AlertTriangle size={20} className="shrink-0 text-red-600 mt-0.5"/> : <Shield size={20} className="shrink-0 text-blue-600 mt-0.5"/>}
                      <div>
                         <p className="text-xs font-bold uppercase tracking-wide mb-1">
                            {isRevoke ? 'Zona de Revogação' : `Acesso para: ${selectedNode?.name || modalData?.institution || 'Instituição'}`}
                         </p>
                         <p className="text-[11px] leading-relaxed opacity-80">
                            {isRevoke 
                              ? 'Ao revogar, a instituição perderá imediatamente a chave de descriptografia dos seus dados.'
                              : 'Selecione apenas os dados necessários. Você pode alterar ou revogar este acesso a qualquer momento.'}
                         </p>
                      </div>
                   </div>

                   {/* GRID DE PERMISSÕES */}
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Dados Compartilhados</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {dataCategories.map((cat) => {
                            const isSelected = permissions[cat.key as keyof typeof permissions];
                            return (
                               <button 
                                 key={cat.key}
                                 onClick={() => togglePermission(cat.key)}
                                 className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 text-left relative overflow-hidden group ${isSelected ? `border-blue-600 bg-blue-50/50` : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                               >
                                  <div className={`p-2 rounded-lg transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                                     {cat.icon}
                                  </div>
                                  <div className="flex-1">
                                     <p className={`text-xs font-black uppercase ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>{cat.label}</p>
                                     <p className="text-[9px] font-bold text-slate-400 tracking-tight">{cat.desc}</p>
                                  </div>
                                  {isSelected && <div className="absolute top-2 right-2 text-blue-600"><CheckCircle size={14}/></div>}
                               </button>
                            );
                         })}
                      </div>
                   </div>

                   {/* CONFIGURAÇÕES EXTRAS (Só para novo ou edição) */}
                   {!isRevoke && (
                     <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1"><Clock size={10}/> Validade</label>
                           <select 
                             value={config.validity}
                             onChange={(e) => setConfig({...config, validity: e.target.value})}
                             className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer focus:border-blue-500"
                           >
                              <option value="24H">24 Horas (Emergência)</option>
                              <option value="7D">7 Dias (Curto Prazo)</option>
                              <option value="30D">30 Dias (Padrão)</option>
                              <option value="1Y">1 Ano (Acompanhamento)</option>
                              <option value="PERMANENT">Indefinido</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1"><Lock size={10}/> Finalidade</label>
                           <select 
                             value={config.purpose}
                             onChange={(e) => setConfig({...config, purpose: e.target.value})}
                             className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer focus:border-blue-500"
                           >
                              <option value="TREATMENT">Tratamento Médico</option>
                              <option value="SECOND_OPINION">Segunda Opinião</option>
                              <option value="INSURANCE">Auditoria Convênio</option>
                              <option value="RESEARCH">Pesquisa Clínica</option>
                           </select>
                        </div>
                     </div>
                   )}

                   {/* PESQUISA TOGGLE */}
                   {!isRevoke && (
                      <button 
                        onClick={() => setConfig({...config, research: !config.research})}
                        className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${config.research ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}
                      >
                         <div className="flex items-center gap-3">
                            <Microscope size={20} className={config.research ? 'text-indigo-600' : 'text-slate-400'}/>
                            <div className="text-left">
                               <p className={`text-xs font-black uppercase ${config.research ? 'text-indigo-900' : 'text-slate-500'}`}>Permitir Uso em Pesquisa</p>
                               <p className="text-[9px] font-bold text-slate-400">Seus dados serão anonimizados antes do envio.</p>
                            </div>
                         </div>
                         <div className={`w-10 h-5 rounded-full relative transition-colors ${config.research ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.research ? 'left-6' : 'left-1'}`}></div>
                         </div>
                      </button>
                   )}

                </div>
              )}

            </div>
          )}
       </div>

       {/* FOOTER ACTIONS */}
       {step < 3 && (
         <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-4 shrink-0">
            {(step === 2 && !isEdit && !isRevoke) ? (
               <button onClick={() => setStep(1)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all">
                 Voltar
               </button>
            ) : (
               <button onClick={closeModal} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all">
                 Cancelar
               </button>
            )}
            
            <button 
              onClick={handleFinish}
              disabled={loading || (step === 1 && !search && false)} // Removida a obrigatoriedade da busca se for lista completa
              className={`flex-[2] py-4 rounded-xl font-black uppercase text-xs tracking-widest text-white shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${isRevoke ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-slate-900 hover:bg-blue-600 shadow-slate-200'}`}
            >
               {loading ? <Loader2 className="animate-spin" size={18}/> : (
                 <>
                   {step === 1 ? 'Selecionar' : isRevoke ? 'Confirmar Revogação' : 'Assinar Autorização'} <ArrowRight size={16}/>
                 </>
               )}
            </button>
         </div>
       )}
    </div>
  );
};
