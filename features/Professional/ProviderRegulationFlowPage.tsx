import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, ArrowLeft, Building2, Calendar, CheckCircle, 
  Clock, Database, FileText, Globe, Heart, 
  History, Info, Lock, MapPin, MessageSquare, 
  Navigation, Plus, Printer, Radio, Save, 
  Search, ShieldCheck, Smartphone, Stethoscope, 
  Timer, Trash2, User, UserCheck, UserPlus, 
  Zap, ChevronRight, X, AlertCircle, FileSearch,
  Eye, ListChecks, Download, FilePlus, ClipboardCheck,
  Stethoscope as StethoscopeIcon, AlertTriangle, ShieldX,
  Send, Filter, ChevronDown, Siren
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_PROVIDER_CASES } from '../../mocks/seed';

// Estados do Caso
type CaseStatus = 
  | 'REFERRED' 
  | 'UNDER_TECHNICAL_REVIEW' 
  | 'WAITING_DOCUMENTS' 
  | 'ACCEPTED_BY_PROVIDER' 
  | 'SCHEDULED' 
  | 'EMERGENCY_IN_ATTENDANCE' 
  | 'IN_CARE' 
  | 'COMPLETED' 
  | 'RETURNED_TO_REGULATOR';

// Dados Mockados para Dropdowns (Expandido com Cirurgias e Oftalmo)
const SPECIALTIES = [
  'CARDIOLOGIA CLÍNICA', 'CARDIOLOGIA CIRÚRGICA', 
  'NEUROLOGIA', 'NEUROCIRURGIA', 'ORTOPEDIA', 'TRAUMATOLOGIA',
  'CLÍNICA MÉDICA', 'PEDIATRIA', 'GINECOLOGIA', 'OFTALMOLOGIA',
  'CIRURGIA GERAL', 'CIRURGIA VASCULAR', 'MEDICINA DE EMERGÊNCIA'
];

const SECTORS = [
  'AMBULATÓRIO A (TÉRREO)', 'AMBULATÓRIO B (1º ANDAR)', 
  'CENTRO CIRÚRGICO', 'SALA VERMELHA (EMERGÊNCIA)', 
  'BOX DE OBSERVAÇÃO 01', 'BOX DE OBSERVAÇÃO 02'
];

const PROCEDURES = [
  { code: '03.01.01.007-2', name: 'CONSULTA MÉDICA EM ATENÇÃO ESPECIALIZADA', cid: 'Z00.0' },
  { code: '04.03.01.001-2', name: 'ANGIOPLASTIA CORONARIANA', cid: 'I21.9' },
  { code: '02.02.01.001-5', name: 'CATETERISMO CARDÍACO', cid: 'I25.1' },
  { code: '03.03.04.020-0', name: 'TRATAMENTO DE INFARTO AGUDO', cid: 'I21.0' }
];

