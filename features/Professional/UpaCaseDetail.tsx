import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, Activity, FileText, 
  AlertCircle, Clock, Stethoscope, Syringe,
  ClipboardList, CheckCircle, AlertTriangle,
  History, User, Thermometer, Heart, Wind,
  Droplets, FilePlus, Search, ExternalLink,
  Siren, LogOut, Lock, Building2, UserPlus, Globe, Loader2, Gauge, Check, MapPin, Phone, Hash, CreditCard,
  Sparkles, Lightbulb, Play
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_PATIENTS } from '../../mocks/seed';
import { MOCK_ICD_DB, ICDEntry } from '../../mocks/icd_seed';
import { ICDSelectionRow } from '../../components/Inputs/ICDSelectionRow';

// Estados del flujo clínico UPA
type ClinicalStatus = 
  | 'IDENTIFICATION'
  | 'IN_TRIAGE' 
  | 'MEDICAL_ATTENTION'
  | 'UNDER_OBSERVATION' 
  | 'NEEDS_REGULATION' 
  | 'TRANSFERRED' 
  | 'DISCHARGED';

export const UpaCaseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, openDrawer, openModal, attachedDocs, removeAttachedDoc, upaQueue, updateUpaCaseStatus, addUpaCase } = useAppStore();

  // --- ESTADO DEL CASO CLÍNICO ---
  const [status, setStatus] = useState<ClinicalStatus>('IN_TRIAGE');
  const [decisionMode, setDecisionMode] = useState<'NONE' | 'DISCHARGE' | 'OBSERVATION' | 'REGULATION'>('NONE');
  const [loading, setLoading] = useState(false);
  
  // --- DATOS DEL PACIENTE (Extendido) ---
  const [patient, setPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- FORMULARIOS ---
  const [triage, setTriage] = useState({
    pa: '', fc: '', fr: '', spo2: '', temp: '', pain: '',
    risk: 'INDEFINIDO',
    symptoms: '', 
    allergies: '', 
    conduct: ''
  });

  const [evolutions, setEvolutions] = useState<any[]>([]);
  const [newEvo, setNewEvo] = useState('');
  const [procedures, setProcedures] = useState<any[]>([]);
  
  // --- AVALIAÇÃO MÉDICA CENTRALIZADA (Notas e CID) ---
  const [medicalAssessment, setMedicalAssessment] = useState({
    notes: '',
    cid: '',
    cidDesc: ''
  });
  
  // Estado para sugerencias de IA
  const [aiSuggestions, setAiSuggestions] = useState<ICDEntry[]>([]);

  // Datos adicionales específicos por decisión
  const [dischargeExtras, setDischargeExtras] = useState({ instructions: '', prescription: '' });

  const [timeline, setTimeline] = useState<any[]>([]);

  // --- INICIALIZACIÓN ---
  useEffect(() => {
    if (id === 'new') {
      setStatus('IDENTIFICATION');
      setPatient(null);
      setTriage({ 
        pa: '', fc: '', fr: '', spo2: '', temp: '', pain: '',
        risk: 'INDEFINIDO',
        symptoms: '',
        allergies: '',
        conduct: ''
      });
      setEvolutions([]);
      setProcedures([]);
      setTimeline([{ time: new Date().toLocaleTimeString().substring(0,5), event: 'INÍCIO', user: 'Sistema', obs: 'Abertura de atendimento' }]);
    } else {
      const storedCase = upaQueue.find(c => c.id === id);

      if (storedCase) {
        setPatient({
          id: storedCase.id,
          name: storedCase.patientName,
          socialName: storedCase.socialName,
          age: storedCase.age,
          sex: storedCase.gender,
          doc: storedCase.cpf,
          cns: storedCase.cns,
          phone: storedCase.phone,
          emergencyContact: storedCase.emergencyContact,
          address: storedCase.address,
          bloodType: storedCase.bloodType,
          arrival: storedCase.arrival,
        });
        
        // Define o status da tela basado en la etapa de la fila
        if (storedCase.stage === 'TRIAGEM') {
            setStatus('IN_TRIAGE');
            // GARANTIR QUE TRIAGEM ESTEJA VAZIA PARA PREENCHIMENTO REAL
            setTriage({
                pa: '', fc: '', fr: '', spo2: '', temp: '', pain: '',
                risk: 'INDEFINIDO',
                symptoms: storedCase.complaint,
                allergies: '',
                conduct: ''
            });
        } else if (storedCase.stage === 'MEDICAL') {
            setStatus('MEDICAL_ATTENTION');
            // Se já passou, pode carregar dados (aqui seria do backend)
            setTriage({
                pa: '124/82', fc: '88', fr: '18', spo2: '98', temp: '36.9', pain: '2',
                risk: storedCase.risk === 'INDEFINIDO' ? 'AMARELO' : storedCase.risk, 
                symptoms: storedCase.complaint,
                allergies: 'A VERIFICAR',
                conduct: 'Encaminhado ao atendimento médico'
            });
        } else if (storedCase.stage === 'OBSERVATION') {
            setStatus('UNDER_OBSERVATION');
        } else {
            setStatus('MEDICAL_ATTENTION');
        }
        
        // Carrega Timeline inicial
        setTimeline([
            { time: storedCase.arrival, event: 'ADMISSÃO', user: 'Recepção', obs: storedCase.complaint }
        ]);

      } else {
        // Fallback Mock (Mantido para robustez caso acesse direto)
        let mockIndex = 0;
        if (id && id.startsWith('UPA-24-')) {
            const parts = id.split('-');
            const num = parseInt(parts[2]);
            if (!isNaN(num)) mockIndex = num - 1000;
        }
        if (mockIndex < 0 || mockIndex >= MOCK_PATIENTS.length) mockIndex = 0;
        const mock = MOCK_PATIENTS[mockIndex];
        
        setPatient({
          id: mock.id,
          name: mock.name,
          socialName: mock.socialName,
          age: new Date().getFullYear() - parseInt(mock.birthDate.split('-')[0]),
          sex: mock.gender,
          doc: mock.cpf,
          cns: mock.cns,
          phone: mock.phone,
          emergencyContact: mock.emergencyContact,
          address: mock.address,
          bloodType: mock.bloodType,
          arrival: '10:15',
        });
        
        setStatus('MEDICAL_ATTENTION'); 
        setTriage({
          pa: '140/90', fc: '98', fr: '20', spo2: '96', temp: '37.5', pain: '2',
          risk: 'AMARELO',
          symptoms: 'Dor torácica típica.',
          allergies: 'DIPIRONA, IODO',
          conduct: 'ECG, Monitorização, Analgesia'
        });
        setEvolutions([{ id: 1, time: '10:20', professional: 'Enf. Classificação', note: 'Paciente admitido.', type: 'ENFERMAGEM' }]);
        setProcedures([]);
        setTimeline([{ time: '10:15', event: 'ADMISSÃO', user: 'Recepção', obs: 'Entrada via porta aberta' }]);
      }
    }
  }, [id, upaQueue]);

  // --- LÓGICA IA SUGERENCIAS ---
  useEffect(() => {
    if (medicalAssessment.notes.length > 5) {
      const notesLower = medicalAssessment.notes.toLowerCase();
      // Simulação simples de NLP
      const matches = MOCK_ICD_DB.filter(entry => {
         const words = entry.description.toLowerCase().split(' ');
         // Se a nota contiver alguma palavra chave significativa do CID
         return words.some(w => w.length > 4 && notesLower.includes(w));
      }).slice(0, 3); // Top 3 sugestões
      setAiSuggestions(matches);
    } else {
      setAiSuggestions([]);
    }
  }, [medicalAssessment.notes]);

  const applySuggestion = (sug: ICDEntry) => {
    setMedicalAssessment(prev => ({...prev, cid: sug.code, cidDesc: sug.description}));
    setAiSuggestions([]); // Limpiar sugerencias al seleccionar
  };

  // --- HANDLERS ---
  const filteredPatients = useMemo(() => {
    if (searchTerm.length < 2) return [];
    return MOCK_PATIENTS.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.cpf.includes(searchTerm));
  }, [searchTerm]);

  const handleSelectPatient = (p: any) => {
    setPatient({
        id: p.id,
        name: p.name,
        socialName: p.socialName,
        age: new Date().getFullYear() - parseInt(p.birthDate.split('-')[0]),
        sex: p.gender,
        doc: p.cpf,
        cns: p.cns,
        phone: p.phone,
        emergencyContact: p.emergencyContact,
        address: p.address,
        bloodType: p.bloodType,
        arrival: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
    });
    setTriage({ 
        pa: '', fc: '', fr: '', spo2: '', temp: '', pain: '',
        risk: 'INDEFINIDO', symptoms: '', allergies: 'NÃO INFORMADO', conduct: '' 
    });
    setSearchTerm('');
    if (id !== 'new') {
        setStatus('IN_TRIAGE'); 
        addTimelineEvent('IDENTIFICACAO', `Paciente identificado: ${p.name}`);
    }
  };

  const handleConfirmAdmission = () => {
    if (!patient) return;
    setLoading(true);
    setTimeout(() => {
      const newCaseId = `UPA-${Math.floor(Math.random() * 99999)}`;
      addUpaCase({
        id: newCaseId,
        patientName: patient.name,
        socialName: patient.socialName,
        cpf: patient.doc || patient.cpf,
        cns: patient.cns,
        age: patient.age,
        gender: patient.sex || patient.gender,
        phone: patient.phone,
        emergencyContact: patient.emergencyContact,
        address: patient.address,
        bloodType: patient.bloodType,
        arrival: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
        risk: 'INDEFINIDO',
        stage: 'TRIAGEM',
        status: 'Aguardando Classificação',
        complaint: 'Admissão Recepção'
      });
      setLoading(false);
      navigate('/upa');
    }, 1000);
  };

  const addTimelineEvent = (event: string, obs: string) => {
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setTimeline(prev => [{ time, event, user: user?.name || 'Profissional', obs }, ...prev]);
  };

  const handleSaveTriage = () => {
    if (!triage.pa || !triage.fc || triage.risk === 'INDEFINIDO') {
      alert('Preencha os Sinais Vitais e a Classificação de Risco Manchester para concluir.');
      return;
    }
    
    // Adiciona evento na linha do tempo antes de navegar
    addTimelineEvent('TRIAGEM_CONCLUIDA', `Risco: ${triage.risk} | PA: ${triage.pa}`);
    
    setStatus('MEDICAL_ATTENTION'); 
    if (id && id !== 'new') updateUpaCaseStatus(id, 'MEDICAL', triage.risk);
  };

  const handleAddEvolution = () => {
    if (!newEvo.trim()) return;
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setEvolutions(prev => [{ id: Date.now(), time, professional: user?.name || 'Médico', note: newEvo, type: 'MÉDICA' }, ...prev]);
    addTimelineEvent('EVOLUCAO_CLINICA', 'Nova nota registrada');
    setNewEvo('');
  };

  const handleAddProcedure = () => {
    openModal('NewProcedureModal', {
      onConfirm: (newProc: any) => {
        const procEntry = { 
          id: Date.now(), type: newProc.type, desc: newProc.name, time: newProc.timestamp, status: 'SOLICITADO', result: '-' 
        };
        setProcedures(prev => [procEntry, ...prev]);
        addTimelineEvent('PEDIDO_EXAME', `Solicitação: ${newProc.name} (${newProc.urgency})`);
      }
    });
  };

  // DECISION HANDLERS USANDO medicalAssessment
  const handleDischarge = () => {
    if (!medicalAssessment.cid) return alert('Obrigatório informar diagnóstico de alta (CID).');
    if (confirm('Confirmar ALTA MÉDICA deste paciente?')) {
      setStatus('DISCHARGED');
      if (id && id !== 'new') updateUpaCaseStatus(id, 'DISCHARGED');
      addTimelineEvent('ALTA_UPA', `Diagnóstico: ${medicalAssessment.cid}`);
      setDecisionMode('NONE');
      setTimeout(() => navigate('/upa'), 1000); 
    }
  };

  const handleRegulationFast = () => {
    if (!medicalAssessment.cid || !medicalAssessment.notes) {
        alert('É obrigatório preencher as Notas Clínicas e o Diagnóstico Principal antes de solicitar Vaga Zero.');
        return;
    }
    openModal('EmergencyRequestModal', { 
        caseId: id,
        onSuccess: () => navigate('/upa')
    });
  };

  const handleRegulationProtocol = () => {
    if (!medicalAssessment.cid) {
        alert('Informe o CID Principal antes de iniciar o protocolo.');
        return;
    }
    navigate('/upa/new-case');
  };

  const handleObservation = () => {
    setStatus('UNDER_OBSERVATION');
    if (id && id !== 'new') updateUpaCaseStatus(id, 'OBSERVATION');
    addTimelineEvent('MANTER_OBSERVACAO', 'Paciente mantido em leito de observação');
    setDecisionMode('NONE');
    setTimeout(() => navigate('/upa'), 1000);
  };

  // --- CONTROL DE VISIBILIDAD DE TARJETAS ---
  const isTriageEditable = status === 'IN_TRIAGE' || status === 'IDENTIFICATION';
  const isMedicalEditable = status === 'MEDICAL_ATTENTION' || status === 'UNDER_OBSERVATION' || status === 'NEEDS_REGULATION';

  const PatientCard = ({ patientData, onReset, onConfirm, isConfirmMode }: any) => {
    if (!patientData) return <div className="p-4 text-center text-slate-400 font-bold text-sm flex justify-center items-center gap-2"><Loader2 className="animate-spin" size={16}/> Carregando dados do paciente...</div>;
    return (
      <div className="animate-in fade-in space-y-4">
         <div className={`p-4 rounded-sm border ${isConfirmMode ? 'bg-blue-50 border-blue-200' : 'bg-white border-white'}`}>
            <div className="flex items-start gap-3 mb-4 border-b border-blue-200/50 pb-3">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm shrink-0"><User size={20} /></div>
               <div>
                  <p className="font-black text-slate-900 text-sm uppercase leading-tight">{patientData.name}</p>
                  {patientData.socialName && <p className="text-[10px] font-bold text-blue-600 uppercase mt-0.5">Nome Social: {patientData.socialName}</p>}
                  {!patientData.socialName && <p className="text-[9px] text-slate-400 font-medium uppercase mt-0.5">Nome Social: -</p>}
               </div>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[10px]">
               <div><p className="text-slate-400 font-bold uppercase text-[8px] tracking-wider mb-0.5">CPF</p><p className="font-mono font-bold text-slate-700 truncate">{patientData.doc || patientData.cpf || '-'}</p></div>
               <div><p className="text-slate-400 font-bold uppercase text-[8px] tracking-wider mb-0.5">Cartão SUS (CNS)</p><p className="font-mono font-bold text-slate-700 truncate">{patientData.cns || '-'}</p></div>
               <div><p className="text-slate-400 font-bold uppercase text-[8px] tracking-wider mb-0.5">Idade / Sexo</p><p className="font-bold text-slate-700 uppercase">{patientData.age} ANOS • {patientData.sex || patientData.gender}</p></div>
               <div><p className="text-slate-400 font-bold uppercase text-[8px] tracking-wider mb-0.5">Tipo Sanguíneo</p><p className="font-black text-red-600 uppercase">{patientData.bloodType || '-'}</p></div>
               <div><p className="text-slate-400 font-bold uppercase text-[8px] tracking-wider mb-0.5">Telefone</p><p className="font-bold text-slate-700 truncate">{patientData.phone || '-'}</p></div>
               <div><p className="text-slate-400 font-bold uppercase text-[8px] tracking-wider mb-0.5">Contato Emergência</p><p className="font-bold text-red-600 truncate">{patientData.emergencyContact || '-'}</p></div>
               <div className="col-span-2 pt-1 border-t border-blue-100/50 mt-1"><p className="text-slate-400 font-bold uppercase text-[8px] tracking-wider mb-0.5">Endereço Completo</p><p className="font-bold text-slate-700 leading-tight uppercase text-[9px]">{patientData.address || '-'}</p></div>
            </div>
         </div>
         {isConfirmMode && (
           <div className="flex gap-2 pt-2">
              <button onClick={onReset} className="flex-1 py-3 bg-white border border-slate-300 text-slate-600 font-bold text-[10px] uppercase rounded-sm hover:bg-slate-50">Trocar</button>
              <button onClick={onConfirm} disabled={loading} className="flex-[2] py-3 bg-blue-600 text-white font-bold text-[10px] uppercase rounded-sm flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 shadow-sm">{loading ? <Loader2 className="animate-spin" size={14}/> : <Check size={14}/>} Confirmar Admissão</button>
           </div>
         )}
      </div>
    );
  };

  const RiskSelector = () => {
    const riskOptions = [
        { id: 'INDEFINIDO', label: 'SELECIONE O RISCO', textClass: 'text-slate-400', bgClass: 'bg-white', dotClass: 'bg-slate-300' },
        { id: 'VERMELHO', label: 'VERMELHO - EMERGÊNCIA', textClass: 'text-red-700', bgClass: 'bg-red-50', dotClass: 'bg-red-600' },
        { id: 'LARANJA', label: 'LARANJA - MUITO URGENTE', textClass: 'text-orange-700', bgClass: 'bg-orange-50', dotClass: 'bg-orange-500' },
        { id: 'AMARELO', label: 'AMARELO - URGENTE', textClass: 'text-yellow-700', bgClass: 'bg-yellow-50', dotClass: 'bg-yellow-400' },
        { id: 'VERDE', label: 'VERDE - POUCO URGENTE', textClass: 'text-emerald-700', bgClass: 'bg-emerald-50', dotClass: 'bg-emerald-500' },
        { id: 'AZUL', label: 'AZUL - NÃO URGENTE', textClass: 'text-blue-700', bgClass: 'bg-blue-50', dotClass: 'bg-blue-500' }
    ];

    const currentRisk = riskOptions.find(r => r.id === triage.risk) || riskOptions[0];

    return (
        <div className="space-y-2 pt-4 border-t border-slate-200">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">Classificação Manchester</label>
            <div className="relative">
                <select
                    value={triage.risk}
                    onChange={(e) => setTriage({...triage, risk: e.target.value})}
                    disabled={!isTriageEditable}
                    className={`w-full p-2 border border-slate-300 rounded-sm text-sm font-black outline-none focus:border-blue-500 appearance-none transition-colors ${currentRisk.bgClass} ${currentRisk.textClass} ${!isTriageEditable ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    {riskOptions.map(r => (
                        <option key={r.id} value={r.id} className="bg-white text-slate-900 font-bold">
                            {r.label}
                        </option>
                    ))}
                </select>
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-black/10 ${currentRisk.dotClass} pointer-events-none`}></div>
            </div>
        </div>
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-20 font-sans text-slate-900 bg-white min-h-screen">
      
      {/* HEADER */}
      <header className="bg-slate-800 text-white px-6 py-4 sticky top-0 z-20 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/upa')} className="hover:bg-white/10 p-2 rounded-lg transition-colors"><ArrowLeft size={20} /></button>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight flex items-center gap-2">ATENDIMENTO UPA <span className="font-mono opacity-50 text-sm">#{id === 'new' ? 'NOVO' : id}</span></h1>
            <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1"><Building2 size={12}/> {user?.nodeName}</span>
              <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
              <span className="flex items-center gap-1"><User size={12}/> {user?.name}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className={`px-4 py-1.5 rounded-sm font-black text-xs uppercase tracking-widest border ${
             status === 'IDENTIFICATION' ? 'bg-slate-600 border-slate-500 text-white' :
             status === 'IN_TRIAGE' ? 'bg-amber-500 border-amber-600 text-white' :
             status === 'NEEDS_REGULATION' ? 'bg-red-600 border-red-700 text-white animate-pulse' :
             status === 'DISCHARGED' ? 'bg-green-600 border-green-700 text-white' :
             'bg-blue-600 border-blue-700 text-white'
           }`}>
             {status.replace('_', ' ')}
           </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 p-6">
        
        {/* COLUNA ESQUERDA: PACIENTE */}
        <div className="col-span-12 xl:col-span-3 space-y-6">
           {/* Card de Identificação */}
           <div className={`border border-slate-300 rounded-sm bg-slate-50 min-h-[200px] ${status === 'IDENTIFICATION' ? 'ring-4 ring-blue-100 border-blue-300' : ''}`}>
              <div className="bg-slate-200 px-4 py-2 border-b border-slate-300 font-bold text-xs uppercase text-slate-700 flex justify-between">
                 <span>Identificação Completa</span>
                 {patient && <span className={`font-black ${triage.risk === 'VERMELHO' ? 'text-red-600' : 'text-slate-600'}`}>{triage.risk}</span>}
              </div>
              {status === 'IDENTIFICATION' ? (
                !patient ? (
                    <div className="p-4 space-y-4">
                       <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                          <input autoFocus value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar paciente (Nome/CPF)..." className="w-full pl-9 p-2 border border-slate-300 rounded-sm text-sm font-bold bg-white focus:border-blue-500 outline-none"/>
                       </div>
                       {filteredPatients.length > 0 && (
                          <div className="border border-slate-200 bg-white max-h-[200px] overflow-y-auto">
                             {filteredPatients.map(p => (
                                <div key={p.id} onClick={() => handleSelectPatient(p)} className="p-2 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-0 text-xs">
                                   <p className="font-bold text-slate-900">{p.name}</p>
                                   <p className="text-slate-500">{p.cpf}</p>
                                </div>
                             ))}
                          </div>
                       )}
                       <button onClick={() => openModal('RegisterPatientModal')} className="w-full py-2 bg-slate-200 text-slate-600 font-bold text-xs uppercase hover:bg-slate-300 flex items-center justify-center gap-2"><UserPlus size={14}/> Cadastrar Novo</button>
                    </div>
                ) : <div className="p-4"><PatientCard patientData={patient} onReset={() => setPatient(null)} onConfirm={handleConfirmAdmission} isConfirmMode={true} /></div>
              ) : <div className="p-4"><PatientCard patientData={patient} isConfirmMode={false} /></div>}
           </div>
        </div>

        {/* COLUNA CENTRAL: TRIAGEM, PROCEDIMENTOS, EVOLUÇÃO, DECISÃO */}
        <div className="col-span-12 xl:col-span-6 space-y-6">
           
           {/* 1. Card de Triagem & Sinais Vitais (AGORA NO CENTRO) */}
           <div className={`border border-slate-300 rounded-sm bg-white shadow-sm transition-all ${status === 'IDENTIFICATION' ? 'opacity-50 pointer-events-none' : 'opacity-100'} ${status === 'IN_TRIAGE' ? 'ring-4 ring-blue-100 border-blue-300' : ''}`}>
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-300 font-bold text-xs uppercase text-slate-700 flex items-center justify-between">
                 <span className="flex items-center gap-2"><Activity size={14}/> Triagem & Sinais Vitais</span>
                 {!isTriageEditable && <Lock size={12} className="text-slate-400"/>}
              </div>
              <div className="p-4 space-y-4">
                 <div className="grid grid-cols-3 gap-3">
                    {[
                      { l: 'PA (mmHg)', k: 'pa', p: '000/00', i: <Gauge size={12}/> },
                      { l: 'FC (bpm)', k: 'fc', p: '000', i: <Heart size={12}/> },
                      { l: 'FR (irpm)', k: 'fr', p: '00', i: <Wind size={12}/> },
                      { l: 'SatO2 (%)', k: 'spo2', p: '00', i: <Droplets size={12}/> },
                      { l: 'Temp (°C)', k: 'temp', p: '00.0', i: <Thermometer size={12}/> },
                      { l: 'Dor (0-10)', k: 'pain', p: '0', i: <Activity size={12}/> },
                    ].map(field => (
                      <div key={field.k} className="space-y-1">
                         <label className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">{field.i} {field.l}</label>
                         <input 
                            value={(triage as any)[field.k]} 
                            onChange={e => setTriage({...triage, [field.k]: e.target.value})}
                            readOnly={!isTriageEditable}
                            className={`w-full p-2 border border-slate-300 rounded-sm text-sm font-bold outline-none focus:border-blue-500 ${!isTriageEditable ? 'bg-slate-100 text-slate-600' : 'bg-white'}`}
                            placeholder={field.p}
                         />
                      </div>
                    ))}
                 </div>
                 
                 {/* SELETOR DE RISCO */}
                 <RiskSelector />

                 {isTriageEditable && (
                   <button onClick={handleSaveTriage} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm mt-4">
                     <Save size={14}/> Salvar e Encaminhar ao Médico
                   </button>
                 )}
              </div>
           </div>

           {/* 2. Procedimentos e Exames */}
           <div className={`border border-slate-300 rounded-sm bg-white transition-opacity duration-300 ${!isMedicalEditable ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-300 font-bold text-xs uppercase text-slate-700 flex justify-between items-center">
                 <span className="flex items-center gap-2"><Syringe size={14}/> Procedimentos e Exames</span>
                 <div className="flex gap-2">
                    <button onClick={() => navigate(`/upa/case/${id}/search`)} className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-sm"><Globe size={10}/> BUSCAR FEDERADO</button>
                    <button onClick={handleAddProcedure} className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-sm"><FilePlus size={10}/> NOVO PEDIDO</button>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-5 text-[10px] font-black text-slate-500 uppercase">
                       <tr><th className="px-4 py-2 border-b">Tipo</th><th className="px-4 py-2 border-b">Descrição</th><th className="px-4 py-2 border-b">Hora</th><th className="px-4 py-2 border-b">Status</th><th className="px-4 py-2 border-b text-right">Resultado</th></tr>
                    </thead>
                    <tbody className="text-xs text-slate-700">
                       {procedures.length === 0 && attachedDocs.length === 0 && <tr><td colSpan={5} className="px-4 py-4 text-center text-slate-400 italic">Nenhum procedimento solicitado.</td></tr>}
                       {procedures.map(proc => (
                          <tr key={proc.id} className="hover:bg-blue-50/50 border-b border-slate-100 last:border-0">
                             <td className="px-4 py-3 font-bold text-[10px] uppercase text-slate-500">{proc.type}</td><td className="px-4 py-3 font-bold">{proc.desc}</td><td className="px-4 py-3 font-mono text-[10px]">{proc.time}</td>
                             <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-sm text-[9px] font-black uppercase ${proc.status === 'CONCLUÍDO' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{proc.status}</span></td>
                             <td className="px-4 py-3 text-right font-medium">{proc.result}</td>
                          </tr>
                       ))}
                       {attachedDocs.map(doc => (
                          <tr key={doc.id} className="bg-blue-50/20 border-b border-blue-100">
                             <td className="px-4 py-3 font-bold text-[10px] uppercase text-blue-600">ANEXO</td><td className="px-4 py-3 font-bold text-blue-900">{doc.name}</td><td className="px-4 py-3 font-mono text-[10px]">{doc.date}</td>
                             <td className="px-4 py-3"><span className="text-[9px] font-black uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded-sm">FEDERADO</span></td><td className="px-4 py-3 text-right"><button onClick={() => removeAttachedDoc(doc.id)} className="text-red-500 hover:text-red-700"><LogOut size={12}/></button></td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* 3. Evolução Clínica */}
           <div className={`border border-slate-300 rounded-sm bg-white min-h-[300px] flex flex-col transition-opacity duration-300 ${!isMedicalEditable ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-300 font-bold text-xs uppercase text-slate-700 flex justify-between items-center">
                 <span className="flex items-center gap-2"><ClipboardList size={14}/> Evolução Clínica</span><span className="text-[10px] text-slate-400">{evolutions.length} Registros</span>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[300px] border-b border-slate-200">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 sticky top-0 text-[10px] font-black text-slate-500 uppercase">
                       <tr><th className="px-4 py-2 border-b">Hora</th><th className="px-4 py-2 border-b">Profissional</th><th className="px-4 py-2 border-b w-1/2">Observação</th></tr>
                    </thead>
                    <tbody className="text-xs text-slate-700">
                       {evolutions.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-400 italic">Nenhuma evolução registrada.</td></tr>}
                       {evolutions.map(evo => (
                          <tr key={evo.id} className="hover:bg-blue-50/50 border-b border-slate-100 last:border-0 align-top">
                             <td className="px-4 py-3 font-mono text-[10px] font-bold">{evo.time}</td>
                             <td className="px-4 py-3"><p className="font-bold">{evo.professional}</p><span className="text-[9px] text-slate-400 uppercase">{evo.type}</span></td>
                             <td className="px-4 py-3 font-medium leading-relaxed">{evo.note}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              <div className="p-3 bg-slate-50">
                 <div className="flex gap-2">
                    <textarea value={newEvo} onChange={e => setNewEvo(e.target.value)} disabled={!isMedicalEditable} placeholder="Digite a nova evolução..." className="flex-1 p-2 border border-slate-300 rounded-sm text-xs outline-none focus:border-blue-500 resize-none h-16 disabled:bg-slate-200" />
                    <button onClick={handleAddEvolution} disabled={!isMedicalEditable} className="px-4 bg-blue-600 text-white rounded-sm font-bold uppercase text-[10px] hover:bg-blue-700 transition-colors disabled:bg-slate-400">Adicionar</button>
                 </div>
              </div>
           </div>

           {/* 4. Decisão Clínica (AGORA NO CENTRO) */}
           <div className={`transition-opacity duration-300 ${!isMedicalEditable ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
               <div className="border-2 border-blue-600 rounded-sm bg-white shadow-md overflow-hidden">
                  <div className="bg-blue-600 text-white px-4 py-3 font-black text-xs uppercase tracking-widest flex items-center gap-2"><CheckCircle size={14}/> Decisão Clínica</div>
                  
                  <div className="p-4 space-y-6">
                     
                     {/* Notas e IA */}
                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-1"><FileText size={10}/> Notas Clínicas / Justificativa</label>
                            <span className="text-[8px] font-black text-blue-600 uppercase flex items-center gap-1"><Sparkles size={8}/> IA Ativa</span>
                        </div>
                        <textarea 
                           value={medicalAssessment.notes}
                           onChange={e => setMedicalAssessment({...medicalAssessment, notes: e.target.value})}
                           className="w-full p-3 border border-slate-300 rounded-sm text-xs h-28 resize-none outline-none focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
                           placeholder="Descreva o quadro clínico..."
                        />
                        
                        {/* Sugerencias IA */}
                        {aiSuggestions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-top-1">
                                <div className="w-full flex items-center gap-1 text-[8px] font-black text-indigo-600 uppercase mb-0.5"><Lightbulb size={10}/> Sugestões CID:</div>
                                {aiSuggestions.map((sug, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => applySuggestion(sug)}
                                        className="px-2 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded text-[9px] font-bold hover:bg-indigo-100 transition-colors truncate max-w-full text-left"
                                        title={`${sug.code} - ${sug.description}`}
                                    >
                                        {sug.code} - {sug.description.substring(0, 20)}...
                                    </button>
                                ))}
                            </div>
                        )}
                     </div>

                     {/* Diagnóstico */}
                     <div className="space-y-2 pt-2 border-t border-slate-100">
                        <ICDSelectionRow 
                            label="Diagnóstico Principal (CID)" 
                            selectedCode={medicalAssessment.cid} 
                            selectedDescription={medicalAssessment.cidDesc} 
                            onUpdate={(c, d) => setMedicalAssessment({...medicalAssessment, cid: c, cidDesc: d})} 
                            required 
                        />
                     </div>

                     <div className="w-full h-px bg-slate-200 my-2"></div>

                     {/* Botões de Decisão */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <button onClick={() => setDecisionMode('DISCHARGE')} className={`p-3 border rounded-sm text-left flex items-center justify-between transition-all ${decisionMode === 'DISCHARGE' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                           <span className="text-xs font-bold uppercase flex items-center gap-2"><LogOut size={14}/> Alta Local</span><div className={`w-3 h-3 rounded-full border-2 ${decisionMode === 'DISCHARGE' ? 'bg-green-600 border-green-600' : 'border-slate-300'}`}></div>
                        </button>
                        <button onClick={() => setDecisionMode('OBSERVATION')} className={`p-3 border rounded-sm text-left flex items-center justify-between transition-all ${decisionMode === 'OBSERVATION' ? 'bg-blue-50 border-blue-500 text-blue-800' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                           <span className="text-xs font-bold uppercase flex items-center gap-2"><Clock size={14}/> Observação</span><div className={`w-3 h-3 rounded-full border-2 ${decisionMode === 'OBSERVATION' ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}></div>
                        </button>
                        <button onClick={() => setDecisionMode('REGULATION')} className={`p-3 border rounded-sm text-left flex items-center justify-between transition-all ${decisionMode === 'REGULATION' ? 'bg-red-50 border-red-500 text-red-800' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                           <span className="text-xs font-bold uppercase flex items-center gap-2"><Siren size={14}/> Regulação</span><div className={`w-3 h-3 rounded-full border-2 ${decisionMode === 'REGULATION' ? 'bg-red-600 border-red-600' : 'border-slate-300'}`}></div>
                        </button>
                     </div>
                     
                     {/* Sub-Opções Condicionais */}
                     {decisionMode === 'DISCHARGE' && (
                        <div className="space-y-3 pt-3 border-t border-slate-200 animate-in fade-in bg-green-50/50 p-3 rounded-sm -mx-2">
                           <div className="space-y-1"><label className="text-[9px] font-black uppercase text-slate-500">Orientações de Alta</label><textarea value={dischargeExtras.instructions} onChange={e => setDischargeExtras({...dischargeExtras, instructions: e.target.value})} className="w-full p-2 border border-slate-300 rounded-sm text-xs h-16 resize-none outline-none bg-white" placeholder="Receita, repouso, retorno..." /></div>
                           <button onClick={handleDischarge} className="w-full py-3 bg-green-600 text-white font-black text-xs uppercase rounded-sm hover:bg-green-700 shadow-sm">Confirmar Alta</button>
                        </div>
                     )}
                     
                     {decisionMode === 'OBSERVATION' && (
                        <div className="space-y-3 pt-3 border-t border-slate-200 animate-in fade-in bg-blue-50/50 p-3 rounded-sm -mx-2">
                           <p className="text-[10px] text-slate-500 font-medium">O paciente será movido para o mapa de leitos de observação. Reavaliação em 6h.</p>
                           <button onClick={handleObservation} className="w-full py-3 bg-blue-600 text-white font-black text-xs uppercase rounded-sm hover:bg-blue-700 shadow-sm">Confirmar Observação</button>
                        </div>
                     )}
                     
                     {decisionMode === 'REGULATION' && (
                        <div className="space-y-3 pt-3 border-t border-slate-200 animate-in fade-in bg-red-50/50 p-3 rounded-sm -mx-2">
                           <p className="text-[9px] font-black text-red-800 uppercase mb-2">Selecione a Modalidade:</p>
                           <button onClick={handleRegulationFast} className="w-full py-3 bg-red-600 text-white font-black text-xs uppercase rounded-sm hover:bg-red-700 mb-2 flex items-center justify-center gap-2 border-b-4 border-red-800 active:border-b-0 active:translate-y-[4px] transition-all"><Siren size={12}/> Vaga Zero (Emergência)</button>
                           <button onClick={handleRegulationProtocol} className="w-full py-3 bg-white border border-slate-300 text-slate-700 font-black text-xs uppercase rounded-sm hover:bg-slate-50 flex items-center justify-center gap-2"><FileText size={12}/> Protocolo Completo</button>
                        </div>
                     )}
                  </div>
               </div>
           </div>

        </div>

        {/* COLUNA DIREITA: TIMELINE */}
        <div className="col-span-12 xl:col-span-3 space-y-6">
           <div className="border border-slate-300 rounded-sm bg-white">
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-300 font-bold text-xs uppercase text-slate-700 flex items-center gap-2"><History size={14}/> Linha do Tempo</div>
              <div className="max-h-[600px] overflow-y-auto p-0">
                 <table className="w-full text-left">
                    <tbody className="text-[10px] divide-y divide-slate-100">
                       {timeline.map((t, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                             <td className="px-3 py-2 font-mono font-bold text-slate-500 w-16 align-top">{t.time}</td>
                             <td className="px-3 py-2 align-top"><p className="font-black text-slate-900 uppercase">{t.event}</p><p className="text-slate-500">{t.obs}</p></td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};