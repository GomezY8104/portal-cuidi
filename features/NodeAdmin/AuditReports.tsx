
import React, { useState } from 'react';
import { 
  FileSearch, Download, ShieldCheck, Calendar, Filter, 
  FileText, CheckCircle, XCircle, AlertTriangle, Eye, User, Layers
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { downloadCSV, downloadPDF } from '../../utils/downloadUtils';

export const AuditReportsPage: React.FC = () => {
  const { openDrawer } = useAppStore();
  const [loadingExport, setLoadingExport] = useState(false);
  
  // Filtros Avançados
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    user: '',
    segment: 'ALL',
    dataType: 'ALL',
    result: 'ALL'
  });

  const auditLogs = [
    { id: 'LOG-001', date: '2024-10-25 14:30', user: 'Dr. Ricardo', role: 'NODE_ADMIN', patient: 'Maria Silva', action: 'READ_CLINICAL', type: 'CLINICAL', segment: 'LOCAL', purpose: 'TREATMENT', outcome: 'APPROVED', policy: 'POL-01' },
    { id: 'LOG-002', date: '2024-10-25 15:15', user: 'Enf. Carla', role: 'UPA', patient: 'João Pedro', action: 'UPDATE_METADATA', type: 'METADATA', segment: 'UPA', purpose: 'REGULATION', outcome: 'APPROVED', policy: 'POL-02' },
    { id: 'LOG-003', date: '2024-10-24 09:00', user: 'Sistema Externo', role: 'EXTERNAL', patient: 'Ana Paula', action: 'READ_SENSITIVE', type: 'RESTRICTED', segment: 'RESEARCH', purpose: 'RESEARCH', outcome: 'DENIED', policy: 'NO_CONSENT' },
    { id: 'LOG-004', date: '2024-10-24 11:20', user: 'Dr. Alberto', role: 'PROVIDER', patient: 'Carlos M.', action: 'READ_HISTORY', type: 'CLINICAL', segment: 'HOSPITAL', purpose: 'EMERGENCY', outcome: 'APPROVED', policy: 'POL-EMERGENCY' },
  ];

  const handleExport = (format: string) => {
      setLoadingExport(true);
      setTimeout(() => {
          if (format === 'CSV') {
              downloadCSV('Auditoria_Log_Export.csv', auditLogs);
          } else {
              // Geração de PDF binário real
              const summary = auditLogs.map(l => `- [${l.date}] ${l.user} (${l.role}) -> ${l.action} -> ${l.outcome}`).join('\n');
              downloadPDF(
                  'Auditoria_Relatorio.pdf',
                  'RELATÓRIO DE AUDITORIA E COMPLIANCE',
                  { Total_Registros: auditLogs.length, Filtros: JSON.stringify(filters) },
                  summary
              );
          }
          setLoadingExport(false);
      }, 1000);
  };

  const handleApplyFilters = () => {
      alert('Filtros aplicados. Lista atualizada.');
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-20 font-sans">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <FileSearch size={16} className="text-slate-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Compliance & Segurança</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Relatórios de Auditoria</h1>
          <p className="text-slate-500 text-xs font-medium mt-1">
            Registro completo e imutável de todas as transações do nó.
          </p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => handleExport('CSV')}
             disabled={loadingExport}
             className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-slate-50 flex items-center gap-2 shadow-sm disabled:opacity-50"
           >
             <FileText size={14} /> Exportar CSV
           </button>
           <button 
             onClick={() => handleExport('PDF')}
             disabled={loadingExport}
             className="px-4 py-2 bg-slate-900 text-white rounded-md font-bold text-xs uppercase tracking-widest hover:bg-slate-800 flex items-center gap-2 shadow-sm disabled:opacity-50"
           >
             <Download size={14} /> Exportar PDF
           </button>
        </div>
      </div>

      {/* SEÇÃO 1: FILTROS AVANÇADOS */}
      <section className="bg-white border border-slate-200 rounded-md p-5 shadow-sm space-y-4">
         <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-2">
            <Filter size={12}/> Filtros Avançados
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-1">
               <label className="text-[9px] font-bold text-slate-400 uppercase">Data Início</label>
               <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} className="w-full p-2 border border-slate-200 rounded-sm text-xs outline-none focus:border-blue-500"/>
            </div>
            <div className="space-y-1">
               <label className="text-[9px] font-bold text-slate-400 uppercase">Usuário / ID</label>
               <input type="text" placeholder="Nome ou ID..." value={filters.user} onChange={e => setFilters({...filters, user: e.target.value})} className="w-full p-2 border border-slate-200 rounded-sm text-xs outline-none focus:border-blue-500"/>
            </div>
            <div className="space-y-1">
               <label className="text-[9px] font-bold text-slate-400 uppercase">Segmento</label>
               <select value={filters.segment} onChange={e => setFilters({...filters, segment: e.target.value})} className="w-full p-2 border border-slate-200 rounded-sm text-xs outline-none focus:border-blue-500 bg-white">
                  <option value="ALL">Todos</option>
                  <option value="APS">APS</option>
                  <option value="UPA">UPA</option>
                  <option value="HOSPITAL">Hospital</option>
               </select>
            </div>
            <div className="space-y-1">
               <label className="text-[9px] font-bold text-slate-400 uppercase">Tipo de Dado</label>
               <select value={filters.dataType} onChange={e => setFilters({...filters, dataType: e.target.value})} className="w-full p-2 border border-slate-200 rounded-sm text-xs outline-none focus:border-blue-500 bg-white">
                  <option value="ALL">Todos</option>
                  <option value="CLINICAL">Clínico</option>
                  <option value="METADATA">Metadados</option>
                  <option value="RESTRICTED">Restrito</option>
               </select>
            </div>
            <div className="space-y-1">
               <label className="text-[9px] font-bold text-slate-400 uppercase">Resultado</label>
               <select value={filters.result} onChange={e => setFilters({...filters, result: e.target.value})} className="w-full p-2 border border-slate-200 rounded-sm text-xs outline-none focus:border-blue-500 bg-white">
                  <option value="ALL">Todos</option>
                  <option value="APPROVED">Aprovado</option>
                  <option value="DENIED">Negado</option>
               </select>
            </div>
         </div>
         <div className="flex justify-end">
            <button 
                onClick={handleApplyFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-sm font-bold text-[10px] uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all"
            >
                Aplicar Filtros
            </button>
         </div>
      </section>

      {/* SEÇÃO 2: TABELA DE EVENTOS */}
      <section className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                     <th className="px-6 py-3">Data / Hora</th>
                     <th className="px-6 py-3">Usuário / Papel</th>
                     <th className="px-6 py-3">Paciente</th>
                     <th className="px-6 py-3">Ação</th>
                     <th className="px-6 py-3">Política Aplicada</th>
                     <th className="px-6 py-3 text-center">Resultado</th>
                     <th className="px-6 py-3 text-right">Detalhe</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {auditLogs.map((log) => (
                     <tr key={log.id} className="hover:bg-blue-50/20 transition-colors group">
                        <td className="px-6 py-3 font-mono text-slate-500">{log.date}</td>
                        <td className="px-6 py-3">
                           <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{log.user}</span>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{log.role}</span>
                           </div>
                        </td>
                        <td className="px-6 py-3">{log.patient}</td>
                        <td className="px-6 py-3">
                           <div className="flex flex-col">
                              <span className="font-bold text-blue-600 uppercase">{log.action || log.type}</span>
                              <span className="text-[9px] text-slate-500 uppercase">{log.purpose}</span>
                           </div>
                        </td>
                        <td className="px-6 py-3 font-mono text-[10px]">{log.policy}</td>
                        <td className="px-6 py-3 text-center">
                           <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${log.outcome === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              {log.outcome}
                           </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                           <button 
                              onClick={() => openDrawer('GovernanceDecisionDrawer', { decision: { decision: log.outcome, justification: `Audit Log: ${log.id}`, obligations: [] } })}
                              className="text-slate-400 hover:text-slate-900 transition-colors"
                           >
                              <Eye size={16}/>
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {auditLogs.length === 0 && (
            <div className="p-10 text-center text-slate-400 font-bold text-xs uppercase">Nenhum evento encontrado com os filtros atuais.</div>
         )}
      </section>
    </div>
  );
};
