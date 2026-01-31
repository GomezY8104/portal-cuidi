
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Search, Save, Send, UploadCloud, 
  FileText, Globe, AlertCircle, CheckCircle, X,
  UserPlus, ChevronRight, ChevronLeft, Smartphone,
  Printer, Lock, Sparkles, Lightbulb, Building2,
  ChevronDown, CheckSquare, Square, Phone, Heart, Activity
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
    attachedDocs, 
    newCaseData,        
    updateNewCaseData,
    resetNewCaseData,
    user,
    removeAttachedDoc,
    addApsCase,
    addNotification // Add Notification
  } = useAppStore();

  // Usamos el step del store global para persistencia al navegar
  const { patient, clinicalData, urgencyData, step, selectedRegulators } = newCaseData;
  
  const [searchPatient, setSearchPatient] = useState('');
  const [specialty, setSpecialty] = useState('CARDIOLOGIA');
  const [aiSuggestions, setAiSuggestions] = useState<ICDEntry[]>([]);
  
  // Estado local para el dropdown de reguladores en el paso 5
  const [isRegulatorDropdownOpen, setIsRegulatorDropdownOpen] = useState(false);
  const regulatorDropdownRef = useRef<HTMLDivElement>(null);

  // MOCK de Nodos Reguladores Disponibles
  const AVAILABLE_REGULATORS = [
    { id: 'REG-01', name: 'Central de Regulação de Vagas - Regional 01' },
    { id: 'REG-02', name: 'Complexo Regulador Estadual (CROSS)' },
    { id: 'REG-03', name: 'Regulação de Alta Complexidade - Cardiologia' },
    { id: 'REG-04', name: 'Central de Leitos de Retaguarda' }
  ];

  // --- STEPS CONFIG ---
  const stepsList = [
    { num: 1, label: 'Identificação' },
    { num: 2, label: 'Dados Clínicos' },
    { num: 3, label: 'Classificação' },
    { num: 4, label: 'Documentos' },
    { num: 5, label: 'Revisão' }
  ];

  // Click outside handler para el dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (regulatorDropdownRef.current && !regulatorDropdownRef.current.contains(event.target as Node)) {
        setIsRegulatorDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- HANDLERS ---
  const setStep = (s: number) => updateNewCaseData({ step: s });

  const handleSelectPatient = (p: any) => {
    updateNewCaseData({ patient: p });
    setSearchPatient('');
  };

  const updateDiagnosis = (code: string, desc: string) => {
    updateNewCaseData({ clinicalData: { ...clinicalData, mainDiagnosis: { code, description: desc } } });
  };

  // Simulação de IA para sugestão de CID baseada no texto
  useEffect(() => {
    if (clinicalData.notes.length > 3) {
      const text = clinicalData.notes.toLowerCase();
      const suggestions = MOCK_ICD_DB.filter(icd => {
         const words = icd.description.toLowerCase().split(' ');
         return words.some(w => w.length > 3 && text.includes(w));
      }).slice(0, 3);
      setAiSuggestions(suggestions);
    } else {
      setAiSuggestions([]);
    }
  }, [clinicalData.notes]);

  const applySuggestion = (icd: ICDEntry) => {
    updateDiagnosis(icd.code, icd.description);
  };

  const handleSubmit = () => {
    if(!patient || !clinicalData.mainDiagnosis.code || !clinicalData.notes) {
      addNotification({ type: 'error', message: 'Dados incompletos. Verifique a revisão.' });
      return;
    }
    if (selectedRegulators.length === 0) {
      addNotification({ type: 'warning', message: 'Selecione ao menos uma central de regulação de destino.' });
      return;
    }
    
    // PERSISTÊNCIA NA FILA (Store)
    addApsCase({
      id: `APS-24-${Math.floor(Math.random() * 10000)}`,
      patient: patient.name,
      spec: specialty,
      priority: urgencyData.priority,
      status: 'PENDENTE',
      date: new Date().toLocaleDateString(),
      update: 'Agora',
      hasMessage: false
    });

    addNotification({ type: 'success', message: 'Solicitação protocolada com sucesso!' });
    resetNewCaseData(); // Resetea todo, incluido el step a 1
    navigate('/aps');
  };

  const nextStep = () => {
    if (step === 1 && !patient) {
      addNotification({ type: 'warning', message: 'Selecione um paciente para continuar.' });
      return;
    }
    if (step === 2 && (!clinicalData.mainDiagnosis.code || !clinicalData.notes)) {
      addNotification({ type: 'warning', message: 'Preencha o diagnóstico e a história clínica.' });
      return;
    }
    setStep(Math.min(step + 1, 5));
  };

  const prevStep = () => setStep(Math.max(step - 1, 1));

  // Handlers para Reguladores
  const toggleRegulator = (regName: string) => {
    const current = selectedRegulators || [];
    const exists = current.includes(regName);
    updateNewCaseData({
      selectedRegulators: exists 
        ? current.filter(r => r !== regName)
        : [...current, regName]
    });
  };

  const toggleAllRegulators = () => {
    const allNames = AVAILABLE_REGULATORS.map(r => r.name);
    const current = selectedRegulators || [];
    const isAllSelected = current.length === allNames.length;
    
    updateNewCaseData({
      selectedRegulators: isAllSelected ? [] : allNames
    });
  };

  // --- FILTRO PACIENTE ---
  const filteredPatients = useMemo(() => {
    if(searchPatient.length < 2) return [];
    return MOCK_PATIENTS.filter(p => p.name.toLowerCase().includes(searchPatient.toLowerCase()) || p.cpf.includes(searchPatient));
  }, [searchPatient]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 font-sans text-slate-900 animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-300 pb-4 bg-white p-4 rounded-sm shadow-sm sticky top-0 z-10">
         <div className="flex items-center gap-4">
            <button onClick={() => navigate('/aps')} className="p-2 hover:bg-slate-100 rounded text-slate-500">
               <ArrowLeft size={20}/>
            </button>
            <div>
               <h1 className="text-xl font-black uppercase tracking-tight text-slate-800">Nova Solicitação</h1>
               <p className="text-xs text-slate-500 font-medium">Regulação Assistencial • Passo {step} de 5</p>
            </div>
         </div>
         
         {/* STEPPER VISUAL */}
         <div className="hidden md:flex gap-2">
            {stepsList.map(s => (
               <div key={s.num} className={`flex items-center gap-2 px-3 py-1 rounded-sm text-[10px] font-bold uppercase ${step === s.num ? 'bg-slate-900 text-white' : step > s.num ? 'bg-slate-200 text-slate-600' : 'text-slate-300'}`}>
                  <span>{s.num}. {s.label}</span>
               </div>
            ))}
         </div>
      </div>

      <div className="px-2 min-h-[500px]">
         
         {/* PASSO 1: IDENTIFICAÇÃO */}
         {step === 1 && (
            <section className="bg-white border border-slate-300 rounded-sm overflow-visible shadow-sm animate-in slide-in-from-right">
                <div className="bg-slate-100 px-6 py-3 border-b border-slate-300 flex justify-between items-center">
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-600">1. Identificação do Paciente</h3>
                   {patient && <button onClick={() => updateNewCaseData({ patient: null })} className="text-[10px] font-bold text-red-600 hover:underline uppercase">Alterar Paciente</button>}
                </div>
                
                <div className="p-8">
                   {!patient ? (
                      <div className="max-w-2xl mx-auto space-y-6">
                         <div className="space-y-2 relative">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Buscar Paciente (Nome, CPF ou CNS)</label>
                            <div className="flex gap-2">
                               <div className="relative flex-1">
                                  <input 
                                     value={searchPatient}
                                     onChange={e => setSearchPatient(e.target.value)}
                                     className="w-full p-4 pl-12 border-2 border-slate-200 rounded-sm text-sm font-bold focus:border-blue-600 outline-none uppercase bg-white text-slate-900 placeholder:text-slate-300 shadow-inner"
                                     placeholder="DIGITE PARA PESQUISAR NA BASE..."
                                     autoFocus
                                  />
                                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                                  
                                  {/* DROPDOWN DE RESULTADOS */}
                                  {searchPatient.length > 1 && (
                                     <div className="absolute top-full left-0 w-full bg-white border border-slate-300 mt-1 shadow-2xl z-50 max-h-60 overflow-y-auto rounded-sm">
                                        {filteredPatients.map(p => (
                                           <button key={p.id} onClick={() => handleSelectPatient(p)} className="w-full text-left p-4 hover:bg-blue-50 border-b border-slate-100 last:border-0 group transition-colors">
                                              <p className="font-black text-sm text-slate-800 group-hover:text-blue-700 uppercase">{p.name}</p>
                                              <div className="flex gap-4 mt-1 text-[10px] font-bold text-slate-500 font-mono">
                                                 <span>CPF: {p.cpf}</span>
                                                 <span>CNS: {p.cns}</span>
                                                 <span>NASC: {p.birthDate}</span>
                                              </div>
                                           </button>
                                        ))}
                                        {filteredPatients.length === 0 && (
                                           <div className="p-4 text-center text-xs text-slate-400 italic font-bold uppercase">Nenhum paciente encontrado.</div>
                                        )}
                                     </div>
                                  )}
                               </div>
                               <button 
                                 onClick={() => openModal('RegisterPatientModal', { 
                                    onPatientRegistered: (p: any) => handleSelectPatient(p)
                                 })} 
                                 className="px-6 bg-slate-100 border border-slate-300 text-slate-700 font-black text-xs uppercase rounded-sm hover:bg-slate-200 flex items-center gap-2"
                               >
                                  <UserPlus size={16}/> Novo
                               </button>
                            </div>
                         </div>
                      </div>
                   ) : (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 border border-slate-200 bg-slate-50 rounded-sm">
                         {/* LINHA 1 */}
                         <div className="md:col-span-2">
                            <p className="font-bold text-slate-400 uppercase text-[9px] tracking-widest">Nome Completo</p>
                            <p className="font-black text-lg text-slate-900 uppercase">{patient.name}</p>
                         </div>
                         <div>
                            <p className="font-bold text-slate-400 uppercase text-[9px] tracking-widest">CPF</p>
                            <p className="font-mono font-bold text-slate-700">{patient.cpf}</p>
                         </div>
                         <div>
                            <p className="font-bold text-slate-400 uppercase text-[9px] tracking-widest">Cartão SUS (CNS)</p>
                            <p className="font-mono font-bold text-slate-700">{patient.cns || '7000.0000.0000.0000'}</p>
                         </div>

                         {/* LINHA 2 - NOVOS CAMPOS */}
                         <div>
                            <p className="font-bold text-slate-400 uppercase text-[9px] tracking-widest">Data de Nascimento</p>
                            <p className="font-bold text-slate-700">{patient.birthDate}</p>
                         </div>
                         <div>
                            <p className="font-bold text-slate-400 uppercase text-[9px] tracking-widest">Sexo / Gênero</p>
                            <p className="font-bold text-slate-700 uppercase">{patient.gender || 'NÃO INFORMADO'}</p>
                         </div>
                         <div>
                            <p className="font-bold text-slate-400 uppercase text-[9px] tracking-widest flex items-center gap-1"><Heart size={10} className="text-red-500"/> Tipo Sanguíneo</p>
                            <p className="font-black text-slate-700 uppercase">{patient.bloodType || 'N/A'}</p>
                         </div>
                         <div>
                            <p className="font-bold text-slate-400 uppercase text-[9px] tracking-widest flex items-center gap-1"><Phone size={10}/> Telefone</p>
                            <p className="font-bold text-slate-700 uppercase">{patient.phone || '(00) 00000-0000'}</p>
                         </div>

                         {/* LINHA 3 */}
                         <div className="md:col-span-2">
                            <p className="font-bold text-slate-400 uppercase text-[9px] tracking-widest">Nome da Mãe</p>
                            <p className="font-bold text-slate-700 uppercase">MARIA HELENA DA SILVA (MOCK)</p>
                         </div>
                         <div className="md:col-span-2">
                            <p className="font-bold text-slate-400 uppercase text-[9px] tracking-widest flex items-center gap-1"><AlertCircle size={10} className="text-amber-500"/> Contato de Emergência</p>
                            <p className="font-bold text-slate-700 uppercase">{patient.emergencyContact || 'NÃO CADASTRADO'}</p>
                         </div>

                         {/* LINHA 4 */}
                         <div className="md:col-span-4 border-t border-slate-200 pt-2 mt-2">
                            <p className="font-bold text-slate-400 uppercase text-[9px] tracking-widest">Endereço Residencial</p>
                            <p className="font-bold text-slate-700 uppercase">{patient.address}</p>
                         </div>
                      </div>
                   )}
                </div>
            </section>
         )}

         {/* PASSO 2: DADOS CLÍNICOS */}
         {step === 2 && (
            <section className="bg-white border border-slate-300 rounded-sm overflow-hidden shadow-sm animate-in slide-in-from-right">
                <div className="bg-slate-100 px-6 py-3 border-b border-slate-300">
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-600">2. Dados Clínicos e Classificação</h3>
                </div>
                <div className="p-8 space-y-8">
                   
                   <div className="space-y-2">
                      <div className="flex justify-between items-center">
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">História Clínica / Queixa Principal <span className="text-red-500">*</span></label>
                         {aiSuggestions.length > 0 && (
                            <span className="text-[9px] font-black text-blue-600 uppercase flex items-center gap-1 animate-pulse"><Sparkles size={12}/> Sugestões de CID encontradas</span>
                         )}
                      </div>
                      <textarea 
                         value={clinicalData.notes}
                         onChange={e => updateNewCaseData({ clinicalData: { ...clinicalData, notes: e.target.value } })}
                         className="w-full p-4 border border-slate-300 rounded-sm text-sm font-medium text-slate-900 bg-white h-40 resize-none outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-inner"
                         placeholder="Descreva a anamnese, exame físico e justificativa da solicitação..."
                      />
                      {/* SUGESTÕES DE IA */}
                      {aiSuggestions.length > 0 && (
                         <div className="flex flex-wrap gap-2 mt-2 bg-blue-50 p-3 rounded-sm border border-blue-100">
                            <div className="flex items-center gap-1 text-blue-700 mr-2">
                               <Lightbulb size={14}/>
                               <span className="text-[10px] font-bold uppercase">Sugerido:</span>
                            </div>
                            {aiSuggestions.map(icd => (
                               <button 
                                 key={icd.code} 
                                 onClick={() => applySuggestion(icd)}
                                 className="bg-white border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                               >
                                  {icd.code} - {icd.description}
                               </button>
                            ))}
                         </div>
                      )}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4 bg-slate-50 p-4 border border-slate-200 rounded-sm">
                         <ICDSelectionRow 
                            label="Hipótese Diagnóstica (CID-10)" 
                            selectedCode={clinicalData.mainDiagnosis.code} 
                            selectedDescription={clinicalData.mainDiagnosis.description} 
                            onUpdate={updateDiagnosis} 
                            required
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Especialidade Solicitada <span className="text-red-500">*</span></label>
                         <select 
                            value={specialty} 
                            onChange={e => setSpecialty(e.target.value)}
                            className="w-full p-3 bg-white border border-slate-300 rounded-sm text-xs font-bold text-slate-700 outline-none uppercase focus:border-blue-600 cursor-pointer"
                         >
                            <option>CARDIOLOGIA</option>
                            <option>ORTOPEDIA</option>
                            <option>NEUROLOGIA</option>
                            <option>OFTALMOLOGIA</option>
                            <option>GINECOLOGIA</option>
                            <option>DERMATOLOGIA</option>
                         </select>
                      </div>
                   </div>
                </div>
            </section>
         )}

         {/* PASSO 3: CLASSIFICAÇÃO */}
         {step === 3 && (
            <section className="bg-white border border-slate-300 rounded-sm overflow-hidden shadow-sm animate-in slide-in-from-right">
                <div className="bg-slate-100 px-6 py-3 border-b border-slate-300">
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-600">3. Classificação de Risco</h3>
                </div>
                <div className="p-8">
                   <div className="space-y-6">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Selecione a Prioridade Clínica:</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         {['NORMAL', 'URGENTE', 'EMERGÊNCIA'].map(p => (
                            <label key={p} className={`flex flex-col items-center justify-center p-6 border-2 rounded-sm cursor-pointer transition-all hover:shadow-md ${urgencyData.priority === p ? (p === 'EMERGÊNCIA' ? 'bg-red-50 border-red-600 text-red-700' : p === 'URGENTE' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-blue-50 border-blue-600 text-blue-700') : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}>
                               <input 
                                  type="radio" 
                                  name="priority" 
                                  checked={urgencyData.priority === p} 
                                  onChange={() => updateNewCaseData({ urgencyData: { ...urgencyData, priority: p as any } })}
                                  className="hidden"
                               />
                               <span className="text-lg font-black uppercase">{p}</span>
                               <span className="text-[10px] font-bold mt-2 opacity-80 uppercase text-center">
                                  {p === 'NORMAL' ? 'Atendimento Eletivo (Fila)' : p === 'URGENTE' ? 'Prioridade na Regulação' : 'Risco de Morte / Sequelas'}
                               </span>
                            </label>
                         ))}
                      </div>
                      
                      {urgencyData.priority === 'EMERGÊNCIA' && (
                         <div className="p-4 bg-red-50 border border-red-200 rounded-sm flex gap-3 text-red-900 items-start animate-in fade-in">
                            <AlertCircle size={18} className="mt-0.5 shrink-0"/>
                            <p className="text-xs leading-relaxed font-bold">
                               Atenção: A classificação "EMERGÊNCIA" deve ser usada apenas para risco iminente de morte. O caso será auditado e poderá ser reclassificado.
                            </p>
                         </div>
                      )}
                   </div>
                </div>
            </section>
         )}

         {/* PASSO 4: DOCUMENTOS */}
         {step === 4 && (
            <section className="bg-white border border-slate-300 rounded-sm overflow-hidden shadow-sm animate-in slide-in-from-right">
                <div className="bg-slate-100 px-6 py-3 border-b border-slate-300 flex justify-between items-center">
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-600">4. Documentação Anexa</h3>
                   <div className="flex gap-2">
                      <button onClick={() => openModal('NotifyCitizenModal', { patient: patient?.name })} className="text-[10px] font-bold text-amber-600 uppercase flex items-center gap-1 hover:bg-amber-50 px-3 py-1.5 rounded-sm transition-all border border-amber-200 bg-white">
                         <Smartphone size={12}/> Solicitar ao Paciente
                      </button>
                      <button onClick={() => navigate('/aps/case/new/search')} className="text-[10px] font-bold text-blue-700 uppercase flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-sm transition-all border border-blue-200 bg-white">
                         <Globe size={12}/> Buscar na Rede
                      </button>
                      <button onClick={() => openDrawer('UploadDocumentDrawer', { requestId: 'NEW', type: 'Anexo Geral' })} className="text-[10px] font-bold text-slate-700 uppercase flex items-center gap-1 hover:bg-slate-50 px-3 py-1.5 rounded-sm transition-all border border-slate-300 bg-white">
                         <UploadCloud size={12}/> Upload Local
                      </button>
                   </div>
                </div>
                <div className="p-0">
                   <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-bold text-[9px] tracking-wider">
                         <tr><th className="px-6 py-3">Documento</th><th className="px-6 py-3">Origem</th><th className="px-6 py-3">Data</th><th className="px-6 py-3 text-right">Ação</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                         {attachedDocs.length === 0 && <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic bg-slate-50/30">Nenhum documento anexado. Utilize as opções acima.</td></tr>}
                         {attachedDocs.map(doc => (
                            <tr key={doc.id} className="hover:bg-slate-50">
                               <td className="px-6 py-3 font-bold uppercase">{doc.name}</td>
                               <td className="px-6 py-3 uppercase text-[10px]">{doc.node || 'LOCAL'}</td>
                               <td className="px-6 py-3 font-mono text-[10px]">{doc.date || 'HOJE'}</td>
                               <td className="px-6 py-3 text-right">
                                  <button onClick={() => removeAttachedDoc(doc.id)} className="text-red-500 hover:text-red-700 text-[10px] font-black uppercase flex items-center gap-1 ml-auto">
                                    <X size={12}/> Remover
                                  </button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
            </section>
         )}

         {/* PASSO 5: REVISÃO & DIRECIONAMENTO */}
         {step === 5 && (
            <section className="bg-white border border-slate-300 rounded-sm overflow-hidden shadow-lg animate-in slide-in-from-right flex flex-col items-center p-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                
                {/* DOCUMENTO DE REVISÃO */}
                <div className="bg-white border border-slate-200 w-full max-w-3xl shadow-2xl p-10 relative">
                   <div className="absolute top-0 left-0 w-full h-2 bg-slate-900"></div>
                   
                   <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-slate-900 text-white rounded-lg"><Building2 size={24}/></div>
                         <div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Solicitação de Regulação</h2>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Sistema Único de Saúde • Federação Nacional</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Data Emissão</p>
                         <p className="text-lg font-black text-slate-900">{new Date().toLocaleDateString()}</p>
                      </div>
                   </div>

                   {/* 1. Unidade */}
                   <div className="mb-8">
                      <div className="bg-slate-900 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest w-fit mb-2">1. Unidade Solicitante</div>
                      <div className="border border-slate-200 p-4 grid grid-cols-3 gap-4 text-xs bg-slate-50">
                         <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Profissional</p>
                            <p className="font-black text-slate-900 uppercase">{user?.name}</p>
                         </div>
                         <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Registro</p>
                            <p className="font-black text-slate-900 uppercase">{user?.registryNumber || 'CRM/COREN'}</p>
                         </div>
                         <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Unidade</p>
                            <p className="font-black text-slate-900 uppercase">{user?.nodeName}</p>
                         </div>
                      </div>
                   </div>

                   {/* 2. Paciente */}
                   <div className="mb-8">
                      <div className="bg-slate-900 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest w-fit mb-2">2. Identificação do Paciente</div>
                      <div className="border border-slate-200 p-4 grid grid-cols-3 gap-4 text-xs">
                         <div className="col-span-1">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Nome Completo</p>
                            <p className="font-black text-slate-900 uppercase">{patient?.name}</p>
                         </div>
                         <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">CPF</p>
                            <p className="font-black text-slate-900 uppercase">{patient?.cpf}</p>
                         </div>
                         <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Idade</p>
                            <p className="font-black text-slate-900 uppercase">{patient?.age || '58'} ANOS</p>
                         </div>
                      </div>
                   </div>

                   {/* 3. Dados Clínicos */}
                   <div className="mb-8">
                      <div className="bg-slate-900 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest w-fit mb-2">3. Dados Clínicos e Classificação</div>
                      <div className="border border-slate-200 p-4 text-xs space-y-4">
                         <div className="flex justify-between border-b border-slate-100 pb-2">
                            <div>
                               <p className="text-[9px] font-bold text-slate-400 uppercase">Diagnóstico Principal</p>
                               <p className="font-black text-slate-900 text-sm uppercase">{clinicalData.mainDiagnosis.code} - {clinicalData.mainDiagnosis.description}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-[9px] font-bold text-slate-400 uppercase">Prioridade</p>
                               <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${urgencyData.priority === 'EMERGÊNCIA' ? 'bg-red-600' : 'bg-blue-600'}`}>
                                  {urgencyData.priority}
                               </span>
                            </div>
                         </div>
                         <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Resumo Clínico / Justificativa</p>
                            <p className="font-medium text-slate-800 leading-relaxed italic bg-slate-50 p-3 rounded-sm border border-slate-100">
                               "{clinicalData.notes}"
                            </p>
                         </div>
                      </div>
                   </div>

                   {/* 4. Direcionamento (Multi-Select) */}
                   <div className="mb-8 relative z-20">
                      <div className="bg-slate-900 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest w-fit mb-2">4. Direcionamento (Nós Reguladores)</div>
                      
                      <div className="relative" ref={regulatorDropdownRef}>
                         <button 
                            onClick={() => setIsRegulatorDropdownOpen(!isRegulatorDropdownOpen)}
                            className="w-full p-4 border border-slate-200 bg-white flex justify-between items-center text-xs font-bold text-slate-700 outline-none hover:bg-slate-50 transition-colors"
                         >
                            <span>{selectedRegulators?.length > 0 ? `${selectedRegulators.length} Centrais Selecionadas` : 'Selecione os Reguladores de Destino...'}</span>
                            <ChevronDown size={14} className={`transition-transform ${isRegulatorDropdownOpen ? 'rotate-180' : ''}`} />
                         </button>

                         {isRegulatorDropdownOpen && (
                            <div className="absolute top-full left-0 w-full bg-white border border-slate-200 shadow-xl max-h-[200px] overflow-y-auto z-50">
                               <button 
                                  onClick={toggleAllRegulators}
                                  className="w-full text-left px-4 py-3 border-b border-slate-100 bg-slate-50 text-[10px] font-black uppercase text-blue-600 hover:bg-blue-100 transition-colors"
                               >
                                  {selectedRegulators?.length === AVAILABLE_REGULATORS.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                               </button>
                               {AVAILABLE_REGULATORS.map(reg => (
                                  <button 
                                    key={reg.id}
                                    onClick={() => toggleRegulator(reg.name)}
                                    className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50 flex items-center gap-3 transition-colors"
                                  >
                                     {selectedRegulators?.includes(reg.name) 
                                        ? <CheckSquare size={16} className="text-blue-600 shrink-0"/> 
                                        : <Square size={16} className="text-slate-300 shrink-0"/>
                                     }
                                     <span className="text-[10px] font-bold uppercase text-slate-700">{reg.name}</span>
                                  </button>
                               ))}
                            </div>
                         )}
                      </div>

                      {/* Selected Chips */}
                      {selectedRegulators?.length > 0 && (
                         <div className="flex flex-wrap gap-2 mt-3 p-3 bg-slate-50 border border-slate-100">
                            {selectedRegulators.map(name => (
                               <div key={name} className="px-3 py-1 bg-white border border-slate-200 rounded-sm text-[9px] font-black uppercase text-slate-600 flex items-center gap-2 shadow-sm">
                                  {name} <button onClick={() => toggleRegulator(name)} className="hover:text-red-500"><X size={10}/></button>
                               </div>
                            ))}
                         </div>
                      )}
                   </div>

                   {/* Footer Assinatura */}
                   <div className="pt-8 mt-10 border-t border-slate-200 flex justify-between items-end">
                      <div className="text-[8px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-1">
                         <Lock size={10}/> Assinado Digitalmente
                         <br/>HASH: 0x864917515A...A94E
                      </div>
                      <div className="text-center">
                         <div className="border-t border-slate-900 w-48 mb-1"></div>
                         <p className="text-[10px] font-black uppercase">{user?.name}</p>
                         <p className="text-[8px] font-bold text-slate-500 uppercase">{user?.role} - {user?.registryNumber}</p>
                      </div>
                   </div>
                </div>
            </section>
         )}

      </div>

      {/* FOOTER ACTIONS */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-2xl z-50">
         <div className="max-w-5xl mx-auto flex justify-between items-center">
            {step > 1 ? (
               <button onClick={prevStep} className="px-6 py-3 text-slate-500 font-bold uppercase text-xs tracking-widest hover:bg-slate-100 rounded-sm transition-all flex items-center gap-2">
                  <ChevronLeft size={16}/> Voltar
               </button>
            ) : <div></div>}
            
            {step < 5 ? (
               <button onClick={nextStep} className="px-8 py-3 bg-slate-900 text-white font-black uppercase text-xs tracking-widest hover:bg-slate-800 rounded-sm transition-all shadow-lg flex items-center gap-2">
                  Próximo Passo <ChevronRight size={16}/>
               </button>
            ) : (
               <div className="flex gap-4">
                  <button onClick={() => window.print()} className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-bold uppercase text-xs tracking-widest hover:bg-slate-50 rounded-sm transition-all flex items-center gap-2">
                     <Printer size={16}/> Imprimir Rascunho
                  </button>
                  <button onClick={handleSubmit} className="px-10 py-3 bg-blue-700 text-white font-black uppercase text-xs tracking-widest hover:bg-blue-800 rounded-sm transition-all shadow-xl flex items-center gap-2">
                     <Send size={16}/> Assinar e Enviar
                  </button>
               </div>
            )}
         </div>
      </div>

    </div>
  );
};
