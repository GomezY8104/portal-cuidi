import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, Filter, Activity, Clock, 
  Eye, ArrowUpRight, Building2,
  ChevronDown, X, Check, CheckSquare, Square,
  User, MapPin, Stethoscope, ShieldCheck,
  Zap, ArrowRight, ClipboardCheck, Timer,
  Database, FileText, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_PROVIDER_CASES } from '../../mocks/seed';

const MultiSelectFilter = ({ 
  label, 
  options, 
  selected, 
  onToggle 
}: { 
  label: string, 
  options: string[], 
  selected: string[], 
  onToggle: (val: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all text-[10px] font-black uppercase tracking-widest ${
          selected.length > 0 
          ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 shadow-sm'
        }`}
      >
        {label} {selected.length > 0 && <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded-md ml-1">{selected.length}</span>}
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 lg:right-auto mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl z-40 p-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => onToggle(opt)}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group"
              >
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight group-hover:text-slate-900">{opt}</span>
                {selected.includes(opt) ? (
                  <CheckSquare size={16} className="text-blue-600" />
                ) : (
                  <Square size={16} className="text-slate-200" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Função auxiliar para mapear o status textual para a etapa numérica
const getRegulationStep = (internalStatus: string): number => {
  switch (internalStatus) {
    case 'REFERRED':
      return 1; // Emissão
    case 'UNDER_TECHNICAL_REVIEW':
    case 'WAITING_DOCUMENTS':
      return 2; // Triagem
    case 'ACCEPTED_BY_PROVIDER':
    case 'SCHEDULED':
      return 3; // Homologação
    case 'EMERGENCY_IN_ATTENDANCE':
    case 'IN_CARE':
    case 'COMPLETED':
      return 4; // Recepção
    default:
      return 1;
  }
};

export const ProviderWorkTrayPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

  // Dados carregados do Mock centralizado
  const data = MOCK_PROVIDER_CASES;

  const handleToggleStatus = (val: string) => setSelectedStatuses(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  const handleTogglePriority = (val: string) => setSelectedPriorities(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.patientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(item.status);
      const matchesPriority = selectedPriorities.length === 0 || selectedPriorities.includes(item.priority);
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [data, searchTerm, selectedStatuses, selectedPriorities]);

  const steps = [
    { id: 1, label: 'Emissão' },
    { id: 2, label: 'Triagem' },
    { id: 3, label: 'Homologação' },
    { id: 4, label: 'Recepção' }
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-fade-in-up pb-10">
      {/* HEADER DE COMANDO */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 pb-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Fila de Encaminhamento</h1>
          <p className="text-slate-400 text-[10px] font-black mt-3 uppercase tracking-[0.3em] flex items-center gap-2">
            <Building2 size={12} className="opacity-40 text-blue-600"/> Monitoramento Assistencial Federado
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <MultiSelectFilter label="Status" options={['RECEBIDO', 'AGENDADO', 'PENDENTE']} selected={selectedStatuses} onToggle={handleToggleStatus} />
            <MultiSelectFilter label="Prioridade" options={['EMERGÊNCIA', 'ALTA', 'MÉDIA', 'BAIXA']} selected={selectedPriorities} onToggle={handleTogglePriority} />
          </div>

          <div className="relative flex-1 min-w-[200px] lg:w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              placeholder="Pesquisar paciente ou ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* GRID DE CARDS COM STATUS DA REGULAÇÃO */}
      <div className="grid grid-cols-1 gap-4">
        {filteredData.map((item) => {
          // Calcula o passo atual baseado no internalStatus
          const currentStep = getRegulationStep(item.internalStatus || 'REFERRED');

          return (
            <div key={item.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-6 lg:p-8 shadow-sm hover:shadow-prominent hover:border-blue-200 transition-all group flex flex-col xl:flex-row gap-8 items-stretch">
              
              {/* 1. Identificação Básica */}
              <div className="flex flex-col gap-4 xl:w-[25%] w-full min-w-[280px]">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner shrink-0 border border-slate-100">
                      {item.patientName.charAt(0)}
                    </div>
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-black text-blue-600">#{item.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                             item.priority === 'EMERGÊNCIA' || item.priority === 'ALTA' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                             {item.priority}
                          </span>
                       </div>
                       <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate leading-tight w-full max-w-[200px]">{item.patientName}</h3>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2 mt-auto">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                       <p className="text-[8px] font-black text-slate-400 uppercase">Idade / Sexo</p>
                       <p className="text-[10px] font-bold text-slate-700 uppercase">{item.age} anos • {item.gender?.charAt(0)}</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                       <p className="text-[8px] font-black text-slate-400 uppercase">Fila</p>
                       <p className="text-[10px] font-bold text-slate-700 uppercase">{item.daysQueue} dias</p>
                    </div>
                 </div>
              </div>

              {/* 2. Contexto Assistencial & Notas */}
              <div className="flex flex-col gap-4 xl:w-[45%] w-full xl:border-l xl:border-r xl:border-slate-100 xl:px-8">
                 <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-slate-600">
                       <MapPin size={14} className="text-blue-500"/>
                       <span className="text-[10px] font-black uppercase">{item.origin}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                       <Stethoscope size={14} className="text-emerald-500"/>
                       <span className="text-[10px] font-black uppercase">{item.specialty}</span>
                    </div>
                    {item.condition && (
                        <div className="flex items-center gap-2 text-slate-600">
                           <AlertCircle size={14} className="text-amber-500"/>
                           <span className="text-[10px] font-black uppercase">{item.condition}</span>
                        </div>
                    )}
                 </div>

                 {/* CAMPO DE NOTAS CLÍNICAS NA CARD */}
                 <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex-1 relative group/note">
                    <div className="flex items-center gap-2 mb-2">
                       <FileText size={12} className="text-blue-400"/>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Resumo Clínico / Nota de Encaminhamento</p>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed italic line-clamp-3">
                       "{item.description || 'Sem notas clínicas disponíveis no momento.'}"
                    </p>
                 </div>
              </div>

              {/* 3. Pipeline de Regulação & Ações */}
              <div className="flex flex-col justify-between gap-4 xl:w-[30%] w-full">
                 <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Fluxo de Regulação</p>
                    </div>
                    <div className="flex items-center justify-between w-full relative h-8">
                       <div className="absolute left-0 right-0 h-1 bg-slate-100 top-1/2 -translate-y-1/2 rounded-full"></div>
                       <div 
                         className="absolute left-0 h-1 bg-blue-500 top-1/2 -translate-y-1/2 rounded-full transition-all duration-1000"
                         style={{ width: `${(currentStep / 4) * 100}%` }}
                       ></div>
                       
                       {steps.map(step => (
                          <div key={step.id} className="relative z-10 flex flex-col items-center group/step">
                             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                currentStep >= step.id ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'
                             }`}>
                                {currentStep > step.id && <Check size={10} className="text-white" strokeWidth={3}/>}
                             </div>
                             {/* Tooltip para steps */}
                             <div className="absolute -bottom-6 opacity-0 group-hover/step:opacity-100 transition-opacity bg-slate-800 text-white text-[8px] px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none">
                                {step.label}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <button 
                    onClick={() => navigate(`/provider/regulation-flow/${item.id}`)}
                    className="w-full px-6 py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                 >
                    Acessar Caso <ArrowUpRight size={16} strokeWidth={3}/>
                 </button>
              </div>
            </div>
          );
        })}

        {filteredData.length === 0 && (
          <div className="py-24 bg-white border border-slate-100 rounded-[3rem] text-center space-y-6">
             <div className="w-20 h-20 bg-slate-50 text-slate-100 rounded-[2rem] flex items-center justify-center mx-auto border-4 border-dashed border-slate-100">
               <Search size={40}/>
             </div>
             <div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-[0.4em]">Nenhum registro localizado</p>
                <p className="text-[10px] text-slate-300 font-bold uppercase mt-2 tracking-widest">Altere os filtros ou termo de pesquisa técnica</p>
             </div>
          </div>
        )}
      </div>

      {/* FOOTER DE INFORMAÇÃO TÉCNICA */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5"><Database size={140} className="text-white"/></div>
         <div className="flex items-center gap-5 relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
               <Activity size={24} className="text-blue-400"/>
            </div>
            <div>
               <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Monitoramento Live</p>
               <p className="text-sm font-bold text-slate-300">Conectado ao complexo regulador federado.</p>
            </div>
         </div>
         <div className="flex items-center gap-8 relative z-10">
            <div className="text-right">
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Sincronismo Ledger</p>
               <p className="text-[11px] font-black text-emerald-400 uppercase">Verificado</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-slate-700 flex items-center justify-center">
               <Check size={16} className="text-emerald-400"/>
            </div>
         </div>
      </div>
    </div>
  );
};