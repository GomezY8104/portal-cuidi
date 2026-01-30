import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Zap, ChevronRight, 
  Activity, Clock, Stethoscope, ClipboardList, Siren,
  ArrowRight, User, MoreVertical, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore'; // Importar Store
import { MOCK_PATIENTS } from '../../mocks/seed';

// Configuración Visual del Protocolo Manchester
const getRiskConfig = (risk: string) => {
  switch (risk) {
    case 'VERMELHO': return { weight: 0, label: 'Emergência', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-600', badge: 'bg-red-600 text-white', dot: 'bg-red-600' };
    case 'LARANJA': return { weight: 1, label: 'Muito Urgente', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-500', badge: 'bg-orange-500 text-white', dot: 'bg-orange-500' };
    case 'AMARELO': return { weight: 2, label: 'Urgente', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-400', badge: 'bg-yellow-400 text-yellow-900', dot: 'bg-yellow-400' };
    case 'VERDE': return { weight: 3, label: 'Pouco Urgente', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-400', badge: 'bg-emerald-500 text-white', dot: 'bg-emerald-500' };
    case 'AZUL': return { weight: 4, label: 'Não Urgente', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-400', badge: 'bg-blue-500 text-white', dot: 'bg-blue-500' };
    default: return { weight: 5, label: 'Aguardando', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-300', badge: 'bg-slate-200 text-slate-600', dot: 'bg-slate-300' };
  }
};

type UpaStage = 'TRIAGEM' | 'MEDICAL' | 'OBSERVATION' | 'REGULATION';

export const UpaWorkTrayPage: React.FC = () => {
  const navigate = useNavigate();
  // Ahora usamos removedCaseIds del store para filtrar todo
  const { upaQueue, removeUpaCase, removedCaseIds } = useAppStore(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<UpaStage>('TRIAGEM'); 

  // --- DATA MERGING (Store + Mocks) ---
  const allPatients = useMemo(() => {
    // 1. Convertir Mocks a formato UPA
    const mockMapped = MOCK_PATIENTS.map((p, idx) => {
      let stage: UpaStage = 'MEDICAL';
      let risk = 'AMARELO';
      let status = 'Aguardando Médico';

      // LÓGICA ALTERADA: NENHUM MOCK VAI PARA TRIAGEM INICIALMENTE
      // A fila de triagem deve começar vazia e ser populada por novos cadastros.
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

    // 2. Combinar: Primero los nuevos (Store), luego los Mocks
    const combined = [...upaQueue, ...mockMapped];

    // 3. FILTRADO GLOBAL: Eliminar cualquiera que esté en la lista negra
    return combined.filter(p => !removedCaseIds.includes(p.id));

  }, [upaQueue, removedCaseIds]); // Se recalcula cuando removedCaseIds cambia

  const filteredData = useMemo(() => {
    return allPatients
      .filter(p => p.stage === activeTab)
      .filter(p => p.patientName.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => getRiskConfig(a.risk).weight - getRiskConfig(b.risk).weight);
  }, [allPatients, activeTab, searchTerm]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation(); // Detiene propagación crítica
    
    if (window.confirm('Confirma a remoção deste paciente da fila?')) {
        removeUpaCase(id); // Esto añadirá el ID a removedCaseIds, disparando el filtro
    }
  };

  const counts = {
    TRIAGEM: allPatients.filter(p => p.stage === 'TRIAGEM').length,
    MEDICAL: allPatients.filter(p => p.stage === 'MEDICAL').length,
    OBSERVATION: allPatients.filter(p => p.stage === 'OBSERVATION').length,
    REGULATION: allPatients.filter(p => p.stage === 'REGULATION').length,
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-black text-[10px] uppercase tracking-widest mb-2">
            <Activity size={14} /> Unidade de Pronto Atendimento 24h
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Controle de Fluxo</h1>
        </div>
        <div className="flex gap-3">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              <input 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar paciente..." 
                className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-slate-900 w-[250px] shadow-sm"
              />
           </div>
           <button 
             onClick={() => navigate('/upa/case/new')} 
             className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95"
           >
             <Plus size={16} strokeWidth={3}/> Novo Atendimento
           </button>
        </div>
      </div>

      {/* TABS DE FLUXO */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
           { id: 'TRIAGEM', label: 'Recepção / Triagem', icon: <ClipboardList size={16}/> },
           { id: 'MEDICAL', label: 'Fila Médica', icon: <Stethoscope size={16}/> },
           { id: 'OBSERVATION', label: 'Em Observação', icon: <Activity size={16}/> },
           { id: 'REGULATION', label: 'Aguardando Regulação', icon: <Siren size={16}/> },
        ].map(tab => (
           <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as UpaStage)}
              className={`flex items-center gap-2 px-6 py-4 rounded-t-2xl font-black text-[10px] uppercase tracking-widest transition-all relative top-[1px] border-b-2 ${
                 activeTab === tab.id 
                 ? 'bg-white text-blue-600 border-blue-600' 
                 : 'text-slate-400 hover:text-slate-600 border-transparent hover:bg-slate-50'
              }`}
           >
              {tab.icon} {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[9px] ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                 {counts[tab.id as UpaStage]}
              </span>
           </button>
        ))}
      </div>

      {/* TABLA CLÍNICA */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Prioridade / Risco</th>
              <th className="px-6 py-4">Paciente</th>
              <th className="px-6 py-4">Queixa / Sintomas</th>
              <th className="px-6 py-4">Status / Médico</th>
              <th className="px-6 py-4 text-center">Tempo Espera</th>
              <th className="px-6 py-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map(item => {
              const config = getRiskConfig(item.risk);
              return (
                <tr key={item.id} className="group hover:bg-blue-50/30 transition-colors cursor-pointer" onClick={() => navigate(`/upa/case/${item.id}`)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className={`w-3 h-3 rounded-full ${config.dot} shadow-sm ring-1 ring-white`}></div>
                       <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${config.badge}`}>
                          {config.label}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div>
                        <p className="text-xs font-black text-slate-900 uppercase">{item.patientName}</p>
                        <p className="text-[10px] font-medium text-slate-500 mt-0.5">{item.age} anos • {item.gender}</p>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2 text-slate-700">
                        <Activity size={12} className="text-blue-500 shrink-0"/>
                        <span className="text-[10px] font-bold uppercase truncate max-w-[200px]">{item.complaint}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div>
                        <p className="text-[10px] font-bold text-slate-700 uppercase">{item.status}</p>
                        <p className="text-[9px] font-medium text-slate-400 uppercase">{item.doctor}</p>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">{item.arrival}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-2">
                        {/* Botón de Borrar (Icono Gris Claro -> Rojo en Hover, Sin Fondo Oscuro) */}
                        <div onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={(e) => handleDelete(e, item.id)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Remover da Fila"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/upa/case/${item.id}`); }}
                          className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white rounded-lg font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 ml-auto shadow-sm"
                        >
                          {activeTab === 'TRIAGEM' ? 'Classificar' : 'Atender'} <ArrowRight size={12}/>
                        </button>
                     </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredData.length === 0 && (
           <div className="p-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                 <ClipboardList size={32}/>
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Nenhum paciente nesta etapa</p>
           </div>
        )}
      </div>
    </div>
  );
};