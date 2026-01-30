
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, Shield, Search, ArrowRight, Building2, 
  Lock, CheckCircle, User, Activity, FileText, 
  Pill, ShieldCheck, ChevronLeft, ChevronRight, Loader2,
  AlertTriangle, Settings, Check, Globe, Image as ImageIcon,
  Video, Mic, Calendar, Microscope, Trash2, AlertCircle
} from 'lucide-react';

export const ConsentModals: React.FC = () => {
  const { closeModal, modalData, activeModal } = useAppStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
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

  const [validity, setValidity] = useState('PERMANENTE');
  const [allowResearch, setAllowResearch] = useState(false);

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
    { name: 'Hospital Central de Referência', cnes: '1234567', type: 'HOSPITAL', city: 'São Paulo/SP' },
    { name: 'UBS Jardim das Flores', cnes: '2234567', type: 'UBS', city: 'Rio de Janeiro/RJ' },
    { name: 'Laboratório Nacional Bio', cnes: '3334567', type: 'LAB', city: 'Curitiba/PR' },
    { name: 'UPA Unidade Oeste', cnes: '4434567', type: 'UPA', city: 'Belo Horizonte/MG' },
  ];

  const filteredNodes = useMemo(() => {
    if (search.length < 2) return [];
    return federationNodes.filter(n => 
      n.name.toLowerCase().includes(search.toLowerCase()) || 
      n.cnes.includes(search)
    );
  }, [search]);

  const getHeader = () => {
    if (isGlobal) return { title: 'Regras Globais', sub: 'Baseline da Federação' };
    if (isRevoke) return { title: 'Revogar Permissões', sub: modalData?.institution };
    if (isEdit) return { title: 'Ajustar Acesso', sub: modalData?.institution };
    return { title: 'Nova Autorização', sub: 'Catálogo Federado SUS CUIDI' };
  };

  const header = getHeader();

  const dataCategories = [
    { key: 'id', label: 'Identidade', desc: 'CPF, CNS e Contato', icon: <User size={20}/>, color: 'blue' },
    { key: 'clinical', label: 'Clínico', desc: 'Evoluções e Alergias', icon: <Activity size={20}/>, color: 'indigo' },
    { key: 'exams', label: 'Laudos', desc: 'Resultados de Exames', icon: <FileText size={20}/>, color: 'emerald' },
    { key: 'prescriptions', label: 'Receitas', desc: 'Prescrições Digitais', icon: <Pill size={20}/>, color: 'amber' },
    { key: 'images', label: 'Imagens', desc: 'Raios-X, Tomografias', icon: <ImageIcon size={20}/>, color: 'purple' },
    { key: 'videos', label: 'Vídeos', desc: 'Cirurgias, Exames', icon: <Video size={20}/>, color: 'rose' },
    { key: 'audio', label: 'Gravações', desc: 'Teleconsultas', icon: <Mic size={20}/>, color: 'cyan' },
  ];

  return (
    <div className="flex flex-col max-h-[90vh]">
       <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{header.title}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{header.sub}</p>
          </div>
          <button onClick={closeModal} className="text-slate-400 hover:text-slate-900 p-2"><X size={24}/></button>
       </div>

       <div className="p-10 overflow-y-auto">
          {/* SUCESSO GERAL (Passo 3) */}
          {step === 3 ? (
            <div className="text-center py-10 space-y-8 animate-in zoom-in">
               <div className="relative mx-auto w-32 h-32">
                 <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                 <div className="relative w-32 h-32 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-200">
                   <CheckCircle size={64} />
                 </div>
               </div>
               <div className="space-y-2">
                 <h3 className="text-4xl font-black text-slate-900 tracking-tight">Ação Concluída</h3>
                 <p className="text-slate-500 text-lg font-medium max-w-xs mx-auto">Sua decisão soberana foi gravada com sucesso no Ledger nacional.</p>
               </div>
               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-left space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <ShieldCheck size={14}/> Prova de Auditoria Imutável
                  </div>
                  <p className="font-mono text-[10px] text-slate-400 break-all">TX_ID: {Math.random().toString(36).substring(2, 15).toUpperCase()}</p>
               </div>
               <button onClick={closeModal} className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-sm tracking-widest">Entendido</button>
            </div>
          ) : (
            <>
              {/* BUSCA DE NÓS (Passo 1 para Nova Autorização) */}
              {!isEdit && !isGlobal && !isRevoke && step === 1 && (
                <div className="space-y-8 animate-in slide-in-from-right">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Selecione o Destinatário na Rede</label>
                     <div className="relative">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={24}/>
                       <input 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Nome do Hospital, UBS ou CNES..." 
                        className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border-2 border-slate-100 outline-none font-bold focus:border-blue-500 transition-all text-lg" 
                       />
                     </div>
                     <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                        {filteredNodes.map((node, idx) => (
                           <button 
                            key={idx}
                            onClick={() => setStep(2)}
                            className="w-full p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-blue-500 transition-all group flex items-center justify-between"
                           >
                              <div className="flex items-center gap-4 text-left">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                                  <Building2 size={24}/>
                                </div>
                                <div>
                                  <p className="font-black text-slate-900">{node.name}</p>
                                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{node.type} • {node.city}</p>
                                </div>
                              </div>
                              <ChevronRight size={20} className="text-slate-300" />
                           </button>
                        ))}
                     </div>
                  </div>
                </div>
              )}

              {/* CONFIGURAÇÃO GRANULAR (Passo 2 ou Modo Edit/Revoke) */}
              {(isEdit || isRevoke || step === 2) && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                   <div className={`${isRevoke ? 'bg-red-50 border-red-100 text-red-900' : 'bg-blue-50 border-blue-100 text-blue-900'} p-6 rounded-[2rem] border flex gap-4`}>
                      {isRevoke ? <AlertCircle size={28} className="shrink-0 text-red-600" /> : <Lock size={28} className="shrink-0 text-blue-600" />}
                      <p className="text-xs font-medium leading-relaxed">
                        {isRevoke 
                          ? 'Desmarque os itens que deseja parar de compartilhar ou clique em "Revogar Acesso Total" para excluir este nó da sua federação.'
                          : 'Selecione as categorias de dados e o tempo de validade para este nó assistencial.'}
                      </p>
                   </div>

                   <div className="space-y-6">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Dados Autorizados:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {dataCategories.map((item) => (
                          <button 
                            key={item.key}
                            onClick={() => togglePermission(item.key)}
                            className={`p-4 rounded-[1.5rem] border-2 text-left transition-all relative group flex items-center gap-4 ${permissions[item.key as keyof typeof permissions] ? `border-${item.color}-500 bg-${item.color}-50/30` : 'border-slate-100 bg-white opacity-60'}`}
                          >
                             <div className={`p-3 rounded-xl transition-all ${permissions[item.key as keyof typeof permissions] ? `bg-${item.color}-500 text-white shadow-lg` : 'bg-slate-50 text-slate-400'}`}>
                                {item.icon}
                             </div>
                             <div>
                               <p className="font-bold text-slate-900 text-sm leading-none mb-1">{item.label}</p>
                               <p className="text-[9px] text-slate-500 font-medium">{item.desc}</p>
                             </div>
                             {permissions[item.key as keyof typeof permissions] && (
                               <div className="ml-auto text-green-600"><Check size={18} strokeWidth={3} /></div>
                             )}
                          </button>
                        ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Validade da Autorização</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <select 
                            value={validity}
                            onChange={e => setValidity(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm appearance-none"
                          >
                            <option value="24H">Válido por 24 horas</option>
                            <option value="7D">Válido por 7 dias</option>
                            <option value="30D">Válido por 30 dias</option>
                            <option value="6M">Válido por 6 meses</option>
                            <option value="PERMANENTE">Permanente</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Uso para Pesquisa</label>
                        <button 
                          onClick={() => setAllowResearch(!allowResearch)}
                          className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${allowResearch ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-slate-50'}`}
                        >
                           <div className="flex items-center gap-3">
                             <Microscope size={20} className={allowResearch ? 'text-emerald-600' : 'text-slate-400'} />
                             <span className={`text-xs font-bold ${allowResearch ? 'text-emerald-900' : 'text-slate-500'}`}>Anonimizar p/ Pesquisa</span>
                           </div>
                           <div className={`w-10 h-6 rounded-full relative transition-all ${allowResearch ? 'bg-emerald-600' : 'bg-slate-300'}`}>
                             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${allowResearch ? 'right-1' : 'left-1'}`}></div>
                           </div>
                        </button>
                      </div>
                   </div>

                   <div className="flex flex-col gap-4 pt-6">
                      <button 
                        onClick={handleFinish}
                        disabled={loading}
                        className={`w-full py-6 rounded-[1.5rem] font-black uppercase text-sm tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3 ${isRevoke ? 'bg-red-600 text-white shadow-red-200' : 'bg-blue-600 text-white shadow-blue-200'}`}
                      >
                        {loading ? <Loader2 className="animate-spin" size={24}/> : <>{isRevoke ? 'Confirmar Revogação Parcial' : 'Confirmar Autorização'} <ArrowRight size={20}/></>}
                      </button>
                      
                      {isRevoke && (
                        <button 
                          onClick={handleFinish}
                          className="w-full py-4 text-red-600 font-black uppercase text-[10px] tracking-widest hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2 size={16} /> Revogar Acesso Total (Expulsar Nó)
                        </button>
                      )}
                      
                      {!isEdit && !isRevoke && !isGlobal && (
                        <button onClick={() => setStep(1)} className="text-xs font-black text-slate-400 uppercase hover:text-slate-900">Voltar para busca</button>
                      )}
                   </div>
                </div>
              )}
            </>
          )}
       </div>
    </div>
  );
};