// Pool de Médicos Expandido para cobrir Emergências Cirúrgicas e Ambulatoriais
const DOCTORS_POOL = [
  { id: 1, name: 'DR. ALBERTO CRUZ', spec: 'CARDIOLOGIA CLÍNICA', crm: '12345-SP', type: 'AGENDA', nextSlot: '28/10 09:00' },
  { id: 2, name: 'DRA. MARIANA SILVA', spec: 'CARDIOLOGIA CLÍNICA', crm: '54321-SP', type: 'AGENDA', nextSlot: '28/10 10:30' },
  { id: 3, name: 'DR. JULIO LIMA', spec: 'MEDICINA DE EMERGÊNCIA', crm: '99887-SP', type: 'PLANTAO', shift: 'DIURNO (12H)', responseTime: '05 MIN' },
  { id: 4, name: 'DRA. ELENA SOUSA', spec: 'CLÍNICA MÉDICA', crm: '77665-SP', type: 'PLANTAO', shift: 'NOTURNO (12H)', responseTime: '10 MIN' },
  { id: 5, name: 'DR. MARCO AURELIO', spec: 'CIRURGIA GERAL', crm: '11223-SP', type: 'PLANTAO', shift: 'DIURNO (24H)', responseTime: 'IMEDIATO' },
  { id: 6, name: 'DRA. SOFIA MENDES', spec: 'ORTOPEDIA', crm: '33445-SP', type: 'PLANTAO', shift: 'SOBREAVISO', responseTime: '30 MIN' },
  { id: 7, name: 'DR. CARLOS CHAGAS', spec: 'CARDIOLOGIA CIRÚRGICA', crm: '55667-SP', type: 'PLANTAO', shift: 'SOBREAVISO', responseTime: '45 MIN' },
  { id: 8, name: 'DR. VICTOR HUEGO', spec: 'NEUROCIRURGIA', crm: '88990-SP', type: 'PLANTAO', shift: 'SOBREAVISO', responseTime: '20 MIN' },
  { id: 9, name: 'DRA. AMANDA LINS', spec: 'TRAUMATOLOGIA', crm: '77112-SP', type: 'PLANTAO', shift: 'PLANTÃO 24H', responseTime: 'IMEDIATO' },
  { id: 10, name: 'DR. RICARDO VAZ', spec: 'CIRURGIA VASCULAR', crm: '66554-SP', type: 'PLANTAO', shift: 'SOBREAVISO', responseTime: '60 MIN' },
  { id: 11, name: 'DRA. CLARA LUZ', spec: 'OFTALMOLOGIA', crm: '11122-SP', type: 'AGENDA', nextSlot: '29/10 08:00' },
  { id: 12, name: 'DR. PEDRO VISÃO', spec: 'OFTALMOLOGIA', crm: '33344-SP', type: 'AGENDA', nextSlot: '29/10 14:00' },
  { id: 13, name: 'DR. FERNANDO NEURO', spec: 'NEUROLOGIA', crm: '55566-SP', type: 'AGENDA', nextSlot: '30/10 10:00' },
  { id: 14, name: 'DRA. ANA ORTO', spec: 'ORTOPEDIA', crm: '77788-SP', type: 'AGENDA', nextSlot: '28/10 16:30' }
];

