
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, Search, UserPlus, Globe, 
  ChevronRight, CheckCircle, 
  Activity, Hospital, X,
  FileText, Plus, ListChecks,
  Trash2, RefreshCw, Microscope, ImageIcon, Video, User as UserIcon, MapPin, ChevronDown, Cpu, Eye, ArrowUpRight,
  ClipboardList, AlertTriangle, Building2, UploadCloud, Smartphone, Info, CheckSquare, Square, Paperclip, Fingerprint, Lock,
  Sparkles, Lightbulb, Thermometer, Heart, Wind, Gauge, Droplets, Zap, Navigation, Check, ChevronLeft, Save, Radio, Loader2, Siren, Ambulance, Bed
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_PATIENTS } from '../../mocks/seed';
import { MOCK_ICD_DB, ICDEntry } from '../../mocks/icd_seed'; 
import { ICDSelectionRow } from '../../components/Inputs/ICDSelectionRow'; 

export const NewUpaCasePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    openModal, 
    openDrawer, 
    user, 
    attachedDocs, 
    removeAttachedDoc, 
    addUpaCase,
    upaFlowData,
    updateUpaFlowData,
    resetUpaFlowData,
    addNotification
  } = useAppStore();
  
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  // Destructure data from global store to ensure persistence
  const { 
    step, 
    patient: selectedPatient, 
    clinicalData, 
    vitals, 
    regData, 
    selectedRegulators 
  } = upaFlowData;

  const stepsLabels = ['Dados do Paciente', 'Quadro Clínico', 'Regulação', 'Documentação', 'Revisão e Envio'];

  // Estados locais apenas para UI (Dropdowns)
  const [isRegulatorDropdownOpen, setIsRegulatorDropdownOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<ICDEntry[]>([]);

  const regulators = [
    { id: 'REG-01', name: 'Central de Regulação Estadual (SESA)' },
    { id: 'REG-02', name: 'Complexo Regulador Municipal de Urgência' },
    { id: 'REG-03', name: 'Central de Vagas de Alta Complexidade (CROSS)' },
    { id: 'REG-04', name: 'Regulação de Leitos de Retaguarda' }
  ];

  // --- HELPERS DE ATUALIZAÇÃO DO STORE ---
  const setStep = (s: number) => updateUpaFlowData({ step: s });
  const setSelectedPatient = (p: any) => updateUpaFlowData({ patient: p });
  
  const setClinical = (data: Partial<typeof clinicalData>) => updateUpaFlowData({ clinicalData: { ...clinicalData, ...data } });
  const setVitalsState = (data: Partial<typeof vitals>) => updateUpaFlowData({ vitals: { ...vitals, ...data } });
  const setRegDataState = (data: Partial<typeof regData>) => updateUpaFlowData({ regData: { ...regData, ...data } });
  const setSelectedRegulators = (regs: string[]) => updateUpaFlowData({ selectedRegulators: regs });

  const calculateAge = (birthDate: string) => {
    if(!birthDate) return 0;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const filteredSearchPatients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q.length < 2) return [];
    return MOCK_PATIENTS.filter(p => p.name.toLowerCase().includes(q) || p.cpf.includes(q));
  }, [search]);

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

  // Lógica de IA para sugerir CIDs
  useEffect(() => {
    if (clinicalData.history.length > 5) {
      const notesLower = clinicalData.history.toLowerCase();
      const matches = MOCK_ICD_DB.filter(entry => {
         const words = entry.description.toLowerCase().split(' ');
         return words.some(w => w.length > 4 && notesLower.includes(w));
      }).slice(0, 3);
      setAiSuggestions(matches);
    } else {
      setAiSuggestions([]);
    }
  }, [clinicalData.history]);

  // Ejecución de creación
  const executeCaseCreation = () => {
    const newCaseId = `SOL-${Math.floor(Math.random() * 100000)}`;
    
    addUpaCase({
        id: newCaseId,
        patientName: selectedPatient.name,
        cpf: selectedPatient.cpf,
        age: calculateAge(selectedPatient.birthDate),
        gender: selectedPatient.gender,
        arrival: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
        risk: regData.priority === 'VAGA_ZERO' || regData.priority === 'EMERGENCIA' ? 'VERMELHO' : 'AMARELO',
        stage: 'REGULATION',
        status: regData.priority === 'VAGA_ZERO' ? 'VAGA ZERO SOLICITADA' : 'Aguardando Vaga',
        complaint: clinicalData.history.substring(0, 30) + '...'
    });

    return newCaseId;
  };

  // Envío Final
  const handleSubmitTransfer = () => {
    if (!selectedPatient || !clinicalData.mainDiagnosis.code) {
        addNotification({ type: 'error', message: 'Dados incompletos. Verifique paciente e diagnóstico.' });
        return;
    }

    if (selectedRegulators.length === 0 && regData.priority !== 'VAGA_ZERO') {
        addNotification({ type: 'warning', message: 'Selecione ao menos uma central de regulação de destino.' });
        return;
    }

    // FLUXO DE VAGA ZERO (EMERGÊNCIA)
    if (regData.priority === 'VAGA_ZERO') {
        openModal('EmergencyRequestModal', {
            onSuccess: () => {
                executeCaseCreation();
                resetUpaFlowData();
                setTimeout(() => navigate('/upa'), 500);
            }
        });
        return;
    }

    // Fluxo Normal
    setLoading(true);
    setTimeout(() => {
        executeCaseCreation();
        resetUpaFlowData();
        setLoading(false);
        addNotification({ type: 'success', message: `Solicitação enviada para ${selectedRegulators.length} centrais com sucesso.` });
        navigate('/upa');
    }, 2000);
  };

  const DataPoint = ({ label, value, highlight = false }: any) => (
    <div className="space-y-1">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className={`text-xs font-bold ${highlight ? 'text-blue-700' : 'text-slate-800'} uppercase break-words border-b border-slate-200 pb-1`}>{value || '-'}</p>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-fade-in-up pb-20 font-sans">
      
      {/* HEADER FLAT */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-colors w-fit">
          <ArrowLeft size={16} /> Voltar
        </button>
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Solicitação de Transferência</h1>
                <p className="text-slate-500 font-medium mt-1 text-xs">Protocolo Unificado de Regulação de Urgência (CROSS/Nacional)</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidade Solicitante</p>
                <p className="text-sm font-black text-slate-800 uppercase flex items-center gap-2 justify-end"><Building2 size={16}/> {user?.nodeName || 'UPA 24H'}</p>
            </div>
        </div>
      </div>

      {/* STEPPER FLAT */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6 px-4">
         {stepsLabels.map((label, idx) => {
            const stepNum = idx + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            return (
                <div key={idx} className="flex items-center gap-3 cursor-pointer group" onClick={() => step > stepNum && setStep(stepNum)}>
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-black border-2 transition-all ${isActive ? 'border-blue-600 text-blue-600 bg-blue-50' : isCompleted ? 'border-green-500 bg-green-500 text-white' : 'border-slate-200 text-slate-300'}`}>
                        {isCompleted ? <Check size={14} strokeWidth={4}/> : stepNum}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-slate-300'}`}>{label}</span>
                    {idx < stepsLabels.length - 1 && <div className="h-[2px] w-12 bg-slate-100 mx-2 hidden md:block"></div>}
                </div>
            );
         })}
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="min-h-[400px]">
          
          {/* ETAPA 1: DADOS COMPLETOS DO PACIENTE */}
          {step === 1 && (
            <div className="animate-in slide-in-from-right duration-300">
               {!selectedPatient ? (
                 <div className="max-w-3xl mx-auto py-10 space-y-4">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                        autoFocus
                        placeholder="Buscar paciente (Nome/CPF)..." 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-blue-400 rounded-sm text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400" 
                      />
                    </div>
                    
                    <button 
                      onClick={() => openModal('RegisterPatientModal')}
                      className="w-full py-3 bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-sm font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-slate-300"
                    >
                      <UserPlus size={16}/> Cadastrar Novo
                    </button>

                    {search.length > 1 && (
                      <div className="bg-white border border-slate-200 rounded-sm mt-2 shadow-sm">
                         {filteredSearchPatients.map(p => (
                           <div key={p.id} onClick={() => setSelectedPatient(p)} className="flex justify-between items-center p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-0 group transition-all">
                              <div>
                                 <p className="font-bold text-slate-900 text-sm uppercase">{p.name}</p>
                                 <div className="flex gap-4 text-[10px] text-slate-500 font-mono mt-0.5">
                                    <span>CPF: {p.cpf}</span>
                                    <span>CNS: {p.cns}</span>
                                 </div>
                              </div>
                              <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600"/>
                           </div>
                         ))}
                         {filteredSearchPatients.length === 0 && (
                             <div className="p-4 text-center text-slate-400 font-bold text-xs uppercase">Nenhum paciente encontrado</div>
                         )}
                      </div>
                    )}
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2"><UserIcon size={16} className="text-blue-600"/> Ficha de Identificação</h3>
                        <button onClick={() => setSelectedPatient(null)} className="text-[10px] font-bold text-red-600 hover:underline uppercase tracking-widest flex items-center gap-1">
                            <X size={12}/> Trocar Paciente
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-sm border border-slate-200 shadow-sm">
                        <DataPoint label="Nome Civil" value={selectedPatient.name} highlight />
                        <DataPoint label="Nome Social" value={selectedPatient.socialName} />
                        <DataPoint label="Data Nascimento" value={`${new Date(selectedPatient.birthDate).toLocaleDateString()} (${calculateAge(selectedPatient.birthDate)} anos)`} />
                        <DataPoint label="Sexo / Gênero" value={selectedPatient.gender} />
                        
                        <DataPoint label="CPF" value={selectedPatient.cpf} />
                        <DataPoint label="Cartão SUS (CNS)" value={selectedPatient.cns} />
                        <DataPoint label="Nome da Mãe" value="MARIA DA SILVA (MOCK)" />
                        <DataPoint label="Nacionalidade" value="BRASILEIRA" />

                        <div className="lg:col-span-2">
                            <DataPoint label="Endereço Residencial" value={selectedPatient.address} />
                        </div>
                        <DataPoint label="Município de Residência" value="SÃO PAULO - SP" />
                        <DataPoint label="CEP" value="01000-000" />

                        <DataPoint label="Telefone Celular" value={selectedPatient.phone} />
                        <DataPoint label="Telefone Fixo" value="-" />
                        <DataPoint label="Contato de Emergência" value={selectedPatient.emergencyContact} highlight />
                        <DataPoint label="Vínculo" value="FAMILIAR" />
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* ETAPA 2: CLÍNICA FLAT (COM SELEÇÃO DE CID) */}
          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
               
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Columna Izquierda: Historia y Diagnóstico */}
                  <div className="lg:col-span-2 space-y-6">
                      <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                             <span>História Clínica / Queixa Principal</span>
                             <span className="text-blue-600 flex items-center gap-1"><Sparkles size={10}/> IA Ativa</span>
                          </label>
                          <textarea 
                            value={clinicalData.history}
                            onChange={e => setClinical({ history: e.target.value })}
                            className="w-full p-4 text-sm font-medium text-slate-700 placeholder:text-slate-300 border border-slate-300 rounded-sm outline-none resize-none h-40 bg-white leading-relaxed focus:border-blue-500"
                            placeholder="Descreva a história da moléstia atual, sintomas, tempo de evolução..."
                          />
                      </div>

                      {/* Sugerencias IA */}
                      {aiSuggestions.length > 0 && (
                         <div className="flex flex-wrap gap-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest py-1">Sugestões:</span>
                            {aiSuggestions.map((sug, idx) => (
                               <button 
                                 key={idx}
                                 onClick={() => setClinical({ 
                                    mainDiagnosis: { code: sug.code, description: sug.description } 
                                 })}
                                 className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-sm text-[10px] font-bold hover:bg-indigo-100 transition-colors uppercase border border-indigo-100"
                               >
                                  {sug.code} - {sug.description}
                               </button>
                            ))}
                         </div>
                      )}

                      <div className="space-y-4">
                          <ICDSelectionRow 
                            label="Diagnóstico Principal (CID-10)" 
                            selectedCode={clinicalData.mainDiagnosis.code}
                            selectedDescription={clinicalData.mainDiagnosis.description}
                            onUpdate={(c, d) => setClinical({ mainDiagnosis: { code: c, description: d } })}
                            required
                          />
                          <ICDSelectionRow 
                            label="Diagnóstico Secundário" 
                            selectedCode={clinicalData.secondaryDiagnosis.code}
                            selectedDescription={clinicalData.secondaryDiagnosis.description}
                            onUpdate={(c, d) => setClinical({ secondaryDiagnosis: { code: c, description: d } })}
                          />
                      </div>
                  </div>

                  {/* Columna Derecha: Vitales */}
                  <div className="space-y-6 border-l border-slate-200 pl-8 bg-slate-50/50 p-4 rounded-sm">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sinais Vitais (Admissão)</h4>
                      <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-2"><Gauge size={12}/> PA (mmHg)</label>
                            <input value={vitals.pa} onChange={e => setVitalsState({ pa: e.target.value })} className="w-20 text-right font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-sm p-1 outline-none focus:border-blue-600 text-xs" placeholder="000/00"/>
                         </div>
                         <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-2"><Heart size={12}/> FC (bpm)</label>
                            <input value={vitals.fc} onChange={e => setVitalsState({ fc: e.target.value })} className="w-20 text-right font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-sm p-1 outline-none focus:border-blue-600 text-xs" placeholder="000"/>
                         </div>
                         <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-2"><Wind size={12}/> FR (irpm)</label>
                            <input value={vitals.fr} onChange={e => setVitalsState({ fr: e.target.value })} className="w-20 text-right font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-sm p-1 outline-none focus:border-blue-600 text-xs" placeholder="00"/>
                         </div>
                         <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-2"><Droplets size={12}/> SpO2 (%)</label>
                            <input value={vitals.spo2} onChange={e => setVitalsState({ spo2: e.target.value })} className="w-20 text-right font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-sm p-1 outline-none focus:border-blue-600 text-xs" placeholder="00%"/>
                         </div>
                         <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-2"><Activity size={12}/> Glasgow</label>
                            <input type="number" max={15} value={clinicalData.glasgow} onChange={e => setClinical({ glasgow: parseInt(e.target.value) })} className="w-20 text-right font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-sm p-1 outline-none focus:border-blue-600 text-xs" placeholder="15"/>
                         </div>
                      </div>
                  </div>
               </div>
            </div>
          )}

          {/* ETAPA 3: REGULAÇÃO FLAT */}
          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Recurso Solicitado</label>
                     <div className="grid grid-cols-2 gap-3">
                        {['ENFERMARIA', 'UTI', 'UTI_NEO', 'ISOLAMENTO'].map(type => (
                           <button 
                              key={type}
                              onClick={() => setRegDataState({ bedType: type })}
                              className={`py-3 text-[10px] font-black uppercase transition-all rounded-sm border ${regData.bedType === type ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-300 text-slate-500 hover:bg-slate-50'}`}
                           >
                              {type.replace('_', ' ')}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Classificação de Risco</label>
                     <select 
                        value={regData.priority}
                        onChange={e => setRegDataState({ priority: e.target.value })}
                        className="w-full py-3 px-3 bg-white border border-slate-300 rounded-sm font-bold text-sm text-slate-900 outline-none focus:border-blue-600 cursor-pointer uppercase"
                     >
                        <option value="NORMAL">VERDE - POUCO URGENTE</option>
                        <option value="URGENTE">AMARELO - URGENTE</option>
                        <option value="EMERGENCIA">LARANJA - MUITO URGENTE</option>
                        <option value="VAGA_ZERO">VERMELHO - VAGA ZERO (EMERGÊNCIA)</option>
                     </select>
                     {regData.priority === 'VAGA_ZERO' && (
                        <p className="text-[10px] font-bold text-red-600 flex items-center gap-2 animate-pulse bg-red-50 p-2 rounded-sm border border-red-200"><AlertTriangle size={12}/> Recurso de exceção para risco iminente de morte.</p>
                     )}
                  </div>
               </div>

               <div className="space-y-2 pt-4 border-t border-slate-200">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Justificativa da Solicitação</label>
                  <textarea 
                     value={regData.justification}
                     onChange={e => setRegDataState({ justification: e.target.value })}
                     className="w-full p-3 text-xs font-medium text-slate-700 border border-slate-300 rounded-sm outline-none resize-none h-24 bg-white placeholder:text-slate-300 focus:border-blue-500"
                     placeholder="Justifique a necessidade de transferência baseada na capacidade técnica..."
                  />
               </div>

               <div className="flex items-center gap-8 pt-2">
                  <div className="flex items-center gap-3">
                     <input type="checkbox" id="transport" checked={regData.transportNeeded} onChange={e => setRegDataState({ transportNeeded: e.target.checked })} className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"/>
                     <label htmlFor="transport" className="text-xs font-bold text-slate-700 cursor-pointer uppercase">Necessita Transporte Sanitário</label>
                  </div>
                  {regData.transportNeeded && (
                     <div className="flex gap-2">
                        {['USA', 'USB', 'AÉREO'].map(type => (
                           <button 
                              key={type}
                              onClick={() => setRegDataState({ transportType: type })}
                              className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-sm transition-all border ${regData.transportType === type ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'}`}
                           >
                              {type}
                           </button>
                        ))}
                     </div>
                  )}
               </div>
            </div>
          )}

          {/* ETAPA 4: DOCUMENTOS COM FERRAMENTAS COMPLETAS */}
          {step === 4 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
               
               {/* BARRA DE FERRAMENTAS DOCUMENTAL */}
               <div className="flex flex-wrap gap-4 border-b border-slate-200 pb-6">
                  <button 
                    onClick={() => navigate('/upa/case/new/search')} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-sm font-bold text-[10px] uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                  >
                     <Globe size={14}/> Busca Federada
                  </button>
                  <button 
                    onClick={() => openModal('NotifyCitizenModal', { patient: selectedPatient?.name })} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-sm font-bold text-[10px] uppercase tracking-widest hover:border-amber-500 hover:text-amber-600 transition-all shadow-sm active:scale-95"
                  >
                     <Smartphone size={14}/> Pedir ao Paciente (App)
                  </button>
                  <button 
                    onClick={() => openDrawer('UploadDocumentDrawer', { type: 'Laudos/Exames UPA' })} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all shadow-sm active:scale-95 ml-auto"
                  >
                     <UploadCloud size={14}/> Upload Local (UPA)
                  </button>
               </div>

               {/* LISTA DE DOCUMENTOS (FLAT) */}
               <div className="space-y-2">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">Documentos Anexados ao Protocolo</h4>
                  {attachedDocs.length === 0 ? (
                     <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-sm bg-slate-50">
                        <p className="text-slate-400 font-medium text-xs">Nenhum documento anexado.</p>
                     </div>
                  ) : (
                     <div className="divide-y divide-slate-100 border border-slate-200 rounded-sm bg-white">
                        {attachedDocs.map((doc, i) => (
                           <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-3">
                                 <div className="text-blue-600"><FileText size={16}/></div>
                                 <div>
                                    <p className="font-bold text-slate-900 text-xs uppercase">{doc.name}</p>
                                    <p className="text-[9px] font-mono text-slate-400 uppercase mt-0.5">{doc.node || 'UPA LOCAL'} • {doc.date || 'HOJE'}</p>
                                 </div>
                              </div>
                              <button onClick={() => removeAttachedDoc(doc.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2"><Trash2 size={14}/></button>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
          )}

          {/* ETAPA 5: REVISÃO E REGULADORES (MULTI-SELECT) */}
          {step === 5 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
               
               {/* 1. SELEÇÃO DE REGULADORES */}
               <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destinatários (Centrais de Regulação)</label>
                     <span className="text-[10px] font-bold text-blue-600 uppercase">{selectedRegulators.length} Selecionados</span>
                  </div>
                  
                  <div className="border border-slate-300 rounded-sm p-0 bg-white relative">
                     <button 
                        onClick={() => setIsRegulatorDropdownOpen(!isRegulatorDropdownOpen)}
                        className="w-full flex justify-between items-center text-xs font-bold text-slate-700 outline-none p-3 hover:bg-slate-50 transition-colors"
                     >
                        <span>{selectedRegulators.length > 0 ? 'Centrais Selecionadas (Clique para editar)' : 'Selecione as centrais de destino...'}</span>
                        <ChevronDown size={14} className={`transition-transform ${isRegulatorDropdownOpen ? 'rotate-180' : ''}`}/>
                     </button>

                     {isRegulatorDropdownOpen && (
                        <div className="border-t border-slate-200 bg-slate-50 max-h-[200px] overflow-y-auto">
                           <button 
                              onClick={toggleAllRegulators} 
                              className="w-full text-left px-4 py-2 text-[9px] font-black uppercase text-blue-600 hover:bg-blue-100 border-b border-slate-200"
                           >
                              {selectedRegulators.length === regulators.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                           </button>
                           {regulators.map(r => (
                              <button 
                                key={r.id} 
                                onClick={() => toggleRegulator(r.id)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white border-b border-slate-100 last:border-0 text-left transition-colors"
                              >
                                 {selectedRegulators.includes(r.id) 
                                    ? <CheckSquare size={14} className="text-blue-600 shrink-0"/> 
                                    : <Square size={14} className="text-slate-300 shrink-0"/>
                                 }
                                 <span className={`text-[10px] font-bold uppercase ${selectedRegulators.includes(r.id) ? 'text-slate-900' : 'text-slate-500'}`}>{r.name}</span>
                              </button>
                           ))}
                        </div>
                     )}
                  </div>

                  {/* Chips de Seleção */}
                  {selectedRegulators.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-3 p-3 bg-slate-50 border border-slate-100">
                        {selectedRegulators.map(id => {
                           const reg = regulators.find(r => r.id === id);
                           return (
                              <div key={id} className="px-3 py-1 bg-white border border-slate-200 rounded-sm text-[9px] font-bold text-slate-600 uppercase flex items-center gap-2">
                                 {reg?.name} <button onClick={() => toggleRegulator(id)} className="hover:text-red-500"><X size={10}/></button>
                              </div>
                           );
                        })}
                     </div>
                  )}
               </div>

               {/* 2. RESUMO OFICIAL (ESTILO DOCUMENTO) */}
               <div className="border border-slate-300 p-6 space-y-4 bg-white mt-6 rounded-sm shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                     <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Resumo da Solicitação</h3>
                     <p className="text-[10px] font-mono font-bold text-slate-400">DATA: {new Date().toLocaleDateString()}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 text-xs">
                     <div className="space-y-1">
                        <p className="font-bold text-slate-400 uppercase text-[9px] tracking-widest">Paciente</p>
                        <p className="font-black text-slate-900 uppercase">{selectedPatient?.name}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="font-bold text-slate-400 uppercase text-[9px] tracking-widest">Diagnóstico Principal</p>
                        <p className="font-black text-slate-900 uppercase">{clinicalData.mainDiagnosis.code} - {clinicalData.mainDiagnosis.description}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="font-bold text-slate-400 uppercase text-[9px] tracking-widest">Prioridade</p>
                        <span className={`inline-block px-2 py-0.5 rounded-sm text-[9px] font-black uppercase text-white ${regData.priority.includes('VAGA_ZERO') || regData.priority === 'EMERGENCIA' ? 'bg-red-600' : 'bg-amber-500'}`}>
                           {regData.priority}
                        </span>
                     </div>
                     <div className="space-y-1">
                        <p className="font-bold text-slate-400 uppercase text-[9px] tracking-widest">Recurso</p>
                        <p className="font-black text-slate-900 uppercase">{regData.bedType}</p>
                     </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                     <div className="flex items-center gap-2 text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                        <Lock size={10}/> Assinado Digitalmente
                     </div>
                     <p className="font-bold text-slate-800 uppercase text-[10px]">{user?.name} (CRM: {user?.registryNumber})</p>
                  </div>
               </div>
            </div>
          )}

      </div>

      {/* FOOTER ACTIONS FLAT */}
      <div className="flex justify-between items-center pt-6 border-t border-slate-200 mt-auto">
         {step > 1 ? (
           <button onClick={() => setStep(step - 1)} className="px-6 py-2.5 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-slate-900 hover:bg-slate-100 rounded-sm transition-all flex items-center gap-2">
              <ChevronLeft size={14}/> Voltar
           </button>
         ) : <div/>}

         {step < 5 ? (
           <button 
              onClick={() => {
                  if (step === 1 && !selectedPatient) {
                      addNotification({ type: 'warning', message: 'Selecione um paciente.' });
                      return;
                  }
                  setStep(step + 1);
              }} 
              className="px-8 py-3 bg-slate-900 text-white rounded-sm font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95"
           >
              Próximo <ChevronRight size={14}/>
           </button>
         ) : (
           <button 
              onClick={handleSubmitTransfer}
              disabled={loading}
              className={`px-10 py-3 text-white rounded-sm font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center gap-2 active:scale-95 ${regData.priority === 'VAGA_ZERO' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'}`}
           >
              {loading ? <Loader2 className="animate-spin" size={16}/> : <>{regData.priority === 'VAGA_ZERO' ? <Siren size={16}/> : <Check size={16}/>} {regData.priority === 'VAGA_ZERO' ? 'Acionar Vaga Zero' : 'Protocolar Pedido'}</>}
           </button>
         )}
      </div>

    </div>
  );
};
