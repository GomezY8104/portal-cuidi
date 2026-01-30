import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, Search, UserPlus, Globe, 
  ChevronRight, CheckCircle, 
  Stethoscope, ShieldAlert,
  Loader2, Activity, 
  ChevronLeft, Send, Hospital, X,
  FileText, Plus, ListChecks,
  Trash2, RefreshCw, Microscope, ImageIcon, Video, User as UserIcon, MapPin, ChevronDown, Cpu, Eye, ArrowUpRight,
  ClipboardList, AlertTriangle, Building2, UploadCloud, Smartphone, Info, CheckSquare, Square, Paperclip, Fingerprint, Lock,
  Sparkles, Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_PATIENTS } from '../../mocks/seed';
import { MOCK_ICD_DB, ICDEntry } from '../../mocks/icd_seed';
import { ICDSelectionRow } from '../../components/Inputs/ICDSelectionRow';

export const NewCasePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    openModal, 
    openDrawer, 
    user, 
    attachedDocs, 
    removeAttachedDoc,
    newCaseData,        
    updateNewCaseData,  
    resetNewCaseData    
  } = useAppStore();
  
  const { step, patient: selectedPatient, clinicalData, urgencyData, selectedRegulators } = newCaseData;

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(''); 
  const [isRegulatorDropdownOpen, setIsRegulatorDropdownOpen] = useState(false);
  
  // Estado para sugerencias de IA
  const [aiSuggestions, setAiSuggestions] = useState<ICDEntry[]>([]);

  const stepsLabels = ['Paciente', 'Diagnóstico', 'Urgência', 'Documentos', 'Revisão'];

  const regulators = [
    { id: 'REG-01', name: 'Central de Regulação Estadual (SESA)' },
    { id: 'REG-02', name: 'Complexo Regulador Municipal' },
    { id: 'REG-03', name: 'Central de Vagas de Alta Complexidade' },
    { id: 'REG-04', name: 'Regulação de Urgência/Emergência' }
  ];

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const filteredSearchPatients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q.length < 2) return [];
    return MOCK_PATIENTS.filter(p => p.name.toLowerCase().includes(q) || p.cpf.includes(q));
  }, [search]);

  // Lógica de "IA" para sugerir CIDs baseados nas notas
  useEffect(() => {
    if (clinicalData.notes.length > 5) {
      const notesLower = clinicalData.notes.toLowerCase();
      // Simulação simples de NLP: busca palavras chave na descrição dos CIDs
      const matches = MOCK_ICD_DB.filter(entry => {
         const words = entry.description.toLowerCase().split(' ');
         // Se a nota contiver alguma palavra chave significativa do CID (ignorando 'de', 'do', etc)
         return words.some(w => w.length > 4 && notesLower.includes(w));
      }).slice(0, 3); // Top 3 sugestões
      setAiSuggestions(matches);
    } else {
      setAiSuggestions([]);
    }
  }, [clinicalData.notes]);

  const setStep = (s: number) => updateNewCaseData({ step: s });
  const setSelectedPatient = (p: any) => updateNewCaseData({ patient: p });
  
  // Atualizadores específicos para estrutura dual
  const updateMainDiagnosis = (code: string, description: string) => {
    updateNewCaseData({ clinicalData: { ...clinicalData, mainDiagnosis: { code, description } } });
  };

  const updateSecondaryDiagnosis = (code: string, description: string) => {
    updateNewCaseData({ clinicalData: { ...clinicalData, secondaryDiagnosis: { code, description } } });
  };

  const setClinicalDataNotes = (notes: string) => updateNewCaseData({ clinicalData: { ...clinicalData, notes } });
  const setUrgencyData = (data: any) => updateNewCaseData({ urgencyData: { ...urgencyData, ...data } });
  const setSelectedRegulators = (regs: string[]) => updateNewCaseData({ selectedRegulators: regs });

  const handleCancel = () => {
    if(confirm('Deseja cancelar a solicitação? Todos os dados serão perdidos.')) {
      resetNewCaseData();
      navigate(-1);
    }
  };

  const handleCreateCase = () => {
    if (selectedRegulators.length === 0) {
      alert('Por favor, selecione ao menos um Nó Regulador de destino.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      resetNewCaseData(); 
      navigate('/aps');
    }, 2000);
  };

  const toggleRegulator = (id: string) => {
    if (selectedRegulators.includes(id)) {
      setSelectedRegulators(selectedRegulators.filter(r => r !== id));
    } else {
      setSelectedRegulators([...selectedRegulators, id]);
    }
  };

  const toggleAllRegulators = () => {
    if (selectedRegulators.length === regulators.length) {
      setSelectedRegulators([]);
    } else {
      setSelectedRegulators(regulators.map(r => r.id));
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-fade-in-up pb-20">
      
      {/* HEADER & TITULO */}
      <div className="flex flex-col gap-6">
        <button onClick={handleCancel} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-colors w-fit">
          <ArrowLeft size={16} /> Cancelar e Voltar
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nova Solicitação de Regulação</h1>
          <p className="text-slate-500 font-medium mt-1">Complete o formulário passo a passo para gerar o protocolo federado.</p>
        </div>
      </div>

      {/* STEPPER VISUAL */}
      <div className="bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm">
         <div className="flex justify-between items-center relative px-4 md:px-10 py-4">
            {/* Linha de Conexão */}
            <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-0 hidden md:block"></div>
            <div 
              className="absolute left-10 h-1 bg-green-500 top-1/2 -translate-y-1/2 transition-all duration-500 -z-0 hidden md:block" 
              style={{ width: `${((step - 1) / (stepsLabels.length - 1)) * 100}%` }}
            ></div>

            {stepsLabels.map((label, idx) => {
               const stepNum = idx + 1;
               const isActive = step === stepNum;
               const isCompleted = step > stepNum;

               return (
                 <div key={idx} className="relative z-10 flex flex-col items-center gap-2 cursor-pointer" onClick={() => step > stepNum && setStep(stepNum)}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all border-4 ${isActive ? 'bg-blue-600 text-white border-blue-100 shadow-lg scale-110' : isCompleted ? 'bg-green-500 text-white border-green-500' : 'bg-white text-slate-300 border-slate-200'}`}>
                       {isCompleted ? <CheckCircle size={16} strokeWidth={4}/> : stepNum}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-slate-300'}`}>{label}</span>
                 </div>
               );
            })}
         </div>
      </div>

      {/* CARD PRINCIPAL DE CONTEÚDO */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-visible min-h-[500px] flex flex-col relative">
        <div className="flex-1 p-8 md:p-12">
          
          {/* ETAPA 1: PACIENTE */}
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
               <h3 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4">Informação do Paciente</h3>
               
               {/* Busca */}
               {!selectedPatient ? (
                 <div className="space-y-6">
                    <div className="relative group">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                        autoFocus
                        placeholder="Buscar por CPF, CNS ou Nome..." 
                        className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none font-bold text-sm focus:border-blue-500 transition-all" 
                      />
                    </div>

                    {search.length > 1 && (
                      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-lg">
                         {filteredSearchPatients.length > 0 ? (
                           <div className="divide-y divide-slate-50">
                             {filteredSearchPatients.map(p => (
                               <div key={p.id} onClick={() => setSelectedPatient(p)} className="p-4 hover:bg-blue-50 cursor-pointer transition-colors flex justify-between items-center group">
                                  <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">{p.name.charAt(0)}</div>
                                     <div>
                                        <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                                        <p className="text-xs text-slate-500 font-mono">CPF: {p.cpf}</p>
                                     </div>
                                  </div>
                                  <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600"/>
                               </div>
                             ))}
                           </div>
                         ) : (
                           <div className="p-8 text-center">
                              <p className="text-slate-400 font-bold text-sm mb-4">Nenhum paciente encontrado na base federada.</p>
                              <button onClick={() => openModal('RegisterPatientModal')} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 mx-auto">
                                <UserPlus size={14}/> Cadastrar Novo
                              </button>
                           </div>
                         )}
                      </div>
                    )}
                 </div>
               ) : (
                 /* Paciente Selecionado (Inputs Travados) */
                 <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">CPF do Paciente *</label>
                          <input disabled value={selectedPatient.cpf} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed outline-none" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Idade *</label>
                          <input disabled value={calculateAge(selectedPatient.birthDate)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed outline-none" />
                       </div>
                       <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome do Paciente *</label>
                          <div className="relative">
                             <input disabled value={selectedPatient.name} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed outline-none" />
                             <button onClick={() => setSelectedPatient(null)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Trocar</button>
                          </div>
                       </div>
                       <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Telefone de Contato *</label>
                          <input disabled value={selectedPatient.phone} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed outline-none" />
                       </div>
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* ETAPA 2: DIAGNÓSTICO (REESTRUTURADO) */}
          {step === 2 && (
            <div className="space-y-10 animate-in slide-in-from-right duration-300">
               
               {/* 1. NOTAS CLÍNICAS (AGORA NO TOPO) */}
               <div className="space-y-4">
                  <div className="flex justify-between items-end px-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       1. Anamnese & Notas Clínicas <span className="text-red-500">*</span>
                     </label>
                     <span className="text-[9px] font-bold text-blue-600 uppercase flex items-center gap-1">
                        <Sparkles size={12}/> Análise em tempo real ativa
                     </span>
                  </div>
                  <textarea 
                    value={clinicalData.notes}
                    onChange={e => setClinicalDataNotes(e.target.value)}
                    placeholder="Descreva o estado clínico do paciente, sintomas, achados relevantes, medicamentos atuais..."
                    className="w-full p-6 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:border-blue-500 font-medium text-slate-700 h-48 resize-none transition-all shadow-sm focus:shadow-md"
                  />
                  
                  {/* BARRA DE SUGESTÕES IA */}
                  {aiSuggestions.length > 0 && (
                     <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 text-indigo-800">
                           <Lightbulb size={16} className="text-amber-500 fill-current" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Sugestões Baseadas nos Sintomas:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {aiSuggestions.map((sug, idx) => (
                              <div key={idx} className="flex items-center bg-white border border-indigo-100 rounded-lg p-1 pr-3 shadow-sm hover:shadow-md transition-all">
                                 <div className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-[10px] font-black mr-2">{sug.code}</div>
                                 <span className="text-[10px] font-medium text-slate-700 mr-3">{sug.description}</span>
                                 <div className="flex gap-1">
                                    <button 
                                      onClick={() => updateMainDiagnosis(sug.code, sug.description)}
                                      className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-bold rounded hover:bg-blue-700 transition-colors uppercase"
                                    >
                                      Principal
                                    </button>
                                    <button 
                                      onClick={() => updateSecondaryDiagnosis(sug.code, sug.description)}
                                      className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[8px] font-bold rounded hover:bg-slate-300 transition-colors uppercase"
                                    >
                                      Secund.
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>

               <div className="w-full h-px bg-slate-100"></div>

               {/* 2. CAMPOS DE DIAGNÓSTICO ESTRUTURADO (ICDSelectionRow) */}
               <div className="space-y-6">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">2. Classificação Internacional de Doenças (CID)</h3>
                  
                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl mb-6 flex gap-4">
                     <Info size={20} className="text-slate-400 shrink-0 mt-0.5" />
                     <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-700">Responsabilidade Técnica</p>
                        <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
                           O médico solicitante é responsável pela classificação. Você pode utilizar a busca automática, aceitar sugestões ou inserir códigos e descrições manualmente (texto livre).
                        </p>
                     </div>
                  </div>

                  <ICDSelectionRow 
                    label="Diagnóstico Principal"
                    selectedCode={clinicalData.mainDiagnosis.code}
                    selectedDescription={clinicalData.mainDiagnosis.description}
                    onUpdate={updateMainDiagnosis}
                    required
                  />

                  <ICDSelectionRow 
                    label="Diagnóstico Secundário (Opcional)"
                    selectedCode={clinicalData.secondaryDiagnosis.code}
                    selectedDescription={clinicalData.secondaryDiagnosis.description}
                    onUpdate={updateSecondaryDiagnosis}
                  />
               </div>
            </div>
          )}

          {/* ETAPA 3: URGÊNCIA */}
          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
               <h3 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4">Classificação de Urgência</h3>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Prioridade *</label>
                     <select 
                        value={urgencyData.priority}
                        onChange={e => setUrgencyData({ priority: e.target.value as any })}
                        className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold cursor-pointer"
                     >
                        <option value="NORMAL">Normal - Atendimento Eletivo</option>
                        <option value="URGENTE">Urgente - Requer atenção rápida</option>
                        <option value="EMERGÊNCIA">Emergência - Risco imediato de vida</option>
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Justificativa da Urgência *</label>
                     <textarea 
                        value={urgencyData.justification}
                        onChange={e => setUrgencyData({ justification: e.target.value })}
                        placeholder="Explique por que esta solicitação requer a prioridade selecionada..."
                        className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium h-32 resize-none transition-all"
                     />
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                     <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
                     <p className="text-xs text-blue-800 font-medium leading-relaxed">
                        Nota: Solicitações urgentes entram em filas prioritárias auditadas. O uso indevido de prioridade "Emergência" pode gerar notificações de compliance.
                     </p>
                  </div>
               </div>
            </div>
          )}

          {/* ETAPA 4: DOCUMENTOS */}
          {step === 4 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
               <h3 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4">Documentos Clínicos</h3>
               
               <p className="text-slate-500 text-sm font-medium">Adjunte documentos relevantes (exames, imagens, relatórios). Opcional mas recomendado para agilizar a regulação.</p>

               <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center space-y-4 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => openDrawer('UploadDocumentDrawer', { requestId: 'NEW', type: 'Anexo Geral' })}>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-slate-400">
                     <UploadCloud size={32}/>
                  </div>
                  <div>
                     <p className="text-sm font-bold text-slate-700">Clique para selecionar arquivos locais</p>
                     <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG (máx. 10MB)</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => navigate('/aps/case/new/search')} className="p-4 rounded-xl border border-slate-200 flex items-center gap-3 hover:border-blue-500 hover:bg-blue-50 transition-all group shadow-sm">
                     <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors"><Globe size={18}/></div>
                     <div className="text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Busca Técnica Federada</p>
                     </div>
                  </button>
                  <button onClick={() => openModal('NotifyCitizenModal', { patient: selectedPatient?.name })} className="p-4 rounded-xl border border-slate-200 flex items-center gap-3 hover:border-amber-500 hover:bg-amber-50 transition-all group shadow-sm">
                     <div className="p-2 bg-amber-100 text-amber-600 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors"><Smartphone size={18}/></div>
                     <div className="text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">App do Cidadão</p>
                        <p className="text-xs font-bold text-slate-900">Solicitar envio pelo paciente</p>
                     </div>
                  </button>
               </div>

               {/* Lista de Anexos */}
               {attachedDocs.length > 0 && (
                  <div className="space-y-2 pt-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Arquivos Anexados ({attachedDocs.length})</p>
                     {attachedDocs.map((doc, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-blue-300 transition-all">
                           <div className="flex items-center gap-3 overflow-hidden">
                              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><FileText size={14} /></div>
                              <div className="overflow-hidden">
                                 <span className="text-xs font-bold text-slate-700 truncate block">{doc.name}</span>
                                 <span className="text-[9px] text-slate-400 uppercase tracking-wide">{doc.node || 'Upload Local'}</span>
                              </div>
                           </div>
                           <button onClick={() => removeAttachedDoc(doc.id)} className="text-slate-300 hover:text-red-500 p-2"><X size={16}/></button>
                        </div>
                     ))}
                  </div>
               )}
            </div>
          )}

          {/* ETAPA 5: REVISÃO E ENVIO */}
          {step === 5 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
               <h3 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4 no-print">Revisão e Confirmação</h3>
               
               <div className="bg-white border-2 border-slate-300 shadow-2xl p-12 max-w-4xl mx-auto relative font-serif text-slate-800">
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                     <Globe size={400} />
                  </div>

                  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center rounded">
                           <Building2 size={32} />
                        </div>
                        <div>
                           <h1 className="text-2xl font-black uppercase tracking-tight leading-none text-slate-900 font-sans">Solicitação de Regulação</h1>
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 font-sans">Sistema Único de Saúde • Federação Nacional</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-bold text-slate-500 uppercase font-sans">Data Emissão</p>
                        <p className="text-lg font-black text-slate-900 font-sans">{new Date().toLocaleDateString()}</p>
                     </div>
                  </div>

                  {/* Solicitante */}
                  <div className="mb-8">
                     <h3 className="text-[10px] font-black text-white bg-slate-900 px-3 py-1 uppercase tracking-widest w-fit mb-4 font-sans">1. Unidade Solicitante</h3>
                     <div className="grid grid-cols-3 gap-6 text-xs uppercase border border-slate-200 p-4">
                        <div>
                           <span className="block font-bold text-slate-400 text-[9px] mb-1 font-sans">Profissional Solicitante</span>
                           <span className="font-bold">{user?.name}</span>
                        </div>
                        <div>
                           <span className="block font-bold text-slate-400 text-[9px] mb-1 font-sans">Registro / Cargo</span>
                           <span className="font-bold">{user?.role} / {user?.registryNumber || 'N/A'}</span>
                        </div>
                        <div>
                           <span className="block font-bold text-slate-400 text-[9px] mb-1 font-sans">Unidade (CNES)</span>
                           <span className="font-bold">{user?.nodeName}</span>
                        </div>
                     </div>
                  </div>

                  {/* Paciente */}
                  <div className="mb-8">
                     <h3 className="text-[10px] font-black text-white bg-slate-900 px-3 py-1 uppercase tracking-widest w-fit mb-4 font-sans">2. Identificação do Paciente</h3>
                     <div className="grid grid-cols-4 gap-6 text-xs uppercase border border-slate-200 p-4">
                        <div className="col-span-2">
                           <span className="block font-bold text-slate-400 text-[9px] mb-1 font-sans">Nome Completo</span>
                           <span className="font-bold">{selectedPatient?.name}</span>
                        </div>
                        <div>
                           <span className="block font-bold text-slate-400 text-[9px] mb-1 font-sans">CPF</span>
                           <span className="font-bold font-mono">{selectedPatient?.cpf}</span>
                        </div>
                        <div>
                           <span className="block font-bold text-slate-400 text-[9px] mb-1 font-sans">Idade</span>
                           <span className="font-bold">{calculateAge(selectedPatient?.birthDate)} anos</span>
                        </div>
                     </div>
                  </div>

                  {/* Dados Clínicos & Urgência */}
                  <div className="mb-8">
                     <h3 className="text-[10px] font-black text-white bg-slate-900 px-3 py-1 uppercase tracking-widest w-fit mb-4 font-sans">3. Dados Clínicos e Classificação</h3>
                     <div className="border border-slate-200 p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <span className="block font-bold text-slate-400 text-[9px] mb-1 font-sans uppercase">Diagnóstico Principal</span>
                              <span className="font-bold text-sm">
                                {clinicalData.mainDiagnosis.code ? `${clinicalData.mainDiagnosis.code} - ` : ''}{clinicalData.mainDiagnosis.description}
                              </span>
                           </div>
                           <div>
                              <span className="block font-bold text-slate-400 text-[9px] mb-1 font-sans uppercase">Prioridade</span>
                              <span className={`inline-block px-2 py-0.5 text-[10px] font-black font-sans uppercase border ${urgencyData.priority === 'EMERGÊNCIA' ? 'border-red-600 text-red-600' : 'border-blue-600 text-blue-600'}`}>
                                 {urgencyData.priority}
                              </span>
                           </div>
                        </div>

                        {/* Diagnóstico Secundário (Condicional) - MOSTRADO SI EXISTE */}
                        {(clinicalData.secondaryDiagnosis.code || clinicalData.secondaryDiagnosis.description) && (
                           <div className="pt-2 border-t border-slate-100">
                              <span className="block font-bold text-slate-400 text-[9px] mb-1 font-sans uppercase">Diagnóstico Secundário</span>
                              <span className="font-bold text-sm text-slate-700">
                                {clinicalData.secondaryDiagnosis.code ? `${clinicalData.secondaryDiagnosis.code} - ` : ''}{clinicalData.secondaryDiagnosis.description}
                              </span>
                           </div>
                        )}

                        <div>
                           <span className="block font-bold text-slate-400 text-[9px] mb-1 font-sans uppercase">Resumo Clínico / Justificativa</span>
                           <p className="text-sm font-medium leading-relaxed italic bg-slate-50 p-3 border border-slate-100">
                              "{clinicalData.notes}"
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Direcionamento */}
                  <div className="mb-12">
                     <h3 className="text-[10px] font-black text-white bg-slate-900 px-3 py-1 uppercase tracking-widest w-fit mb-4 font-sans">4. Direcionamento (Nós Reguladores)</h3>
                     
                     <div className="border border-slate-200 p-4 bg-slate-50">
                        <div className="mb-4 font-sans">
                           <button 
                              onClick={() => setIsRegulatorDropdownOpen(!isRegulatorDropdownOpen)}
                              className="w-full p-3 bg-white border border-slate-300 text-left text-xs font-bold flex justify-between items-center hover:border-slate-400 transition-colors"
                           >
                              <span>{selectedRegulators.length > 0 ? `${selectedRegulators.length} Centrais Selecionadas` : 'Selecionar Centrais de Destino...'}</span>
                              <ChevronDown size={14}/>
                           </button>
                           {isRegulatorDropdownOpen && (
                              <div className="bg-white border border-slate-300 mt-1 max-h-[150px] overflow-y-auto shadow-lg relative z-10">
                                 <button onClick={toggleAllRegulators} className="w-full text-left p-2 text-[10px] font-black uppercase text-blue-600 border-b border-slate-100 hover:bg-slate-50">
                                    {selectedRegulators.length === regulators.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                                 </button>
                                 {regulators.map(r => (
                                    <div key={r.id} onClick={() => toggleRegulator(r.id)} className="flex items-center gap-2 p-2 hover:bg-slate-50 cursor-pointer">
                                       <div className={`w-4 h-4 border flex items-center justify-center ${selectedRegulators.includes(r.id) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}>
                                          {selectedRegulators.includes(r.id) && <CheckSquare size={10}/>}
                                       </div>
                                       <span className="text-[10px] font-bold uppercase">{r.name}</span>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                           {selectedRegulators.length === 0 && <span className="text-xs text-slate-400 italic">Nenhum destino selecionado. Obrigatório.</span>}
                           {selectedRegulators.map(id => {
                              const reg = regulators.find(r => r.id === id);
                              return (
                                 <div key={id} className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-1 text-[10px] font-black uppercase shadow-sm">
                                    {reg?.name} <button onClick={() => toggleRegulator(id)}><X size={10} className="hover:text-red-500"/></button>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  </div>

                  {/* Assinatura */}
                  <div className="pt-8 border-t-2 border-slate-900 flex justify-between items-end font-sans mt-auto">
                     <div>
                        <div className="flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                           <Lock size={12}/> Assinado Digitalmente
                        </div>
                        <p className="font-mono text-[10px] text-slate-400">HASH: 0x{Math.random().toString(16).substring(2, 12).toUpperCase()}...{Math.random().toString(16).substring(2, 6).toUpperCase()}</p>
                        <p className="font-mono text-[10px] text-slate-400">TIMESTAMP: {new Date().toISOString()}</p>
                     </div>
                     <div className="text-center">
                        <div className="h-10 border-b border-slate-400 w-64 mb-2"></div>
                        <p className="text-xs font-black uppercase text-slate-900">{user?.name}</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">{user?.registryNumber || 'CRM/COREN NÃO INFORMADO'}</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

        </div>

        {/* FOOTER DE AÇÕES */}
        <div className="p-8 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
           {step > 1 ? (
             <button onClick={() => setStep(step - 1)} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                <ChevronLeft size={16}/> Anterior
             </button>
           ) : <div/>}

           {step < 5 ? (
             <button 
                onClick={() => setStep(step + 1)} 
                disabled={step === 1 && !selectedPatient}
                className={`px-8 py-4 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 ${step === 1 && !selectedPatient ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
             >
                Próximo <ChevronRight size={16}/>
             </button>
           ) : (
             <button 
                onClick={handleCreateCase}
                disabled={loading || selectedRegulators.length === 0}
                className={`px-10 py-4 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2 active:scale-95 ${(selectedRegulators.length === 0 || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
             >
                {loading ? <Loader2 className="animate-spin" size={18}/> : <><CheckCircle size={18}/> Protocolar e Enviar</>}
             </button>
           )}
        </div>
      </div>
    </div>
  );
};
