
import React, { useState, useMemo } from 'react';
import { 
  GitPullRequest, MessageSquare, Clock, CheckCircle, 
  AlertCircle, Activity, Building2, 
  UploadCloud, Search, Globe, Database, ArrowUpRight,
  MessageCircle, Mail, FilePlus, Eye, List
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const RegulationCasesPage: React.FC = () => {
  const { openDrawer, user, patientDocRequests, patientCases } = useAppStore(); // Usa dados do Store
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Abas de Estado
  const [activeTab, setActiveTab] = useState<'PENDENCIAS' | 'ENCAMINHAMENTO' | 'CONCLUIDOS'>('PENDENCIAS');

  // --- FILTRAR MEUS CASOS ---
  const myCases = useMemo(() => {
      // Filtra casos onde o usuário é o paciente
      if (user?.role === 'PATIENT') {
          return patientCases.filter(c => c.patientName.toUpperCase() === user.name.toUpperCase() || c.patientId === user.id);
      }
      return patientCases.filter(c => c.patientId === 'p1'); // Fallback para dev
  }, [user, patientCases]);

  // Formatar Casos
  const casesFormatted = myCases.map(c => ({
    id: c.id,
    type: 'CASE',
    title: c.title || c.specialty,
    subtitle: c.specialty,
    date: c.date,
    status: c.status,
    statusLabel: c.status.replace(/_/g, ' '),
    entity: c.entity || c.origin,
    priority: c.priority,
    // Casos que estão "Devolvidos" ou "Pendente de Doc" vão para pendências
    isActionRequired: c.status === 'DEVOLVIDO' || c.status === 'PENDING_DOCS',
    isFinished: c.status === 'FINALIZADO' || c.status === 'RECUSADO' || c.status === 'ALTA' || c.status === 'COMPLETED',
    requiresAttachment: c.status === 'PENDING_DOCS' || c.status === 'EM_ANALISE', 
    timeline: [], 
    messages: c.messages || [],
    hasMessages: c.hasMessages,
    appointment: c.appointment 
  }));

  // Formatar Solicitações de Documentos (Sempre Pendências)
  const docRequests = patientDocRequests.map(req => ({
    id: req.id,
    type: 'DOC_REQ',
    title: req.documentType,
    subtitle: req.description,
    date: req.dueDate,
    status: 'PENDING',
    statusLabel: 'Documento Pendente',
    entity: req.requester,
    priority: req.priority,
    isActionRequired: true,
    isFinished: false,
    requiresAttachment: true,
    originalData: req,
    timeline: [],
    messages: [],
    hasMessages: true 
  }));

  // --- MERGE & FILTER POR ABA ---
  const filteredList = useMemo(() => {
    const combined = [...docRequests, ...casesFormatted];
    
    // Filtro de Texto
    const textFiltered = combined.filter(item => {
      return item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
             item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.entity.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Filtro por Aba
    return textFiltered.filter(item => {
        if (activeTab === 'PENDENCIAS') {
            return item.isActionRequired; 
        }
        if (activeTab === 'ENCAMINHAMENTO') {
            return !item.isActionRequired && !item.isFinished;
        }
        if (activeTab === 'CONCLUIDOS') {
            return item.isFinished;
        }
        return true;
    });
  }, [searchTerm, activeTab, casesFormatted, docRequests]);

  const getPriorityColor = (priority: string) => {
    if (priority === 'ALTA' || priority === 'EMERGÊNCIA') return 'text-red-700 bg-red-50 border-red-200';
    if (priority === 'MÉDIA') return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-blue-700 bg-blue-50 border-blue-200';
  };

  const getStatusBadge = (item: any) => {
    if (item.type === 'DOC_REQ') {
        return <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200 uppercase tracking-wide"><AlertCircle size={12}/> Ação Requerida</span>;
    }
    if (item.status === 'EM_ANALISE') {
        return <span className="flex items-center gap-1.5 text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-1 rounded border border-blue-200 uppercase tracking-wide"><Clock size={12}/> Em Análise</span>;
    }
    if (item.status === 'AGENDADO') {
        return <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 uppercase tracking-wide"><CheckCircle size={12}/> Agendado</span>;
    }
    if (item.status === 'RECEBIDO' || item.status === 'IN_CARE') {
        return <span className="flex items-center gap-1.5 text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-1 rounded border border-purple-200 uppercase tracking-wide"><Activity size={12}/> Em Atendimento</span>;
    }
    if (item.status === 'FINALIZADO' || item.status === 'COMPLETED') {
        return <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200 uppercase tracking-wide"><CheckCircle size={12}/> Concluído</span>;
    }
    return <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200 uppercase tracking-wide">{item.status}</span>;
  };

  // --- ACTIONS HANDLERS ---

  const handleTrack = (item: any) => {
    openDrawer('CaseSummaryDrawer', { ...item, initialTab: 'RESUMO' });
  };

  const handleAttach = (item: any) => {
    if (item.type === 'DOC_REQ') {
      // Passa o ID da requisição para o Drawer saber o que resolver
      openDrawer('UploadDocumentDrawer', { requestId: item.id, type: item.title });
    } else {
      openDrawer('UploadDocumentDrawer', { requestId: item.id, type: 'Documento Complementar' });
    }
  };

  const handleMessageClick = (item: any) => {
    openDrawer('CaseSummaryDrawer', { ...item, initialTab: 'CHAT' });
  };

  // Counts for tabs
  const countPendencias = [...docRequests, ...casesFormatted].filter(i => i.isActionRequired).length;
  const countEncaminhamento = casesFormatted.filter(i => !i.isActionRequired && !i.isFinished).length;

  return (
    <div className="space-y-6 animate-fade-in-up pb-20 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-1">
             <Activity size={14}/> Minha Jornada de Saúde
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Meus Processos</h1>
          <p className="text-slate-500 text-sm mt-1">Acompanhe seus agendamentos, solicitações e comunique-se com a rede.</p>
        </div>

        <button 
             onClick={() => navigate('/patient/documents')}
             className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900 rounded-lg font-bold text-xs uppercase tracking-wide shadow-sm transition-all flex items-center gap-2 active:scale-95"
           >
             <Globe size={16} className="text-blue-600"/> 
             Meus Documentos
        </button>
      </div>

      {/* TABS DE NAVEGAÇÃO */}
      <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
         <button 
            onClick={() => setActiveTab('PENDENCIAS')}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'PENDENCIAS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
         >
            Pendências
            {countPendencias > 0 && <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{countPendencias}</span>}
         </button>
         <button 
            onClick={() => setActiveTab('ENCAMINHAMENTO')}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'ENCAMINHAMENTO' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
         >
            Encaminhamentos
            {countEncaminhamento > 0 && <span className="bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{countEncaminhamento}</span>}
         </button>
         <button 
            onClick={() => setActiveTab('CONCLUIDOS')}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'CONCLUIDOS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
         >
            Concluídos
         </button>
      </div>

      {/* ÁREA DE CONTROLE E TABELA */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
         
         {/* TOOLBAR BUSCA */}
         <div className="p-4 border-b border-slate-200 flex justify-end items-center bg-slate-50/50 rounded-t-xl">
            <div className="relative w-full md:w-80">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
               <input 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 placeholder="Filtrar processos..."
                 className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
               />
            </div>
         </div>

         {/* TABLA UNIFICADA */}
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-white border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                     <th className="px-6 py-4 w-[60px] text-center">Tipo</th>
                     <th className="px-6 py-4">Descrição / Especialidade</th>
                     <th className="px-6 py-4 text-center">Mensagens</th>
                     <th className="px-6 py-4">Status & Prioridade</th>
                     <th className="px-6 py-4">Unidade Responsável</th>
                     <th className="px-6 py-4 text-center">Data Ref.</th>
                     <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredList.map(item => (
                     <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                        
                        {/* TIPO */}
                        <td className="px-6 py-4 text-center align-middle">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto border ${item.type === 'DOC_REQ' ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                              {item.type === 'DOC_REQ' ? <UploadCloud size={14}/> : <GitPullRequest size={14}/>}
                           </div>
                        </td>

                        {/* DESCRIÇÃO */}
                        <td className="px-6 py-4 align-middle">
                           <div>
                              <p className="text-sm font-bold text-slate-900 mb-0.5">{item.title}</p>
                              <p className="text-[11px] text-slate-500 font-medium uppercase">{item.subtitle}</p>
                              <p className="font-mono text-[9px] text-slate-400 mt-1">ID: {item.id}</p>
                           </div>
                        </td>
                        
                        {/* MENSAJES (CLICKABLE) */}
                        <td className="px-6 py-4 align-middle text-center cursor-pointer" onClick={() => handleMessageClick(item)}>
                           {item.hasMessages ? (
                             <div className="inline-flex flex-col items-center justify-center gap-1 group-hover:scale-110 transition-transform">
                                <div className="relative">
                                   <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
                                   <div className="relative bg-red-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                                      <MessageSquare size={14} fill="currentColor" />
                                   </div>
                                </div>
                                <span className="text-[9px] font-bold text-red-600 uppercase">Nova Msg</span>
                             </div>
                           ) : (
                             <div className="opacity-20 flex justify-center hover:opacity-50 transition-opacity"><MessageSquare size={16}/></div>
                           )}
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-4 align-middle">
                           <div className="flex flex-col items-start gap-1.5">
                              {getStatusBadge(item)}
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getPriorityColor(item.priority)}`}>
                                 Prioridade {item.priority}
                              </span>
                           </div>
                        </td>

                        {/* UNIDADE */}
                        <td className="px-6 py-4 align-middle">
                           <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
                              <Building2 size={12} className="text-slate-400"/> {item.entity}
                           </div>
                        </td>

                        {/* DATA */}
                        <td className="px-6 py-4 align-middle text-center">
                           <p className={`font-mono font-bold ${item.type === 'DOC_REQ' ? 'text-amber-700' : 'text-slate-600'}`}>{item.date}</p>
                           {item.type === 'DOC_REQ' && <p className="text-[9px] font-bold text-red-500 uppercase mt-0.5">Vencimento</p>}
                        </td>

                        {/* BOTONES DE ACCIÓN (TRIPLE) */}
                        <td className="px-6 py-4 align-middle text-right">
                           <div className="flex flex-col gap-2 items-end">
                              {/* Botón Acompanhar (Siempre activo) */}
                              <button 
                                onClick={() => handleTrack(item)}
                                className="w-[140px] px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold text-[10px] uppercase tracking-wide hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2 shadow-sm"
                              >
                                 <Eye size={12}/> Acompanhar
                              </button>

                              {/* Botón Anexar (Condicional) */}
                              {item.requiresAttachment && (
                                <div className="flex gap-1 w-[140px]">
                                    <button 
                                        onClick={() => handleAttach(item)}
                                        className="flex-1 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wide transition-all flex items-center justify-center gap-1 shadow-sm border bg-blue-600 text-white border-blue-600 hover:bg-blue-700 cursor-pointer"
                                        title="Upload Local"
                                    >
                                        <FilePlus size={12}/> Anexar
                                    </button>
                                </div>
                              )}
                           </div>
                        </td>
                     </tr>
                  ))}
                  
                  {filteredList.length === 0 && (
                     <tr>
                        <td colSpan={7} className="py-16 text-center">
                           <div className="flex flex-col items-center gap-3">
                              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                 <List size={20}/>
                              </div>
                              <p className="text-slate-500 font-medium text-sm">Nenhum processo nesta fila.</p>
                           </div>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
