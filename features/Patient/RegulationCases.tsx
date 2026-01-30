import React, { useState, useMemo } from 'react';
import { 
  GitPullRequest, MessageSquare, Clock, CheckCircle, 
  AlertCircle, Activity, Building2, 
  UploadCloud, Search, Globe, Database, ArrowUpRight,
  MessageCircle, Mail, FilePlus, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_DOC_REQUESTS, MOCK_PROVIDER_CASES } from '../../mocks/seed';

export const RegulationCasesPage: React.FC = () => {
  const { openDrawer, user } = useAppStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, CASE, DOC_REQ

  // --- OBTENER CASOS DEL MOCK CENTRALIZADO ---
  const myCases = useMemo(() => {
      // Para efectos de DEMO, si soy admin muestro todo, si soy paciente muestro los mios (simulado)
      if (user?.role === 'PATIENT') {
          return MOCK_PROVIDER_CASES.filter(c => c.patientName.toUpperCase() === user.name.toUpperCase() || c.patientId === user.id);
      }
      return MOCK_PROVIDER_CASES.filter(c => c.patientId === 'p1'); // Fallback visual
  }, [user]);

  // Transformar datos del Mock al formato de la vista
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
    // Lógica para saber si requiere anexo (ejemplo: status specificos o flag manual)
    requiresAttachment: c.status === 'PENDING_DOCS' || c.status === 'EM_ANALISE', 
    timeline: [], 
    messages: c.messages || [],
    hasMessages: c.hasMessages,
    appointment: c.appointment 
  }));

  // --- MOCK DATA: DOCUMENTOS ---
  const docRequests = MOCK_DOC_REQUESTS.map(req => ({
    id: req.id,
    type: 'DOC_REQ',
    title: req.documentType,
    subtitle: req.description,
    date: req.dueDate,
    status: 'PENDING',
    statusLabel: 'Documento Pendente',
    entity: req.requester,
    priority: req.priority,
    requiresAttachment: true, // Solicitudes de documentos siempre requieren anexo
    originalData: req,
    timeline: [],
    messages: [],
    hasMessages: true 
  }));

  // --- MERGE & FILTER ---
  const unifiedList = useMemo(() => {
    const combined = [...docRequests, ...casesFormatted];
    
    return combined.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.entity.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'ALL' || item.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, filterType, casesFormatted]);

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
    if (item.status === 'RECEBIDO') {
        return <span className="flex items-center gap-1.5 text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-1 rounded border border-purple-200 uppercase tracking-wide"><Activity size={12}/> Em Atendimento</span>;
    }
    return <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200 uppercase tracking-wide">{item.status}</span>;
  };

  // --- ACTIONS HANDLERS ---

  const handleTrack = (item: any) => {
    // Abre Drawer na aba padrão (Resumo)
    openDrawer('CaseSummaryDrawer', { ...item, initialTab: 'RESUMO' });
  };

  const handleAttach = (item: any) => {
    if (item.type === 'DOC_REQ') {
      openDrawer('UploadDocumentDrawer', { requestId: item.id, type: item.title });
    } else {
      // Se for um caso geral pedindo anexo, abre drawer de upload genérico vinculado ao caso
      openDrawer('UploadDocumentDrawer', { requestId: item.id, type: 'Documento Complementar' });
    }
  };

  const handleMessageClick = (item: any) => {
    // Abre Drawer diretamente na aba de CHAT
    openDrawer('CaseSummaryDrawer', { ...item, initialTab: 'CHAT' });
  };

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
             onClick={() => navigate('/patient/search')}
             className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900 rounded-lg font-bold text-xs uppercase tracking-wide shadow-sm transition-all flex items-center gap-2 active:scale-95"
           >
             <Globe size={16} className="text-blue-600"/> 
             Busca Federada
        </button>
      </div>

      {/* ÁREA DE CONTROLE E TABELA */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
         
         {/* TOOLBAR */}
         <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50 rounded-t-xl">
            <div className="flex items-center gap-2">
               <button 
                 onClick={() => setFilterType('ALL')}
                 className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterType === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
               >
                 Todos
               </button>
               <button 
                 onClick={() => setFilterType('CASE')}
                 className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterType === 'CASE' ? 'bg-white border border-slate-300 text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
               >
                 Encaminhamentos
               </button>
               <button 
                 onClick={() => setFilterType('DOC_REQ')}
                 className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterType === 'DOC_REQ' ? 'bg-white border border-amber-300 text-amber-700 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
               >
                 Pendências
               </button>
            </div>

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
                  {unifiedList.map(item => (
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

                        {/* BOTONES DE ACCIÓN (DOBLE) */}
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
                              <button 
                                onClick={() => handleAttach(item)}
                                disabled={!item.requiresAttachment}
                                className={`w-[140px] px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm border ${
                                   item.requiresAttachment 
                                   ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 cursor-pointer' 
                                   : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                                }`}
                              >
                                 <FilePlus size={12}/> Anexar Doc.
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
                  
                  {unifiedList.length === 0 && (
                     <tr>
                        <td colSpan={7} className="py-16 text-center">
                           <div className="flex flex-col items-center gap-3">
                              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                 <Search size={20}/>
                              </div>
                              <p className="text-slate-500 font-medium text-sm">Nenhum processo encontrado.</p>
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