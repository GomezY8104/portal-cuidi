
import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Filter, ChevronRight, 
  Activity, Clock, Stethoscope, ClipboardList, Siren,
  ArrowRight, User, MoreVertical, Trash2, Download,
  CheckCircle, AlertCircle, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore'; // Importar Store
import { MOCK_PATIENTS } from '../../mocks/seed';
import { downloadCSV } from '../../utils/downloadUtils';

// Configuración Visual del Protocolo Manchester
const getRiskConfig = (risk: string) => {
  switch (risk) {
    case 'VERMELHO': return { label: 'Emergência', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', full: 'bg-red-600 text-white' };
    case 'LARANJA': return { label: 'Muito Urgente', text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', full: 'bg-orange-500 text-white' };
    case 'AMARELO': return { label: 'Urgente', text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', full: 'bg-yellow-400 text-yellow-900' };
    case 'VERDE': return { label: 'Pouco Urgente', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', full: 'bg-emerald-500 text-white' };
    case 'AZUL': return { label: 'Não Urgente', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', full: 'bg-blue-500 text-white' };
    default: return { label: 'Aguardando', text: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200', full: 'bg-slate-300 text-slate-700' };
  }
};

type UpaStage = 'TRIAGEM' | 'MEDICAL' | 'OBSERVATION' | 'REGULATION' | 'DISCHARGED';

export const UpaWorkTrayPage: React.FC = () => {
  const navigate = useNavigate();
  const { upaQueue, removeUpaCase, removedCaseIds } = useAppStore(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<UpaStage>('TRIAGEM'); 
  const [filterRisk, setFilterRisk] = useState('ALL');

  // --- DATA MERGING (Store + Mocks) ---
  const allPatients = useMemo(() => {
    // 1. Convertir Mocks a formato UPA
    const mockMapped = MOCK_PATIENTS.map((p, idx) => {
      let stage: UpaStage = 'MEDICAL';
      let risk = 'AMARELO';
      let status = 'Aguardando Médico';

      if (idx % 3 === 0) {
         stage = 'MEDICAL'; // Default
         risk = idx % 2 === 0 ? 'VERDE' : 'AMARELO';
         status = 'Fila de Consultório';
      } else if (idx % 3 === 1) {
         stage = 'OBSERVATION';
         risk = 'LARANJA';
         status = 'Em Medicação';
      } else {
         stage = 'REGULATION';
         risk = 'VERMELHO';
         status = 'Aguardando Vaga';
      }

      return {
        id: `UPA-24-${1000 + idx}`,
        patientName: p.name,
        age: 2024 - parseInt(p.birthDate.split('-')[0]),
        gender: p.gender,
        complaint: idx % 2 === 0 ? 'Dor Torácica / Dispneia' : 'Cefaleia Intensa / Vômitos',
        arrival: `${10 + idx * 15} min`,
        risk: risk,
        stage: stage,
        status: status,
        doctor: (stage as string) !== 'TRIAGEM' ? 'Dr. Plantonista' : '-'
      };
    });

    // 2. Combinar: Filter out mocks that are present in upaQueue (overridden by state changes)
    const upaQueueIds = new Set(upaQueue.map(c => c.id));
    const filteredMocks = mockMapped.filter(m => !upaQueueIds.has(m.id));

    // Combine: Queue items first (new/updated), then remaining mocks
    const combined = [...upaQueue, ...filteredMocks];

    // 3. FILTRADO GLOBAL: Eliminar cualquiera que esté en la lista negra (borrados explícitos)
    return combined.filter(p => !removedCaseIds.includes(p.id));

  }, [upaQueue, removedCaseIds]); 

  const filteredData = useMemo(() => {
    return allPatients
      .filter(p => p.stage === activeTab)
      .filter(p => {
         const matchSearch = p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
         const matchRisk = filterRisk === 'ALL' || p.risk === filterRisk;
         return matchSearch && matchRisk;
      });
  }, [allPatients, activeTab, searchTerm, filterRisk]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation(); 
    if (window.confirm('Confirma a remoção deste paciente da fila?')) {
        removeUpaCase(id); 
    }
  };

  const handleExport = () => {
      downloadCSV(`UPA_Plantao_${activeTab}.csv`, filteredData);
  };

  const getStageCounts = (stage: UpaStage) => allPatients.filter(p => p.stage === stage).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans text-slate-900">
      
      {/* HEADER & ACTIONS */}
      <div className="flex justify-between items-center bg-white p-4 rounded-sm border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-lg font-black text-slate-800 uppercase tracking-tight">Controle de Fluxo UPA 24h</h1>
          <p className="text-xs text-slate-500 font-medium">Unidade: UPA ZONA NORTE (CNES 7654321)</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={handleExport}
             className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-sm text-xs font-bold uppercase hover:bg-slate-50 flex items-center gap-2 transition-all"
           >
             <Download size={14}/> Exportar Plantão
           </button>
           <button 
             onClick={() => navigate('/upa/new-case')}
             className="px-4 py-2 bg-slate-900 text-white rounded-sm text-xs font-bold uppercase hover:bg-slate-800 flex items-center gap-2 shadow-sm transition-all active:scale-95"
           >
             <Plus size={16}/> Nova Admissão
           </button>
        </div>
      </div>

      {/* FILTERS BAR & TABS */}
      <div className="flex flex-col gap-4">
         {/* TABS DE FLUXO */}
         <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-200">
            {[
               { id: 'TRIAGEM', label: 'Recepção / Triagem', icon: <ClipboardList size={16}/> },
               { id: 'MEDICAL', label: 'Fila Médica', icon: <Stethoscope size={16}/> },
               { id: 'OBSERVATION', label: 'Observação', icon: <Activity size={16}/> },
               { id: 'REGULATION', label: 'Regulação', icon: <Siren size={16}/> },
               { id: 'DISCHARGED', label: 'Altas / Encerrados', icon: <LogOut size={16}/> },
            ].map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as UpaStage)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-t-lg font-black text-[10px] uppercase tracking-widest transition-all relative top-[1px] border-b-2 whitespace-nowrap ${
                     activeTab === tab.id 
                     ? 'bg-slate-100 border-slate-400 text-slate-900' 
                     : 'text-slate-400 hover:text-slate-600 border-transparent hover:bg-slate-50'
                  }`}
               >
                  {tab.icon} {tab.label}
                  <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] ${activeTab === tab.id ? 'bg-slate-300 text-slate-800' : 'bg-slate-100 text-slate-500'}`}>
                     {getStageCounts(tab.id as UpaStage)}
                  </span>
               </button>
            ))}
         </div>

         {/* BARRA DE FILTROS (ESTILO APS) */}
         <div className="bg-slate-100 p-3 rounded-sm border border-slate-200 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-500"/>
                <span className="text-[10px] font-bold uppercase text-slate-500">Filtros:</span>
            </div>
            
            <div className="relative">
                <select 
                  value={filterRisk}
                  onChange={e => setFilterRisk(e.target.value)}
                  className="pl-2 pr-8 py-1.5 bg-white border border-slate-300 rounded-sm text-xs font-medium text-slate-700 outline-none focus:border-blue-500 uppercase"
                >
                   <option value="ALL">Todos os Riscos</option>
                   <option value="VERMELHO">Emergência</option>
                   <option value="LARANJA">Muito Urgente</option>
                   <option value="AMARELO">Urgente</option>
                   <option value="VERDE">Pouco Urgente</option>
                   <option value="AZUL">Não Urgente</option>
                </select>
            </div>

            <div className="flex-1 max-w-md relative ml-auto">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                <input 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   placeholder="BUSCAR POR NOME, ID OU QUEIXA..."
                   className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-sm text-xs font-bold outline-none focus:border-blue-500 uppercase placeholder:normal-case placeholder:font-normal"
                />
            </div>
         </div>
      </div>

      {/* DATA TABLE (ESTILO APS) */}
      <div className="bg-white border border-slate-300 rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300">
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-24 text-center">Classificação</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-32">Protocolo</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Paciente / Idade</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Queixa / Sintomas</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-32 text-center">Tempo Espera</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-40 text-center">Status / Médico</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right w-24">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredData.map((item) => {
              const riskInfo = getRiskConfig(item.risk);
              return (
                <tr key={item.id} className="hover:bg-blue-50/50 transition-colors group cursor-pointer" onClick={() => navigate(`/upa/case/${item.id}`)}>
                  <td className="px-4 py-2 border-r border-slate-100 text-center">
                     <div className={`w-4 h-4 rounded-full mx-auto shadow-sm ring-1 ring-white ${riskInfo.full}`} title={riskInfo.label}></div>
                  </td>
                  <td className="px-4 py-2 border-r border-slate-100">
                     <span className="font-mono text-xs font-bold text-slate-600">{item.id}</span>
                  </td>
                  <td className="px-4 py-2 border-r border-slate-100">
                     <p className="text-xs font-bold text-slate-900 uppercase truncate max-w-[200px]">{item.patientName}</p>
                     <p className="text-[10px] text-slate-500 font-medium">{item.age} ANOS • {item.gender?.charAt(0)}</p>
                  </td>
                  <td className="px-4 py-2 border-r border-slate-100">
                     <p className="text-[10px] font-medium text-slate-700 uppercase truncate max-w-[250px]">{item.complaint}</p>
                  </td>
                  <td className="px-4 py-2 border-r border-slate-100 text-center">
                     <span className="text-xs text-slate-900 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded">{item.arrival}</span>
                  </td>
                  <td className="px-4 py-2 border-r border-slate-100 text-center">
                     <p className="text-[9px] font-black uppercase text-slate-700">{item.status}</p>
                     {item.doctor !== '-' && <p className="text-[8px] text-slate-400 uppercase mt-0.5">{item.doctor}</p>}
                  </td>
                  
                  <td className="px-4 py-2 text-right">
                     <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        {activeTab !== 'DISCHARGED' && (
                            <button 
                                onClick={(e) => handleDelete(e, item.id)}
                                className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                                title="Remover da Fila"
                            >
                                <Trash2 size={14}/>
                            </button>
                        )}
                        <button 
                          onClick={() => navigate(`/upa/case/${item.id}`)}
                          className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-100 rounded transition-all"
                          title="Abrir Prontuário"
                        >
                           <ArrowRight size={14}/>
                        </button>
                     </div>
                  </td>
                </tr>
              );
            })}
            {filteredData.length === 0 && (
                <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400 italic text-xs uppercase font-bold">
                        Nenhum paciente nesta etapa.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
