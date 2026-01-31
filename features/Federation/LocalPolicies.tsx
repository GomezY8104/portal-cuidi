
import React, { useState, useMemo } from 'react';
import { 
  Shield, Plus, Search, Filter, Trash2, Edit, 
  Users, AlertTriangle, FileText, CheckCircle, Ban, 
  Globe, Server, X, Save, CheckSquare, Square, Info,
  Building2, Activity, Lock, History, AlertCircle
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

// --- TIPOS DE DATOS ---

type SegmentType = 'ALL' | 'APS' | 'UPA' | 'HOSPITAL' | 'REGULATOR' | 'EXTERNAL';
type PolicyScope = 'GLOBAL_SEGMENT' | 'SPECIFIC_NODE';

interface Policy {
  id: string;
  segment: SegmentType; // A qué segmento pertenece (ej: UPA)
  scope: PolicyScope;   // Si es para TODAS las UPAs o una UPA específica
  targetId?: string;    // ID del nodo específico (si scope === SPECIFIC_NODE)
  targetName: string;   // Nombre mostrable (ej: "Todas las UPAs" o "UPA Zona Norte")
  permissions: string[]; // Array de permisos (CLINICAL, IMAGING, etc.)
  purpose: string;
  validity: string;
  status: 'ACTIVE' | 'REVOKED';
  lastUpdate: string;
}

const PERMISSION_OPTIONS = [
  { id: 'CLINICAL', label: 'Resumo Clínico (Evoluções)', icon: <FileText size={14}/> },
  { id: 'LABS', label: 'Exames Laboratoriais', icon: <Activity size={14}/> },
  { id: 'IMAGING', label: 'Imagens (DICOM)', icon: <FileText size={14}/> },
  { id: 'MEDS', label: 'Prescrições / Receitas', icon: <FileText size={14}/> },
  { id: 'SENSITIVE', label: 'Dados Sensíveis (HIV/Psy)', icon: <Lock size={14}/> },
];

const SEGMENTS = [
  { id: 'ALL', label: 'Visão Geral' },
  { id: 'APS', label: 'Atenção Primária' },
  { id: 'UPA', label: 'Urgência (UPA)' },
  { id: 'HOSPITAL', label: 'Hospitais' },
  { id: 'REGULATOR', label: 'Reguladores' },
];

export const LocalPoliciesPage: React.FC = () => {
  // --- ESTADOS ---
  const [activeSegment, setActiveSegment] = useState<SegmentType>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Datos Iniciales (Mock)
  const [policies, setPolicies] = useState<Policy[]>([
    { 
      id: 'POL-001', segment: 'APS', scope: 'GLOBAL_SEGMENT', targetName: 'Toda a Rede APS', 
      permissions: ['CLINICAL', 'MEDS'], purpose: 'CONTINUIDADE', validity: 'PERMANENTE', status: 'ACTIVE', lastUpdate: '20/10/2024' 
    },
    { 
      id: 'POL-002', segment: 'HOSPITAL', scope: 'GLOBAL_SEGMENT', targetName: 'Todos os Hospitais', 
      permissions: ['CLINICAL', 'LABS', 'IMAGING'], purpose: 'INTERNAÇÃO', validity: 'PERMANENTE', status: 'ACTIVE', lastUpdate: '15/10/2024' 
    },
    { 
      id: 'POL-003', segment: 'UPA', scope: 'SPECIFIC_NODE', targetId: 'UPA-ZS-01', targetName: 'UPA Zona Sul - Unidade 1', 
      permissions: ['CLINICAL'], purpose: 'URGENCIA', validity: '24 HORAS', status: 'ACTIVE', lastUpdate: '25/10/2024' 
    },
    { 
      id: 'POL-004', segment: 'REGULATOR', scope: 'GLOBAL_SEGMENT', targetName: 'Centrais de Regulação', 
      permissions: ['CLINICAL', 'LABS', 'IMAGING', 'MEDS', 'SENSITIVE'], purpose: 'REGULAÇÃO', validity: 'PERMANENTE', status: 'ACTIVE', lastUpdate: '01/10/2024' 
    },
    { 
      id: 'POL-005', segment: 'HOSPITAL', scope: 'SPECIFIC_NODE', targetId: 'HOSP-ST-CASA', targetName: 'Santa Casa de Misericórdia', 
      permissions: ['IMAGING'], purpose: 'TELELAUDO', validity: '30 DIAS', status: 'REVOKED', lastUpdate: '10/09/2024' 
    },
  ]);

  // Estado del Formulario
  const [formData, setFormData] = useState<Partial<Policy>>({
    segment: 'APS',
    scope: 'GLOBAL_SEGMENT',
    targetName: '',
    permissions: [],
    purpose: 'CONTINUIDADE',
    validity: 'PERMANENTE',
    status: 'ACTIVE'
  });

  // --- FILTROS ---
  const filteredPolicies = useMemo(() => {
    return policies.filter(p => {
      const matchSegment = activeSegment === 'ALL' || p.segment === activeSegment;
      const matchSearch = p.targetName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.targetId && p.targetId.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchSegment && matchSearch;
    });
  }, [policies, activeSegment, searchTerm]);

  // --- ACCIONES ---

  const handleOpenModal = (policy?: Policy) => {
    if (policy) {
      setEditingId(policy.id);
      setFormData({ ...policy });
    } else {
      setEditingId(null);
      setFormData({
        segment: activeSegment === 'ALL' ? 'APS' : activeSegment, // Pre-seleciona o segmento atual
        scope: 'GLOBAL_SEGMENT',
        targetName: '',
        permissions: [],
        purpose: 'CONTINUIDADE',
        validity: 'PERMANENTE',
        status: 'ACTIVE'
      });
    }
    setIsModalOpen(true);
  };

  const handleTogglePermission = (permId: string) => {
    setFormData(prev => {
      const current = prev.permissions || [];
      const exists = current.includes(permId);
      return {
        ...prev,
        permissions: exists ? current.filter(p => p !== permId) : [...current, permId]
      };
    });
  };

  const handleSave = () => {
    if (!formData.targetName && formData.scope === 'SPECIFIC_NODE') {
      alert('Por favor, defina o nome do nó específico.');
      return;
    }
    if ((formData.permissions || []).length === 0) {
      alert('Selecione ao menos uma permissão.');
      return;
    }

    const now = new Date().toLocaleDateString();
    
    // Auto-nomeação para regras globais se estiver vazio
    let finalTargetName = formData.targetName;
    if (formData.scope === 'GLOBAL_SEGMENT') {
        const segLabel = SEGMENTS.find(s => s.id === formData.segment)?.label;
        finalTargetName = `Todos: ${segLabel}`;
    }

    const payload = {
        ...formData,
        targetName: finalTargetName,
        lastUpdate: now
    } as Policy;

    if (editingId) {
      setPolicies(prev => prev.map(p => p.id === editingId ? { ...p, ...payload } : p));
    } else {
      const newId = `POL-${Math.floor(Math.random() * 10000)}`;
      setPolicies(prev => [{ ...payload, id: newId }, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleRevoke = (id: string) => {
    if (confirm('Tem certeza que deseja revogar esta política? O acesso será bloqueado imediatamente para este alvo.')) {
      setPolicies(prev => prev.map(p => p.id === id ? { ...p, status: 'REVOKED', lastUpdate: new Date().toLocaleDateString() } : p));
    }
  };

  const handleReactivate = (id: string) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, status: 'ACTIVE', lastUpdate: new Date().toLocaleDateString() } : p));
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-20 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-slate-500 font-black text-[10px] uppercase tracking-widest">
             <Shield size={14} /> Governança de Dados
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Políticas Locais</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Defina quem pode ver o quê no seu nó. As regras são propagadas para o Ledger.
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95"
        >
           <Plus size={16} /> Nova Política
        </button>
      </div>

      {/* PESTAÑAS DE SEGMENTO */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
         {SEGMENTS.map(seg => (
            <button
               key={seg.id}
               onClick={() => setActiveSegment(seg.id as any)}
               className={`px-6 py-3 rounded-t-xl font-black text-[10px] uppercase tracking-widest transition-all relative top-[1px] border-b-2 flex items-center gap-2 whitespace-nowrap ${
                  activeSegment === seg.id 
                  ? 'bg-white text-blue-600 border-blue-600 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600 border-transparent hover:bg-slate-50'
               }`}
            >
               {seg.id === 'ALL' ? <Globe size={14}/> : <Building2 size={14}/>}
               {seg.label}
               {seg.id !== 'ALL' && (
                   <span className="ml-2 bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md text-[9px]">
                       {policies.filter(p => p.segment === seg.id && p.status === 'ACTIVE').length}
                   </span>
               )}
            </button>
         ))}
      </div>

      {/* ÁREA DE CONTENIDO */}
      <div className="bg-white border border-slate-200 rounded-b-xl rounded-tr-xl overflow-hidden shadow-sm min-h-[400px]">
         
         {/* Barra de Herramientas */}
         <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="relative w-80">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
               <input 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 placeholder="Filtrar políticas..." 
                 className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-slate-900 transition-all"
               />
            </div>
            <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Global</span>
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Específica</span>
            </div>
         </div>

         {/* Tabla de Políticas */}
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                  <th className="px-6 py-4">Alvo / Beneficiário</th>
                  <th className="px-6 py-4">Segmento</th>
                  <th className="px-6 py-4">Permissões Concedidas</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Vigência</th>
                  <th className="px-6 py-4 text-right">Ações</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {filteredPolicies.map(policy => (
                  <tr key={policy.id} className={`hover:bg-slate-50 transition-colors group ${policy.status === 'REVOKED' ? 'opacity-60 bg-slate-50' : ''}`}>
                     <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                           <div className={`mt-0.5 p-2 rounded-lg text-white shadow-sm ${policy.scope === 'GLOBAL_SEGMENT' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                              {policy.scope === 'GLOBAL_SEGMENT' ? <Globe size={16}/> : <Server size={16}/>}
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-900 uppercase">{policy.targetName}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-wide">
                                 {policy.scope === 'GLOBAL_SEGMENT' ? 'REGRAS DE PAPEL (ROLE)' : `ID: ${policy.targetId}`}
                              </p>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 uppercase">
                           {policy.segment}
                        </span>
                     </td>
                     <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                           {policy.permissions.map(perm => (
                              <span key={perm} className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase ${perm === 'SENSITIVE' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                 {perm}
                              </span>
                           ))}
                        </div>
                     </td>
                     <td className="px-6 py-4 text-center">
                        {policy.status === 'ACTIVE' ? (
                           <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 uppercase tracking-widest">
                              <CheckCircle size={10}/> Ativo
                           </span>
                        ) : (
                           <span className="inline-flex items-center gap-1 text-[9px] font-black text-red-700 bg-red-50 px-2 py-1 rounded border border-red-100 uppercase tracking-widest">
                              <Ban size={10}/> Revogado
                           </span>
                        )}
                        <p className="text-[8px] text-slate-400 mt-1 font-mono">{policy.lastUpdate}</p>
                     </td>
                     <td className="px-6 py-4 text-center">
                        <span className="text-[10px] font-bold text-slate-600">{policy.validity}</span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                           <button onClick={() => handleOpenModal(policy)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all" title="Editar Regra">
                              <Edit size={14}/>
                           </button>
                           {policy.status === 'ACTIVE' ? (
                              <button onClick={() => handleRevoke(policy.id)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-red-600 hover:border-red-200 shadow-sm transition-all" title="Revogar Acesso">
                                 <Trash2 size={14}/>
                              </button>
                           ) : (
                              <button onClick={() => handleReactivate(policy.id)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-emerald-600 hover:border-emerald-200 shadow-sm transition-all" title="Reativar">
                                 <CheckCircle size={14}/>
                              </button>
                           )}
                        </div>
                     </td>
                  </tr>
               ))}
               {filteredPolicies.length === 0 && (
                  <tr>
                     <td colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                              <Filter size={32}/>
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Nenhuma política encontrada</p>
                              <p className="text-xs text-slate-300 font-bold mt-1">Tente mudar o segmento ou termo de busca</p>
                           </div>
                        </div>
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>

      {/* --- MODAL DE EDICIÓN --- */}
      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
               
               {/* Header Modal */}
               <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                        <Shield size={24}/>
                     </div>
                     <div>
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                           {editingId ? 'Editar Política' : 'Nova Política de Acesso'}
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                           Definição de Regras no Ledger Local
                        </p>
                     </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"><X size={20}/></button>
               </div>

               {/* Body Modal */}
               <div className="p-8 overflow-y-auto custom-scrollbar space-y-8 flex-1">
                  
                  {/* SECCION 1: DEFINICION DEL ALVO */}
                  <section className="space-y-4">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">1. Definição do Alvo</h3>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <button 
                           onClick={() => setFormData({...formData, scope: 'GLOBAL_SEGMENT'})}
                           className={`p-4 rounded-xl border-2 flex flex-col items-center text-center gap-2 transition-all ${formData.scope === 'GLOBAL_SEGMENT' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                           <Globe size={24}/>
                           <span className="text-[10px] font-black uppercase">Regra Global</span>
                           <span className="text-[9px] font-medium opacity-70">Aplica-se a todo o segmento</span>
                        </button>
                        <button 
                           onClick={() => setFormData({...formData, scope: 'SPECIFIC_NODE'})}
                           className={`p-4 rounded-xl border-2 flex flex-col items-center text-center gap-2 transition-all ${formData.scope === 'SPECIFIC_NODE' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                           <Server size={24}/>
                           <span className="text-[10px] font-black uppercase">Nó Específico</span>
                           <span className="text-[9px] font-medium opacity-70">Exceção para um ID único</span>
                        </button>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Segmento Afetado</label>
                        <select 
                           value={formData.segment} 
                           onChange={e => setFormData({...formData, segment: e.target.value as any})}
                           className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                        >
                           {SEGMENTS.filter(s => s.id !== 'ALL').map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                     </div>

                     {formData.scope === 'SPECIFIC_NODE' && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                           <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ID do Nó (CNES/UUID)</label>
                              <input 
                                 value={formData.targetId || ''}
                                 onChange={e => setFormData({...formData, targetId: e.target.value})}
                                 className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-purple-500 uppercase font-mono"
                                 placeholder="EX: NODE-SP-001"
                              />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome Amigável</label>
                              <input 
                                 value={formData.targetName}
                                 onChange={e => setFormData({...formData, targetName: e.target.value})}
                                 className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-purple-500"
                                 placeholder="EX: Hospital Santa Marcelina"
                              />
                           </div>
                        </div>
                     )}
                  </section>

                  {/* SECCION 2: PERMISOS MULTI-SELECT */}
                  <section className="space-y-4">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">2. Permissões de Dados</h3>
                     <div className="grid grid-cols-1 gap-2">
                        {PERMISSION_OPTIONS.map(opt => {
                           const isSelected = (formData.permissions || []).includes(opt.id);
                           return (
                              <button 
                                 key={opt.id}
                                 onClick={() => handleTogglePermission(opt.id)}
                                 className={`w-full p-3 rounded-xl flex items-center justify-between border transition-all ${isSelected ? 'bg-indigo-50 border-indigo-200 text-indigo-800' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                              >
                                 <div className="flex items-center gap-3">
                                    {opt.icon}
                                    <span className="text-[10px] font-black uppercase">{opt.label}</span>
                                 </div>
                                 {isSelected ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}
                              </button>
                           );
                        })}
                     </div>
                  </section>

                  {/* SECCION 3: REGLAS DE NEGOCIO */}
                  <section className="space-y-4">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">3. Regras de Negócio</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Finalidade</label>
                           <select 
                              value={formData.purpose} 
                              onChange={e => setFormData({...formData, purpose: e.target.value})}
                              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold outline-none"
                           >
                              <option value="CONTINUIDADE">Continuidade do Cuidado</option>
                              <option value="URGENCIA">Urgência / Emergência</option>
                              <option value="AUDITORIA">Auditoria Técnica</option>
                              <option value="REGULAÇÃO">Regulação de Vagas</option>
                           </select>
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Vigência Token</label>
                           <select 
                              value={formData.validity} 
                              onChange={e => setFormData({...formData, validity: e.target.value})}
                              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold outline-none"
                           >
                              <option value="24 HORAS">24 Horas</option>
                              <option value="7 DIAS">7 Dias</option>
                              <option value="30 DIAS">30 Dias</option>
                              <option value="PERMANENTE">Permanente</option>
                           </select>
                        </div>
                     </div>
                  </section>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 text-amber-800">
                     <Info size={18} className="shrink-0"/>
                     <p className="text-[10px] font-medium leading-relaxed">
                        Ao salvar, esta política será assinada digitalmente e propagada para o barramento local. Todas as requisições que correspondam a estes critérios serão aprovadas automaticamente.
                     </p>
                  </div>
               </div>

               {/* Footer Modal */}
               <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all">Cancelar</button>
                  <button onClick={handleSave} className="flex-[2] py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg">
                     <Save size={16}/> Salvar Política
                  </button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};
