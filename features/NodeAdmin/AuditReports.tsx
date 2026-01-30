import React, { useState } from 'react';
import { FileSearch, Download, ShieldCheck, Calendar, Filter, FileText, CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const AuditReportsPage: React.FC = () => {
  const { openDrawer } = useAppStore();
  const [filter, setFilter] = useState({ role: 'ALL', outcome: 'ALL' });

  const auditLogs = [
    { id: 'LOG-001', date: '2024-10-25 14:30', user: 'Dr. Ricardo', role: 'NODE_ADMIN', patient: 'Maria Silva', type: 'CLINICAL', purpose: 'TREATMENT', outcome: 'APPROVED', policy: 'POL-01' },
    { id: 'LOG-002', date: '2024-10-25 15:15', user: 'Enf. Carla', role: 'UPA', patient: 'João Pedro', type: 'METADATA', purpose: 'REGULATION', outcome: 'APPROVED', policy: 'POL-02' },
    { id: 'LOG-003', date: '2024-10-24 09:00', user: 'Sistema Externo', role: 'EXTERNAL', patient: 'Ana Paula', type: 'RESTRICTED', purpose: 'RESEARCH', outcome: 'DENIED', policy: 'NO_CONSENT' },
    { id: 'LOG-004', date: '2024-10-24 11:20', user: 'Dr. Alberto', role: 'PROVIDER', patient: 'Carlos M.', type: 'CLINICAL', purpose: 'EMERGENCY', outcome: 'APPROVED', policy: 'POL-EMERGENCY' },
  ];

  return (
    <div className="space-y-10 animate-fade-in-up pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Relatórios de Auditoria</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Trilha de acessos e conformidade do nó institucional.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
             <Download size={16} /> Exportar CSV
           </button>
           <button className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2">
             <FileText size={16} /> Relatório PDF
           </button>
        </div>
      </div>

      {/* SEÇÃO 1: RESUMO DE CONFORMIDADE */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
         {[
           { label: 'Acessos Aprovados', val: '1,240', color: 'emerald', icon: <CheckCircle size={18}/> },
           { label: 'Acessos Negados', val: '15', color: 'red', icon: <XCircle size={18}/> },
           { label: 'Condicionados', val: '42', color: 'blue', icon: <ShieldCheck size={18}/> },
           { label: 'Sem Consentimento', val: '03', color: 'amber', icon: <AlertTriangle size={18}/> },
           { label: 'Fora de Política', val: '01', color: 'slate', icon: <FileSearch size={18}/> },
         ].map((m, i) => (
           <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-28">
              <div className={`flex justify-between items-start text-${m.color}-600`}>
                 {m.icon}
                 <span className={`text-[10px] font-black uppercase tracking-widest bg-${m.color}-50 px-2 py-0.5 rounded`}>{((parseInt(m.val.replace(',',''))/1301)*100).toFixed(1)}%</span>
              </div>
              <div>
                 <p className="text-2xl font-black text-slate-900">{m.val}</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</p>
              </div>
           </div>
         ))}
      </div>

      {/* SEÇÃO 2: TRILHA DE ACESSOS (TABELA) */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col min-h-[500px]">
         <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-6 justify-between items-center">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
               <FileSearch size={18} className="text-blue-600"/> Trilha de Auditoria
            </h3>
            
            <div className="flex gap-4 w-full md:w-auto">
               <div className="relative">
                  <select 
                    value={filter.role} 
                    onChange={e => setFilter({...filter, role: e.target.value})}
                    className="appearance-none bg-white border border-slate-200 pl-4 pr-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 shadow-sm"
                  >
                     <option value="ALL">Todos os Papéis</option>
                     <option value="NODE_ADMIN">Admin</option>
                     <option value="PROVIDER">Prestador</option>
                     <option value="UPA">UPA</option>
                  </select>
                  <Filter size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
               </div>
               <div className="relative">
                  <input type="date" className="bg-white border border-slate-200 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 shadow-sm text-slate-500" />
                  <Calendar size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
               </div>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <tr>
                     <th className="px-8 py-5">Data / Hora</th>
                     <th className="px-6 py-5">Usuário / Papel</th>
                     <th className="px-6 py-5">Paciente Alvo</th>
                     <th className="px-6 py-5">Tipo / Finalidade</th>
                     <th className="px-6 py-5">Decisão</th>
                     <th className="px-6 py-5">Política</th>
                     <th className="px-8 py-5 text-right">Auditar</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
                  {auditLogs.map((log) => (
                     <tr key={log.id} className="hover:bg-blue-50/20 transition-colors group cursor-pointer" onClick={() => openDrawer('GovernanceDecisionDrawer', { decision: { decision: log.outcome, justification: `Acesso auditado via ${log.policy}`, obligations: [] } })}>
                        <td className="px-8 py-5 text-slate-500 font-mono text-[10px]">{log.date}</td>
                        <td className="px-6 py-5">
                           <p>{log.user}</p>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{log.role}</p>
                        </td>
                        <td className="px-6 py-5">{log.patient}</td>
                        <td className="px-6 py-5">
                           <p>{log.type}</p>
                           <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{log.purpose}</p>
                        </td>
                        <td className="px-6 py-5">
                           <span className={`px-2 py-1 rounded text-[9px] uppercase tracking-widest ${log.outcome === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {log.outcome}
                           </span>
                        </td>
                        <td className="px-6 py-5 font-mono text-[10px] text-slate-500">{log.policy}</td>
                        <td className="px-8 py-5 text-right">
                           <button className="p-2 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-lg transition-all text-slate-400">
                              <Eye size={16}/>
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};