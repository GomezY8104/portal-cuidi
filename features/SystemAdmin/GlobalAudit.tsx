
import React, { useState } from 'react';
import { 
  Shield, Database, Search, Filter,
  Eye
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const GlobalAuditPage: React.FC = () => {
  const { openModal } = useAppStore();
  const [filter, setFilter] = useState({ node: '', role: '', outcome: '' });

  const events = [
    { id: 'EV-001', timestamp: '2024-10-26 14:30', node: 'SP-HOSP-CENTRAL', actor: 'Dr. Ricardo', role: 'NODE_ADMIN', patient: 'P-921', action: 'READ_CLINICAL', result: 'APPROVED', policy: 'POL-FED-01' },
    { id: 'EV-002', timestamp: '2024-10-26 14:28', node: 'RJ-UBS-NORTE', actor: 'Enf. Carla', role: 'APS', patient: 'P-104', action: 'WRITE_NOTE', result: 'APPROVED', policy: 'POL-FED-02' },
    { id: 'EV-003', timestamp: '2024-10-26 14:15', node: 'EXT-RESEARCH', actor: 'API User', role: 'EXTERNAL', patient: 'P-999', action: 'READ_SENSITIVE', result: 'DENIED', policy: 'NO_CONSENT' },
    { id: 'EV-004', timestamp: '2024-10-26 13:50', node: 'MG-LAB-EST', actor: 'System', role: 'SYSTEM', patient: 'N/A', action: 'SYNC_LEDGER', result: 'APPROVED', policy: 'SYS-INTERNAL' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up pb-20 font-sans text-slate-900">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b-2 border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-800 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
            <Shield size={14} /> Rastreabilidade Total
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Auditoria Global</h1>
        </div>
      </div>

      {/* FILTROS E BUSCA */}
      <div className="flex gap-4 p-4 bg-slate-100 border border-slate-300 items-end">
         <div className="flex-1 space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase">Busca Livre (Hash, ID, Ator)</label>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
               <input className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-sm text-xs font-bold outline-none uppercase" placeholder="BUSCAR..." />
            </div>
         </div>
         <div className="space-y-1 w-40">
            <label className="text-[9px] font-bold text-slate-500 uppercase">Nó Origem</label>
            <select className="w-full p-2 border border-slate-300 rounded-sm text-xs bg-white uppercase" value={filter.node} onChange={e => setFilter({...filter, node: e.target.value})}>
               <option value="">TODOS</option>
               <option>SP-HOSP-CENTRAL</option>
            </select>
         </div>
         <div className="space-y-1 w-40">
            <label className="text-[9px] font-bold text-slate-500 uppercase">Resultado</label>
            <select className="w-full p-2 border border-slate-300 rounded-sm text-xs bg-white uppercase" value={filter.outcome} onChange={e => setFilter({...filter, outcome: e.target.value})}>
               <option value="">TODOS</option>
               <option>APPROVED</option>
               <option>DENIED</option>
            </select>
         </div>
         <button onClick={() => setFilter({ node: '', role: '', outcome: '' })} className="px-6 py-2 bg-slate-200 text-slate-600 rounded-sm text-[10px] font-black uppercase hover:bg-slate-300 h-[34px]">
            Limpar
         </button>
      </div>

      {/* TABELA DE EVENTOS */}
      <div className="border border-slate-300 bg-white">
         <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-300">
               <tr>
                  <th className="px-6 py-3 border-r border-slate-200">Timestamp</th>
                  <th className="px-6 py-3 border-r border-slate-200">Organização</th>
                  <th className="px-6 py-3 border-r border-slate-200">Ator / Papel</th>
                  <th className="px-6 py-3 border-r border-slate-200">Ação</th>
                  <th className="px-6 py-3 border-r border-slate-200">Paciente (Ref)</th>
                  <th className="px-6 py-3 border-r border-slate-200 text-center">Resultado</th>
                  <th className="px-6 py-3 text-right">Trilha</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs font-medium text-slate-700">
               {events.map(ev => (
                  <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-3 border-r border-slate-200 font-mono text-slate-500">{ev.timestamp}</td>
                     <td className="px-6 py-3 border-r border-slate-200 uppercase font-bold">{ev.node}</td>
                     <td className="px-6 py-3 border-r border-slate-200">
                        <p className="font-bold text-slate-900">{ev.actor}</p>
                        <p className="text-[9px] uppercase text-slate-400">{ev.role}</p>
                     </td>
                     <td className="px-6 py-3 border-r border-slate-200 font-mono text-blue-700 uppercase">{ev.action}</td>
                     <td className="px-6 py-3 border-r border-slate-200 font-mono text-slate-500">{ev.patient}</td>
                     <td className="px-6 py-3 border-r border-slate-200 text-center">
                        <span className={`px-2 py-0.5 border rounded-sm text-[9px] font-black uppercase ${ev.result === 'APPROVED' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                           {ev.result}
                        </span>
                     </td>
                     <td className="px-6 py-3 text-right">
                        <button 
                           onClick={() => openModal('AuditTraceModal', ev)}
                           className="text-[10px] font-black text-blue-700 uppercase hover:underline flex items-center justify-end gap-1"
                        >
                           Ver Trilha <Eye size={12}/>
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};