export const ProviderRegulationFlowPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { openModal, openDrawer, attachedDocs, user } = useAppStore();

  // Buscar dados reais do mock centralizado usando o ID da URL
  // Nota: Isso é um objeto direto da referência do arquivo, então mutações aqui persistem.
  const selectedCase = useMemo(() => MOCK_PROVIDER_CASES.find(c => c.id === id), [id]);

  // Estados locais
  const [status, setStatus] = useState<CaseStatus>('REFERRED');
  
  // Inicializa prioridade com base no caso selecionado ou padrão
  const [priority, setPriority] = useState<'BAIXA' | 'MÉDIA' | 'ALTA' | 'EMERGÊNCIA'>('EMERGÊNCIA');
  const [evaluation, setEvaluation] = useState({ adequacy: 'SIM', complexity: 'MÉDIA', confirmedSpec: 'CARDIOLOGIA CLÍNICA', moreDocs: false });
  const [vitals, setVitals] = useState({ pa: '130/80', fc: '82', spo2: '97', temp: '36.5' });
  const [careNote, setCareNote] = useState('');
  const [dischargeData, setDischargeData] = useState({ diagnosis: '', procedure: '', condition: 'ESTÁVEL (ALTA)', instructions: '', destination: 'RESIDÊNCIA' });
  
  // Gestão de Médico/Agenda
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedSector, setSelectedSector] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorFilterSpec, setDoctorFilterSpec] = useState('TODAS');

  // Efeito para atualizar estados quando o caso é carregado
  useEffect(() => {
    if (selectedCase) {
      setPriority(selectedCase.priority as any);
      setEvaluation(prev => ({ ...prev, confirmedSpec: selectedCase.specialty }));
      // ATUALIZAÇÃO: Pre-seleciona o filtro do modal com a especialidade do caso
      setDoctorFilterSpec(selectedCase.specialty); 
      
      // Carrega o status interno salvo se existir
      if (selectedCase.internalStatus) {
        setStatus(selectedCase.internalStatus as CaseStatus);
      }

      if (selectedCase.vitals) {
        setVitals(selectedCase.vitals);
      }
    }
  }, [selectedCase]);

  // Chat com Regulador
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'REGULADOR', text: 'Prezado, paciente elegível para avaliação de risco cirúrgico. Aguardamos aceite.', time: '10:30' }
  ]);

  // Dados do Caso (Fallback se não encontrar ID)
  const caseData = selectedCase ? {
    id: selectedCase.id,
    patient: selectedCase.patientName,
    age: selectedCase.age,
    specialty: selectedCase.specialty,
    origin: `${selectedCase.origin} - ${selectedCase.originType}`,
  } : {
    id: id || 'N/A',
    patient: 'PACIENTE NÃO ENCONTRADO',
    age: 0,
    specialty: 'GERAL',
    origin: 'DESCONHECIDO',
  };

  // Funções de Ação com Persistência no Mock
  const updateStatus = (newStatus: CaseStatus) => {
    setStatus(newStatus);
    if (selectedCase) {
      // @ts-ignore
      selectedCase.internalStatus = newStatus;
      // Atualiza também o status de exibição da lista se for relevante
      if (newStatus === 'ACCEPTED_BY_PROVIDER' || newStatus === 'SCHEDULED') {
        selectedCase.status = 'AGENDADO';
      } else if (newStatus === 'IN_CARE' || newStatus === 'COMPLETED') {
        selectedCase.status = 'RECEBIDO'; // Ou outro status de finalização
      }
    }
  };

  const handleStartReview = () => updateStatus('UNDER_TECHNICAL_REVIEW');
  const handleAcceptCase = () => updateStatus('ACCEPTED_BY_PROVIDER');
  const handleConfirmSchedule = () => updateStatus('SCHEDULED');
  const handleStartEmergency = () => updateStatus('EMERGENCY_IN_ATTENDANCE');
  const handleRegisterCare = () => updateStatus('IN_CARE');
  const handleFinalizeCase = () => updateStatus('COMPLETED');

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatHistory([...chatHistory, { sender: 'VOCÊ', text: chatMessage, time: new Date().toLocaleTimeString().substring(0,5) }]);
    setChatMessage('');
  };

  // Filtro de Médicos no Modal
  const filteredDoctors = useMemo(() => {
    return DOCTORS_POOL.filter(doc => {
      // Regra de Ouro: Emergência só vê Plantão. Outros riscos só veem Agenda.
      const matchType = priority === 'EMERGÊNCIA' ? doc.type === 'PLANTAO' : doc.type === 'AGENDA';
      const matchSearch = doc.name.toLowerCase().includes(doctorSearch.toLowerCase());
      // Lógica de filtro de especialidade: TODAS ou correspondência parcial (ex: "CARDIOLOGIA" acha "CARDIOLOGIA CLÍNICA")
      const matchSpec = doctorFilterSpec === 'TODAS' || doc.spec.includes(doctorFilterSpec);
      return matchType && matchSearch && matchSpec;
    });
  }, [priority, doctorSearch, doctorFilterSpec]);

  if (!selectedCase && id) {
    return <div className="p-20 text-center text-slate-500 font-bold uppercase">Carregando dados do caso #{id}...</div>;
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-fade-in-up pb-20 font-sans text-slate-900 relative">
      
      {/* PANEL SUPERIOR — RESUMO DO CASO (TABELA) */}
      <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-slate-900 px-6 py-3 flex justify-between items-center text-white">
           <div className="flex items-center gap-4">
              <button onClick={() => navigate('/provider')} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"><ArrowLeft size={18}/></button>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"><Lock size={14} className="text-blue-400"/> Gestão Integral do Expediente Clínico</h2>
           </div>
           <div className="flex items-center gap-3">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Status do Registro:</span>
              <span className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest ${status === 'COMPLETED' ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white animate-pulse'}`}>{status.replace(/_/g, ' ')}</span>
           </div>
        </div>
        
        <table className="w-full text-left border-collapse table-fixed border-b border-slate-200">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
              <th className="px-6 py-3 border-r border-slate-200 w-1/6">Protocolo ID</th>
              <th className="px-6 py-3 border-r border-slate-200 w-1/4">Paciente / Idade</th>
              <th className="px-6 py-3 border-r border-slate-200 w-1/4">Especialidade / Origem</th>
              <th className="px-6 py-3 border-r border-slate-200 w-1/6">Prioridade</th>
              <th className="px-6 py-3">Estado Atual</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-sm font-bold">
              <td className="px-6 py-5 border-r border-slate-100 font-mono text-blue-600">#{caseData.id}</td>
              <td className="px-6 py-5 border-r border-slate-100 uppercase">{caseData.patient} <span className="text-slate-400 font-medium ml-2">({caseData.age} ANOS)</span></td>
              <td className="px-6 py-5 border-r border-slate-100 uppercase">
                 <p>{caseData.specialty}</p>
                 <p className="text-[9px] text-slate-400 mt-1">{caseData.origin}</p>
              </td>
              <td className="px-6 py-5 border-r border-slate-100">
                <span className={`px-3 py-1 rounded text-[10px] font-black uppercase ${priority === 'EMERGÊNCIA' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{priority}</span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${status === 'COMPLETED' ? 'bg-slate-300' : 'bg-blue-500 animate-pulse'}`}></div>
                   <span className="text-xs font-black uppercase text-slate-600">{status.replace(/_/g, ' ')}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* BOTÕES DE AÇÃO DINÂMICA */}
        <div className="p-6 bg-slate-50 flex flex-wrap gap-3">
          {status === 'REFERRED' && (
            <button onClick={handleStartReview} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
              <Zap size={14} fill="currentColor"/> Iniciar Avaliação
            </button>
          )}
          
          <button onClick={() => navigate(`/provider/case/${id}/search`)} className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2 shadow-sm">
            <Globe size={14}/> Buscar em rede federada
          </button>

          <button onClick={() => openModal('ProviderDocRequestModal', { patient: caseData.patient })} className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2 shadow-sm">
            <Smartphone size={14}/> Solicitar documentos
          </button>

          {status === 'UNDER_TECHNICAL_REVIEW' && (
             <>
               <button onClick={handleAcceptCase} className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center gap-2">
                 <CheckCircle size={14}/> Aceitar Caso
               </button>
               <button onClick={() => openModal('ProviderRejectModal')} className="px-6 py-3 bg-white border border-red-200 text-red-600 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all flex items-center gap-2 shadow-sm">
                 <X size={14}/> Recusar Caso
               </button>
             </>
          )}

          {(status === 'ACCEPTED_BY_PROVIDER' || status === 'SCHEDULED') && priority !== 'EMERGÊNCIA' && (
             <button onClick={handleRegisterCare} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-lg transition-all flex items-center gap-2">
               <Stethoscope size={14}/> Registrar Atendimento
             </button>
          )}

          {(status === 'IN_CARE' || status === 'EMERGENCY_IN_ATTENDANCE') && (
            <button onClick={handleFinalizeCase} className="px-6 py-3 bg-slate-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 shadow-xl transition-all flex items-center gap-2">
              <ClipboardCheck size={14}/> Finalizar Caso
            </button>
          )}
        </div>
      </div>

      {/* SEÇÃO 1 — DOCUMENTOS (TABELA) */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
           <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-800"><FileText size={16} className="text-blue-600"/> SEÇÃO 1: DOCUMENTOS TÉCNICOS</h3>
           <div className="flex gap-4">
              <button onClick={() => navigate(`/provider/case/${id}/search`)} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1"><Plus size={12}/> Buscar na rede federada</button>
              <button onClick={() => openModal('ProviderDocRequestModal')} className="text-[9px] font-black text-amber-600 uppercase tracking-widest hover:underline flex items-center gap-1"><Smartphone size={12}/> Solicitar ao paciente</button>
           </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-3 border-r border-slate-100">Tipo</th>
              <th className="px-6 py-3 border-r border-slate-100">Título</th>
              <th className="px-6 py-3 border-r border-slate-100">Origem</th>
              <th className="px-6 py-3 border-r border-slate-100">Data</th>
              <th className="px-6 py-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-bold uppercase divide-y divide-slate-100">
            <tr>
              <td className="px-6 py-4 text-blue-600">EVOLUÇÃO</td>
              <td className="px-6 py-4 text-slate-900">PRONTUÁRIO DE ADMISSÃO UPA</td>
              <td className="px-6 py-4 text-slate-500">UPA VITÓRIA</td>
              <td className="px-6 py-4 text-slate-400 font-mono">25/10/24</td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => openDrawer('ClinicalDetailDrawer', { detail: 'Prontuário Admissão' })} className="p-2 text-slate-400 hover:text-blue-600"><Eye size={16}/></button>
              </td>
            </tr>
            {attachedDocs.map((doc, idx) => (
              <tr key={idx} className="bg-blue-50/20">
                <td className="px-6 py-4 text-emerald-600">FEDERADO</td>
                <td className="px-6 py-4 text-slate-900">{doc.name}</td>
                <td className="px-6 py-4 text-slate-500">{doc.node}</td>
                <td className="px-6 py-4 text-slate-400 font-mono">{doc.date}</td>
                <td className="px-6 py-4 text-right">
                   <button onClick={() => openDrawer('ClinicalDetailDrawer', doc)} className="p-2 text-slate-400 hover:text-blue-600"><Eye size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SEÇÃO 2 — AVALIAÇÃO TÉCNICA */}
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
           <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-800"><ListChecks size={16} className="text-blue-600"/> SEÇÃO 2: AVALIAÇÃO TÉCNICA INSTITUCIONAL</h3>
           </div>
           <div className="p-8 space-y-6 flex-1">
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Adequação Clínica</label>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                       {['SIM', 'NÃO'].map(opt => (
                         <button key={opt} onClick={() => setEvaluation({...evaluation, adequacy: opt})} className={`flex-1 py-2 text-[10px] font-black rounded-md transition-all ${evaluation.adequacy === opt ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>{opt}</button>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nível de Complexidade</label>
                    <select value={evaluation.complexity} onChange={e => setEvaluation({...evaluation, complexity: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black uppercase outline-none focus:border-blue-500">
                       <option>BAIXA</option>
                       <option>MÉDIA</option>
                       <option>ALTA</option>
                    </select>
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Especialidade Confirmada</label>
                 <select value={evaluation.confirmedSpec} onChange={e => setEvaluation({...evaluation, confirmedSpec: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black uppercase outline-none focus:border-blue-500">
                    {SPECIALTIES.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reclassificar Risco (Define tipo de médico)</label>
                 <select 
                    value={priority} 
                    onChange={e => setPriority(e.target.value as any)} 
                    className={`w-full p-2.5 border rounded-lg text-[10px] font-black uppercase outline-none transition-all ${priority === 'EMERGÊNCIA' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200'}`}
                 >
                    <option value="BAIXA">BAIXA (AMBULATORIAL)</option>
                    <option value="MÉDIA">MÉDIA (AMBULATORIAL)</option>
                    <option value="ALTA">ALTA (AMBULATORIAL)</option>
                    <option value="EMERGÊNCIA">EMERGÊNCIA (PLANTÃO)</option>
                 </select>
              </div>
              <div className="flex gap-3 pt-4 mt-auto">
                 <button onClick={handleAcceptCase} className="flex-1 py-4 bg-emerald-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all">Aceitar Institucionalmente</button>
                 <button onClick={() => openModal('ProviderRejectModal')} className="flex-1 py-4 bg-white border border-red-200 text-red-600 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all">Recusar (Motivo obr.)</button>
              </div>
           </div>
        </section>

        {/* COMUNICAÇÃO COM O REGULADOR (NOVA SEÇÃO) */}
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
           <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 text-white"><MessageSquare size={16} className="text-blue-400"/> Comunicação com Regulador</h3>
              <span className="text-[8px] font-bold text-emerald-400 uppercase bg-emerald-900/30 px-2 py-1 rounded border border-emerald-900">Online</span>
           </div>
           <div className="flex-1 p-6 bg-slate-50 overflow-y-auto space-y-4 max-h-[300px]">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'VOCÊ' ? 'items-end' : 'items-start'}`}>
                   <div className={`max-w-[80%] p-3 rounded-xl text-[10px] font-medium ${msg.sender === 'VOCÊ' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                      {msg.text}
                   </div>
                   <span className="text-[8px] font-black text-slate-400 mt-1 uppercase">{msg.sender} • {msg.time}</span>
                </div>
              ))}
           </div>
           <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input 
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                placeholder="Enviar mensagem ao regulador..." 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-[11px] font-medium outline-none focus:border-blue-500"
              />
              <button onClick={handleSendMessage} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-blue-600 transition-all"><Send size={16}/></button>
           </div>
        </section>
      </div>

      {/* SEÇÃO 3 — ATRIBUIÇÃO E AGENDA */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
           <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-800"><UserCheck size={16} className="text-blue-600"/> SEÇÃO 3: ATRIBUIÇÃO DE RECURSO MÉDICO</h3>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${priority === 'EMERGÊNCIA' ? 'bg-red-600 text-white' : 'bg-blue-100 text-blue-600'}`}>{priority}</span>
           </div>
           
           <div className="p-8">
              <div className="space-y-6">
                 <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      {priority === 'EMERGÊNCIA' ? 'Alocação de Recurso de Plantão' : 'Agendamento em Grade Eletiva'}
                    </p>
                    <button 
                      onClick={() => setShowDoctorModal(true)} 
                      disabled={status === 'COMPLETED' || status === 'IN_CARE'}
                      className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                    >
                      <Search size={12}/> Buscar Profissional
                    </button>
                 </div>

                 {/* TABELA DE MÉDICO SELECIONADO */}
                 {selectedDoctor ? (
                   <div className={`border rounded-lg overflow-hidden animate-in fade-in ${priority === 'EMERGÊNCIA' ? 'border-red-200 bg-red-50/30' : 'border-emerald-200 bg-emerald-50/30'}`}>
                      <table className="w-full text-left text-[9px] font-black uppercase">
                        <thead className={`${priority === 'EMERGÊNCIA' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          <tr>
                            <th className="px-4 py-2">Médico</th>
                            <th className="px-4 py-2">Especialidade</th>
                            <th className="px-4 py-2">{priority === 'EMERGÊNCIA' ? 'Turno' : 'Data/Hora'}</th>
                            <th className="px-4 py-2">{priority === 'EMERGÊNCIA' ? 'Tempo Resp.' : 'Vagas'}</th>
                            <th className="px-4 py-2 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-4 py-3">{selectedDoctor.name}</td>
                            <td className="px-4 py-3 text-blue-600">{selectedDoctor.spec}</td>
                            <td className="px-4 py-3">{selectedDoctor.shift || selectedDoctor.nextSlot}</td>
                            <td className="px-4 py-3 text-red-600">{selectedDoctor.responseTime || 'LIVRE'}</td>
                            <td className="px-4 py-3 text-right flex justify-end items-center gap-1">
                               {priority === 'EMERGÊNCIA' ? <Siren size={12} className="text-red-600 animate-pulse"/> : <CheckCircle size={12} className="text-emerald-600"/>} VINCULADO
                            </td>
                          </tr>
                        </tbody>
                      </table>
                   </div>
                 ) : (
                   <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nenhum profissional vinculado</p>
                      <button onClick={() => setShowDoctorModal(true)} className="px-6 py-2 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">Selecionar Médico</button>
                   </div>
                 )}

                 {/* SEÇÃO DE CONFIRMAÇÃO DA AGENDA */}
                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                       <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Setor de Atendimento</label>
                       <select value={selectedSector} onChange={e => setSelectedSector(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black uppercase outline-none">
                          <option value="">Selecione o Setor...</option>
                          {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                    </div>
                    <button 
                      onClick={priority === 'EMERGÊNCIA' ? handleStartEmergency : handleConfirmSchedule} 
                      disabled={!selectedDoctor || !selectedSector || status === 'SCHEDULED' || status === 'IN_CARE' || status === 'COMPLETED'}
                      className={`mt-auto py-3 text-white rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${priority === 'EMERGÊNCIA' ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-900 hover:bg-blue-600'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {priority === 'EMERGÊNCIA' ? 'Iniciar Atendimento de Emergência' : 'Confirmar Agendamento'}
                    </button>
                 </div>
              </div>
           </div>
        </section>

      {/* SEÇÃO 4 — ATENÇÃO CLÍNICA */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-800"><Activity size={16} className="text-emerald-600"/> SEÇÃO 4: ATENÇÃO CLÍNICA E EVOLUÇÃO</h3>
        </div>
        <div className="p-8 space-y-8">
           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(vitals).map(([k, v]) => (
                <div key={k} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center shadow-inner">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">{k.toUpperCase()}</p>
                  <input value={v} onChange={e => setVitals({...vitals, [k]: e.target.value})} className="w-full text-center text-lg font-black text-slate-900 bg-transparent outline-none" />
                </div>
              ))}
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Procedimento Realizado</label>
                 <select value={dischargeData.procedure} onChange={e => setDischargeData({...dischargeData, procedure: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black uppercase outline-none focus:bg-white cursor-pointer">
                    <option value="">Selecione o Procedimento...</option>
                    {PROCEDURES.map(p => <option key={p.code} value={p.name}>{p.code} - {p.name} (CID: {p.cid})</option>)}
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Conduta Terapêutica</label>
                 <input placeholder="EX: MANUTENÇÃO DE DUAL AGREGRAÇÃO" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black uppercase outline-none focus:bg-white" />
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Evolução Assistencial</label>
              <textarea 
                value={careNote}
                onChange={e => setCareNote(e.target.value)}
                placeholder="Descreva a evolução detalhada do quadro clínico..." 
                className="w-full p-6 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-medium h-32 outline-none focus:bg-white shadow-inner resize-none"
              />
           </div>
           <div className="flex justify-between items-center border-t border-slate-100 pt-6">
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:underline"><FilePlus size={14}/> Anexar exames realizados</button>
              <button onClick={handleRegisterCare} className="px-10 py-4 bg-slate-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 shadow-lg transition-all active:scale-95">Registrar Atendimento → IN_CARE</button>
           </div>
        </div>
      </section>

      {/* SEÇÃO 5 — ALTA */}
      <section className="bg-slate-900 text-white border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
           <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2"><CheckCircle size={16} className="text-blue-400"/> SEÇÃO 5: ALTA E DESFECHO ASSISTENCIAL</h3>
           <div className="px-3 py-1 bg-blue-600/30 text-blue-400 rounded text-[8px] font-black tracking-widest uppercase">Verified Ledger Output</div>
        </div>
        <div className="p-10 space-y-10 uppercase font-black">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2">
                 <label className="text-[8px] font-black text-slate-500 tracking-widest px-1">Diagnóstico Final (CID-10)</label>
                 <input value={dischargeData.diagnosis} onChange={e => setDischargeData({...dischargeData, diagnosis: e.target.value.toUpperCase()})} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-xs outline-none focus:border-blue-500" placeholder="EX: I21.0" />
              </div>
              <div className="space-y-2">
                 <label className="text-[8px] font-black text-slate-500 tracking-widest px-1">Condição de Alta</label>
                 <select value={dischargeData.condition} onChange={e => setDischargeData({...dischargeData, condition: e.target.value})} className="w-full p-4 bg-slate-800 border border-white/10 rounded-xl text-xs cursor-pointer outline-none">
                    <option>ESTÁVEL (ALTA)</option>
                    <option>MELHORADO</option>
                    <option>TRANSFERÊNCIA EXTERNA</option>
                    <option>ÓBITO</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[8px] font-black text-slate-500 tracking-widest px-1">Destino do Paciente</label>
                 <select value={dischargeData.destination} onChange={e => setDischargeData({...dischargeData, destination: e.target.value})} className="w-full p-4 bg-slate-800 border border-white/10 rounded-xl text-xs cursor-pointer outline-none">
                    <option>RESIDÊNCIA</option>
                    <option>OUTRA UNIDADE (S.D.)</option>
                    <option>UBS DE REFERÊNCIA</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[8px] font-black text-slate-500 tracking-widest px-1">Indicações Pós-Alta</label>
                 <input value={dischargeData.instructions} onChange={e => setDischargeData({...dischargeData, instructions: e.target.value.toUpperCase()})} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-xs outline-none focus:border-blue-500" placeholder="EX: RETORNO EM 15 DIAS" />
              </div>
           </div>
           <button onClick={handleFinalizeCase} disabled={status === 'COMPLETED'} className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-blue-700 transition-all disabled:opacity-20 active:scale-95 border-b-4 border-blue-800">Finalizar Caso → COMPLETED</button>
        </div>
      </section>

      {/* SEÇÃO 6 — TIMELINE (TABELA CRONOLÓGICA) */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
           <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-800"><History size={16} className="text-slate-400"/> SEÇÃO 6: TIMELINE E AUDITORIA</h3>
        </div>
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-3 w-[180px] border-r border-slate-100">Data / Hora</th>
              <th className="px-6 py-3 border-r border-slate-100">Evento Federado</th>
              <th className="px-6 py-3 border-r border-slate-100 w-[200px]">Ator / Nó</th>
              <th className="px-6 py-3">Observação Ledger</th>
            </tr>
          </thead>
          <tbody className="text-[10px] font-bold uppercase divide-y divide-slate-50">
            <tr>
              <td className="px-6 py-4 font-mono text-slate-400">25/10/24 11:00</td>
              <td className="px-6 py-4 text-blue-600">REFERRED_TO_PROVIDER</td>
              <td className="px-6 py-4 text-slate-500">MOTOR CUIDI</td>
              <td className="px-6 py-4 text-slate-400 normal-case italic">Expediente Clínico direcionado ao seu nó assistencial.</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-mono text-slate-400">25/10/24 10:30</td>
              <td className="px-6 py-4 text-emerald-600">REGULATION_APPROVED</td>
              <td className="px-6 py-4 text-slate-500">CENTRAL ESTADUAL</td>
              <td className="px-6 py-4 text-slate-400 normal-case italic">Elegibilidade confirmada pelo complexo regulador federado.</td>
            </tr>
            {status !== 'REFERRED' && (
              <tr className="bg-blue-50/30">
                <td className="px-6 py-4 font-mono text-blue-400">AGORA</td>
                <td className="px-6 py-4 text-blue-700">PROVIDER_{status}</td>
                <td className="px-6 py-4 text-slate-700">VOCÊ</td>
                <td className="px-6 py-4 text-blue-900 normal-case italic">Atualização de estado registrada no Ledger Territorial.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* RODAPÉ TÉCNICO */}
      <div className="bg-slate-100 p-8 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200 text-slate-400"><Database size={20}/></div>
            <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nó Institucional Federado</p>
               <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{user?.nodeName || 'Hospital de Especialidades'}</p>
            </div>
         </div>
         <div className="text-center md:text-right">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Criptografia em trânsito</p>
            <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
               <ShieldCheck size={14}/> SESSÃO PROTEGIDA POR DID-FEDERADA
            </div>
         </div>
      </div>

      {/* MODAL DE SELEÇÃO MÉDICA (Overlay) */}
      {showDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
           <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
              <div className={`p-6 border-b border-slate-100 flex justify-between items-center ${priority === 'EMERGÊNCIA' ? 'bg-red-50' : 'bg-slate-50/50'}`}>
                 <div>
                    <h2 className={`text-lg font-black uppercase tracking-tight ${priority === 'EMERGÊNCIA' ? 'text-red-700' : 'text-slate-900'}`}>
                       {priority === 'EMERGÊNCIA' ? 'Escala de Plantão (Urgência/Emergência)' : 'Grade de Agenda (Eletiva/Ambulatório)'}
                    </h2>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${priority === 'EMERGÊNCIA' ? 'text-red-400' : 'text-slate-400'}`}>
                       Filtrando recursos por nível de risco: <span className="underline">{priority}</span>
                    </p>
                 </div>
                 <button onClick={() => setShowDoctorModal(false)} className="p-2 bg-white rounded-full hover:bg-slate-100 transition-colors"><X size={20}/></button>
              </div>
              
              <div className="p-6 space-y-6">
                 <div className="flex gap-4">
                    <div className="flex-1 relative">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                       <input value={doctorSearch} onChange={e => setDoctorSearch(e.target.value)} placeholder="Filtrar por nome..." className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-xs font-bold uppercase outline-none" />
                    </div>
                    <select value={doctorFilterSpec} onChange={e => setDoctorFilterSpec(e.target.value)} className="p-3 bg-slate-50 rounded-xl text-xs font-bold uppercase outline-none border-r-[10px] border-r-transparent">
                       <option value="TODAS">Todas Esp.</option>
                       {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>

                 <div className="max-h-[300px] overflow-y-auto">
                    <table className="w-full text-left text-[10px] font-black uppercase">
                       <thead className="bg-slate-50 text-slate-400 sticky top-0">
                          <tr>
                             <th className="px-4 py-3">Profissional</th>
                             <th className="px-4 py-3">Especialidade</th>
                             <th className="px-4 py-3">{priority === 'EMERGÊNCIA' ? 'Turno / Horário' : 'Próxima Vaga Livre'}</th>
                             <th className="px-4 py-3 text-right">Ação</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {filteredDoctors.map(doc => (
                             <tr key={doc.id} className={`cursor-pointer ${priority === 'EMERGÊNCIA' ? 'hover:bg-red-50' : 'hover:bg-blue-50'}`}>
                                <td className="px-4 py-3 text-slate-900">{doc.name}</td>
                                <td className="px-4 py-3 text-slate-500">{doc.spec}</td>
                                <td className="px-4 py-3 text-slate-700">
                                   {doc.type === 'PLANTAO' ? (
                                      <span className="flex items-center gap-1 text-red-600"><Clock size={10}/> {doc.shift} • {doc.responseTime}</span>
                                   ) : (
                                      <span className="flex items-center gap-1 text-blue-600"><Calendar size={10}/> {doc.nextSlot}</span>
                                   )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                   <button 
                                     onClick={() => { setSelectedDoctor(doc); setShowDoctorModal(false); }}
                                     className={`px-3 py-1.5 text-white rounded-lg transition-colors ${priority === 'EMERGÊNCIA' ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-900 hover:bg-blue-600'}`}
                                   >
                                      {priority === 'EMERGÊNCIA' ? 'Acionar' : 'Agendar'}
                                   </button>
                                </td>
                             </tr>
                          ))}
                          {filteredDoctors.length === 0 && (
                             <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">Nenhum profissional disponível para o perfil de risco selecionado.</td></tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};