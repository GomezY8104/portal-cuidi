
import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Filter, ChevronRight, AlertCircle, 
  FileText, ArrowUpRight, Calendar, Download, MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore'; // Importando store
import { downloadCSV } from '../../utils/downloadUtils';

export const WorkTrayPage: React.FC = () => {
  const navigate = useNavigate();
  const { apsQueue, openDrawer } = useAppStore(); // Consumindo a fila APS global
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');

  // Utilizando apsQueue do store em vez de dados locais
  const cases = apsQueue;

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'PENDENTE': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'EM_REGULACAO': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DEVOLVIDO': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'QUALIFICADO': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'FINALIZADO': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  const getPriorityStyle = (p: string) => {
    if (p === 'ALTA' || p === 'EMERGÊNCIA') return 'text-red-700 font-bold';
    if (p === 'MÉDIA' || p === 'URGENTE') return 'text-amber-700 font-medium';
    return 'text-blue-700';
  };

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchSearch = c.patient.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === 'ALL' || c.status === filterStatus;
      const matchPriority = filterPriority === 'ALL' || c.priority === filterPriority;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [cases, searchTerm, filterStatus, filterPriority]);

  const handleExport = () => {
      downloadCSV('Fila_APS_Export.csv', filteredCases);
  };

  const handleOpenChat = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    // Simulando mensagens se não existirem
    const chatData = {
        ...item,
        messages: item.hasMessage ? [{ sender: 'REGULADOR', text: 'Por favor, anexe o exame de imagem complementar.', time: '10:30' }] : [],
        initialTab: 'CHAT'
    };
    openDrawer('CaseSummaryDrawer', chatData);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans text-slate-900">
      
      {/* HEADER & ACTIONS */}
      <div className="flex justify-between items-center bg-white p-4 rounded-sm border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-lg font-black text-slate-800 uppercase tracking-tight">Gestão de Encaminhamentos</h1>
          <p className="text-xs text-slate-500 font-medium">Unidade: UBS JARDIM DAS FLORES (CNES 1234567)</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={handleExport}
             className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-sm text-xs font-bold uppercase hover:bg-slate-50 flex items-center gap-2 transition-all"
           >
             <Download size={14}/> Exportar Lista
           </button>
           <button 
             onClick={() => navigate('/aps/new-case')}
             className="px-4 py-2 bg-blue-700 text-white rounded-sm text-xs font-bold uppercase hover:bg-blue-800 flex items-center gap-2 shadow-sm transition-all active:scale-95"
           >
             <Plus size={16}/> Novo Encaminhamento
           </button>
        </div>
      </div>

      {/* FILTERS BAR */}
      <div className="bg-slate-100 p-3 rounded-sm border border-slate-200 flex flex-wrap gap-4 items-center">
         <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-500"/>
            <span className="text-[10px] font-bold uppercase text-slate-500">Filtros:</span>
         </div>
         
         <div className="relative">
            <select 
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="pl-2 pr-8 py-1.5 bg-white border border-slate-300 rounded-sm text-xs font-medium text-slate-700 outline-none focus:border-blue-500 uppercase"
            >
               <option value="ALL">Todos os Status</option>
               <option value="PENDENTE">Pendente</option>
               <option value="DEVOLVIDO">Devolvido (Ação Req.)</option>
               <option value="EM_REGULACAO">Em Regulação</option>
               <option value="FINALIZADO">Finalizado</option>
            </select>
         </div>

         <div className="relative">
            <select 
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="pl-2 pr-8 py-1.5 bg-white border border-slate-300 rounded-sm text-xs font-medium text-slate-700 outline-none focus:border-blue-500 uppercase"
            >
               <option value="ALL">Todas Prioridades</option>
               <option value="ALTA">Alta</option>
               <option value="MÉDIA">Média</option>
               <option value="BAIXA">Baixa</option>
            </select>
         </div>

         <div className="flex-1 max-w-md relative ml-auto">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
            <input 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               placeholder="BUSCAR POR NOME DO PACIENTE, CNS OU Nº PROTOCOLO..."
               className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-sm text-xs font-bold outline-none focus:border-blue-500 uppercase placeholder:normal-case placeholder:font-normal"
            />
         </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-slate-300 rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300">
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-32">Protocolo</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Paciente</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Especialidade</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center w-24">Prioridade</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-32">Criação</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center w-32">Estado</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center w-24">Chat</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right w-24">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredCases.map((c) => (
              <tr key={c.id} className="hover:bg-blue-50/50 transition-colors group">
                <td className="px-4 py-2 border-r border-slate-100">
                   <span className="font-mono text-xs font-bold text-blue-700">{c.id}</span>
                </td>
                <td className="px-4 py-2 border-r border-slate-100">
                   <p className="text-xs font-bold text-slate-900 uppercase truncate max-w-[250px]">{c.patient}</p>
                </td>
                <td className="px-4 py-2 border-r border-slate-100">
                   <p className="text-xs font-medium text-slate-700 uppercase">{c.spec}</p>
                </td>
                <td className="px-4 py-2 border-r border-slate-100 text-center">
                   <span className={`text-[10px] uppercase ${getPriorityStyle(c.priority)}`}>{c.priority}</span>
                </td>
                <td className="px-4 py-2 border-r border-slate-100">
                   <span className="text-xs text-slate-600 font-mono">{c.date}</span>
                </td>
                <td className="px-4 py-2 border-r border-slate-100 text-center">
                   <span className={`inline-block px-2 py-0.5 rounded-sm border text-[9px] font-black uppercase tracking-wide ${getStatusStyle(c.status)}`}>
                      {c.status.replace('_', ' ')}
                   </span>
                </td>
                
                {/* COLUNA DE MENSAGEM */}
                <td className="px-4 py-2 border-r border-slate-100 text-center">
                   <button 
                     onClick={(e) => handleOpenChat(e, c)}
                     className="relative p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                     title="Falar com Regulador"
                   >
                      <MessageSquare size={16}/>
                      {/* NOTIFICAÇÃO DE MENSAGEM */}
                      {c.hasMessage && (
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                      )}
                   </button>
                </td>

                <td className="px-4 py-2 text-right">
                   <button 
                     onClick={() => navigate(`/aps/case/${c.id}`)}
                     className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-100 rounded transition-all"
                     title="Abrir Protocolo"
                   >
                      <ArrowUpRight size={16}/>
                   </button>
                </td>
              </tr>
            ))}
            {filteredCases.length === 0 && (
                <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400 italic text-xs uppercase font-bold">
                        Nenhum encaminhamento encontrado.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
