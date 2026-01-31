
import React, { useState, useMemo } from 'react';
import { 
  Activity, Search, Filter, MessageSquare, 
  Clock, AlertCircle, CheckCircle, ArrowRight,
  SlidersHorizontal, Inbox, List, Send, XCircle, Siren,
  FileText, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const RegulationQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const { openDrawer } = useAppStore();
  
  // Estado das Abas (4 Estágios)
  const [activeTab, setActiveTab] = useState<'INBOX' | 'ANALYSIS' | 'SENT' | 'REJECTED'>('INBOX');

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterSpecialty, setFilterSpecialty] = useState('ALL');

  // Mock Data Expandido
  const queueData = [
    // 1. SOLICITAÇÕES (Novos pedidos recebidos - Status PENDENTE)
    { 
      id: 'REG-2024-891', patient: 'MARIA APARECIDA DA SILVA', origin: 'UBS JARDIM SUL', specialty: 'CARDIOLOGIA', 
      priority: 'ALTA', timeInQueue: '04:12:00', sla: 'CRÍTICO', status: 'PENDENTE', lastUpdate: 'Há 10 min'
    },
    { 
      id: 'REG-2024-115', patient: 'CARLOS EDUARDO', origin: 'HOSPITAL MUNICIPAL', specialty: 'ONCOLOGIA', 
      priority: 'ALTA', timeInQueue: '01:20:00', sla: 'NORMAL', status: 'PENDENTE', lastUpdate: 'Há 5 min'
    },
    { 
      id: 'REG-2024-332', patient: 'LUCAS MENDES', origin: 'UPA ZONA LESTE', specialty: 'CIRURGIA GERAL', 
      priority: 'MÉDIA', timeInQueue: '00:45:00', sla: 'NORMAL', status: 'PENDENTE', lastUpdate: 'Há 20 min'
    },

    // 2. EM ANÁLISE (Pendentes de decisão/docs - Status EM_ANALISE)
    { 
      id: 'REG-2024-702', patient: 'JOÃO CARLOS PEREIRA', origin: 'UPA ZONA NORTE', specialty: 'ORTOPEDIA', 
      priority: 'MÉDIA', timeInQueue: '22:05:00', sla: 'ATENÇÃO', status: 'EM_ANALISE', lastUpdate: 'Há 1 hora',
      pendingReason: 'Aguardando Raio-X'
    },
    { 
      id: 'REG-2024-551', patient: 'JULIANA PAES', origin: 'UBS CENTRO', specialty: 'GINECOLOGIA', 
      priority: 'BAIXA', timeInQueue: '03:00:00', sla: 'NORMAL', status: 'EM_ANALISE', lastUpdate: 'Há 30 min',
      pendingReason: 'Em avaliação médica'
    },

    // 3. ENVIADOS / PRESTADOR (Aprovados ou Vaga Zero - Status APROVADO, VAGA_ZERO)
    { 
      id: 'REG-2024-999', patient: 'ROBERTO ALVES', origin: 'UPA CENTRO', specialty: 'TRAUMA', 
      priority: 'EMERGÊNCIA', timeInQueue: '00:15:00', sla: 'CRÍTICO', status: 'VAGA_ZERO', lastUpdate: 'Há 30 min', 
      destination: 'HOSPITAL GERAL (VAGA ZERO)'
    },
    { 
      id: 'REG-2024-888', patient: 'TEREZA CRISTINA', origin: 'UBS VILA NOVA', specialty: 'DERMATOLOGIA', 
      priority: 'BAIXA', timeInQueue: '12:00:00', sla: 'OK', status: 'APROVADO', lastUpdate: 'Ontem', 
      destination: 'AMBULATÓRIO DE ESPECIALIDADES'
    },

    // 4. RECUSADOS (Negados ou Devolvidos - Status RECUSADO, DEVOLVIDO)
    { 
      id: 'REG-2024-204', patient: 'ANA JULIA FONTES', origin: 'UBS CENTRO', specialty: 'NEUROLOGIA', 
      priority: 'BAIXA', timeInQueue: '48:30:00', sla: 'EXPIRADO', status: 'DEVOLVIDO', lastUpdate: 'Ontem', 
      reason: 'Falta Exames Complementares'
    },
    { 
      id: 'REG-2024-001', patient: 'FERNANDA LIMA', origin: 'APS LESTE', specialty: 'ESTÉTICA', 
      priority: 'BAIXA', timeInQueue: '72:00:00', sla: 'OK', status: 'RECUSADO', lastUpdate: 'Há 2 dias', 
      reason: 'Fora do escopo SUS'
    },
  ];

  const filteredQueue = useMemo(() => {
    return queueData.filter(item => {
      // Lógica de Abas
      let matchTab = false;
      if (activeTab === 'INBOX') matchTab = item.status === 'PENDENTE'; // Solicitudes (Novos)
      if (activeTab === 'ANALYSIS') matchTab = item.status === 'EM_ANALISE'; // Pendientes (Em tratativa)
      if (activeTab === 'SENT') matchTab = item.status === 'APROVADO' || item.status === 'AGENDADO' || item.status === 'VAGA_ZERO'; // Enviados
      if (activeTab === 'REJECTED') matchTab = item.status === 'RECUSADO' || item.status === 'DEVOLVIDO'; // Recusados

      const matchSearch = item.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPriority = filterPriority === 'ALL' || item.priority === filterPriority;
      const matchSpec = filterSpecialty === 'ALL' || item.specialty === filterSpecialty;
      
      return matchTab && matchSearch && matchPriority && matchSpec;
    });
  }, [searchTerm, filterPriority, filterSpecialty, activeTab]);

  const getSlaStyle = (sla: string) => {
    switch (sla) {
      case 'CRÍTICO': return 'text-red-600 font-black animate-pulse';
      case 'ATENÇÃO': return 'text-amber-600 font-bold';
      default: return 'text-emerald-600 font-medium';
    }
  };

  const handleOpenChat = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    openDrawer('CaseSummaryDrawer', { ...item, initialTab: 'CHAT' });
  };

  // Contadores para badges
  const countInbox = queueData.filter(i => i.status === 'PENDENTE').length;
  const countAnalysis = queueData.filter(i => i.status === 'EM_ANALISE').length;

  return (
    <div className="space-y-6 animate-fade-in-up pb-20 font-sans text-slate-900">
      
      {/* HEADER TÉCNICO */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b-2 border-slate-800 pb-6 gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-800 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
            <Activity size={14} /> Central de Regulação
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Fila de Regulação</h1>
        </div>
        <div className="flex gap-2">
           <div className="bg-white border border-slate-300 px-4 py-2 rounded-sm text-xs font-bold uppercase shadow-sm">
              SLA Médio: <span className="text-emerald-600">02:15h</span>
           </div>
           <div className="bg-slate-900 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase shadow-sm flex items-center gap-2">
              <Inbox size={14}/> Novos: {countInbox}
           </div>
        </div>
      </div>

      {/* ABAS DE NAVEGAÇÃO (4 STATUS) */}
      <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 w-fit">
         <button 
            onClick={() => setActiveTab('INBOX')}
            className={`px-5 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'INBOX' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
         >
            <Inbox size={14}/> Solicitações {countInbox > 0 && <span className="bg-blue-600 text-white px-1.5 rounded-full text-[8px]">{countInbox}</span>}
         </button>
         <button 
            onClick={() => setActiveTab('ANALYSIS')}
            className={`px-5 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'ANALYSIS' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
         >
            <Loader2 size={14} className={activeTab === 'ANALYSIS' ? 'animate-spin' : ''}/> Em Análise
         </button>
         <button 
            onClick={() => setActiveTab('SENT')}
            className={`px-5 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'SENT' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
         >
            <Send size={14}/> Enviados / Prestador
         </button>
         <button 
            onClick={() => setActiveTab('REJECTED')}
            className={`px-5 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'REJECTED' ? 'bg-white text-red-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
         >
            <XCircle size={14}/> Recusados
         </button>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="bg-slate-100 p-4 border border-slate-300 flex flex-wrap gap-4 items-end rounded-sm">
         <div className="flex-1 min-w-[250px] space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Busca Rápida</label>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
               <input 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 text-xs font-bold uppercase outline-none focus:border-blue-800 rounded-sm"
                 placeholder="NOME, PROTOCOLO OU ORIGEM..."
               />
            </div>
         </div>
         
         <div className="w-40 space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Prioridade</label>
            <select 
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 text-xs font-bold uppercase outline-none rounded-sm"
            >
               <option value="ALL">Todas</option>
               <option value="ALTA">Alta</option>
               <option value="MÉDIA">Média</option>
               <option value="BAIXA">Baixa</option>
               <option value="EMERGÊNCIA">Emergência</option>
            </select>
         </div>

         <div className="w-48 space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Especialidade</label>
            <select 
              value={filterSpecialty}
              onChange={e => setFilterSpecialty(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 text-xs font-bold uppercase outline-none rounded-sm"
            >
               <option value="ALL">Todas</option>
               <option value="CARDIOLOGIA">Cardiologia</option>
               <option value="NEUROLOGIA">Neurologia</option>
               <option value="ONCOLOGIA">Oncologia</option>
               <option value="ORTOPEDIA">Ortopedia</option>
               <option value="TRAUMA">Trauma</option>
               <option value="GINECOLOGIA">Ginecologia</option>
               <option value="DERMATOLOGIA">Dermatologia</option>
            </select>
         </div>

         <button className="px-4 py-2 bg-white border border-slate-300 text-slate-600 text-[10px] font-black uppercase hover:bg-slate-50 h-[34px] rounded-sm flex items-center gap-2">
            <SlidersHorizontal size={12}/> Mais Filtros
         </button>
      </div>

      {/* TABELA DE REGULAÇÃO */}
      <div className="bg-white border border-slate-300 shadow-sm rounded-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-300 text-[9px] font-black text-slate-500 uppercase tracking-widest">
               <tr>
                  <th className="px-4 py-3 w-32">Protocolo</th>
                  <th className="px-4 py-3">Paciente</th>
                  <th className="px-4 py-3">Origem</th>
                  <th className="px-4 py-3">Especialidade</th>
                  <th className="px-4 py-3 text-center">Prioridade</th>
                  
                  {activeTab === 'INBOX' && <th className="px-4 py-3 text-center">Tempo Fila</th>}
                  {activeTab === 'INBOX' && <th className="px-4 py-3 text-center">SLA</th>}
                  
                  {activeTab === 'ANALYSIS' && <th className="px-4 py-3 text-center">Motivo Pendência</th>}

                  {activeTab === 'SENT' && <th className="px-4 py-3">Destino / Prestador</th>}
                  
                  {activeTab === 'REJECTED' && <th className="px-4 py-3">Motivo Devolução</th>}

                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Comunicação</th>
                  <th className="px-4 py-3 text-right">Ação</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
               {filteredQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer" onClick={() => navigate(`/regulator/case/${item.id}`)}>
                     <td className="px-4 py-3 font-mono text-blue-700 font-bold">{item.id}</td>
                     <td className="px-4 py-3 font-bold text-slate-900">{item.patient}</td>
                     <td className="px-4 py-3 text-[10px] font-bold text-slate-500">{item.origin}</td>
                     <td className="px-4 py-3">{item.specialty}</td>
                     <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-sm border text-[9px] font-black uppercase ${
                           item.priority === 'ALTA' ? 'bg-red-50 text-red-700 border-red-200' :
                           item.priority === 'EMERGÊNCIA' ? 'bg-red-600 text-white border-red-700 animate-pulse' :
                           item.priority === 'MÉDIA' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                           'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                           {item.priority}
                        </span>
                     </td>

                     {activeTab === 'INBOX' && (
                        <>
                           <td className="px-4 py-3 text-center font-mono">{item.timeInQueue}</td>
                           <td className={`px-4 py-3 text-center text-[10px] uppercase ${getSlaStyle(item.sla)}`}>{item.sla}</td>
                        </>
                     )}

                     {activeTab === 'ANALYSIS' && (
                        <td className="px-4 py-3 text-center text-[10px] text-amber-600 font-bold uppercase">
                           {item.pendingReason || 'EM AVALIAÇÃO'}
                        </td>
                     )}

                     {activeTab === 'SENT' && (
                        <td className="px-4 py-3 text-[10px] font-bold text-slate-900 uppercase">
                           {item.destination || '-'}
                        </td>
                     )}

                     {activeTab === 'REJECTED' && (
                        <td className="px-4 py-3 text-[10px] text-red-700 uppercase">
                           {item.reason || '-'}
                        </td>
                     )}

                     <td className="px-4 py-3 text-center">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase ${
                           item.status === 'VAGA_ZERO' ? 'bg-red-600 text-white border-red-700 flex items-center justify-center gap-1' :
                           item.status === 'APROVADO' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                           item.status === 'EM_ANALISE' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                           item.status === 'DEVOLVIDO' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                           item.status === 'RECUSADO' ? 'bg-red-50 text-red-800 border-red-200' :
                           'bg-slate-100 border-slate-200'
                        }`}>
                           {item.status === 'VAGA_ZERO' && <Siren size={10}/>}
                           {item.status.replace('_', ' ')}
                        </span>
                     </td>
                     <td className="px-4 py-3 text-center">
                        <button 
                           onClick={(e) => handleOpenChat(e, item)}
                           className="p-1.5 hover:bg-blue-100 text-slate-400 hover:text-blue-600 rounded transition-colors"
                           title="Chat com Solicitante"
                        >
                           <MessageSquare size={16}/>
                        </button>
                     </td>
                     <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                           <button onClick={() => navigate(`/regulator/case/${item.id}`)} className="p-1.5 bg-slate-900 text-white hover:bg-blue-700 rounded transition-all shadow-sm">
                              <ArrowRight size={14}/>
                           </button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
         {filteredQueue.length === 0 && (
            <div className="p-16 text-center">
               <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Nenhum caso encontrado nesta aba.</p>
               <p className="text-[10px] text-slate-300 mt-1">Verifique os filtros ou mude de aba.</p>
            </div>
         )}
      </div>
    </div>
  );
};
