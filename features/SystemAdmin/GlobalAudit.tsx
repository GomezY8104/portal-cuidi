import React, { useState } from 'react';
import { 
  Shield, Database, Search, Filter, Calendar,
  FileText, CheckCircle2, AlertCircle, Eye, X
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const GlobalAuditPage: React.FC = () => {
  const { openDrawer } = useAppStore();
  const [filter, setFilter] = useState({ node: '', role: '', outcome: '' });

  // MOCK DATA
  const events = [
    { id: 'EV-001', timestamp: '2024-10-26 14:30', node: 'SP-HOSP-CENTRAL', actor: 'Dr. Ricardo', role: 'NODE_ADMIN', patient: 'P-921', action: 'READ_CLINICAL', result: 'APPROVED', policy: 'POL-FED-01' },
    { id: 'EV-002', timestamp: '2024-10-26 14:28', node: 'RJ-UBS-NORTE', actor: 'Enf. Carla', role: 'APS', patient: 'P-104', action: 'WRITE_NOTE', result: 'APPROVED', policy: 'POL-FED-02' },
    { id: 'EV-003', timestamp: '2024-10-26 14:15', node: 'EXT-RESEARCH', actor: 'API User', role: 'EXTERNAL', patient: 'P-999', action: 'READ_SENSITIVE', result: 'DENIED', policy: 'NO_CONSENT' },
    { id: 'EV-004', timestamp: '2024-10-26 13:50', node: 'MG-LAB-EST', actor: 'System', role: 'SYSTEM', patient: 'N/A', action: 'SYNC_LEDGER', result: 'APPROVED', policy: 'SYS-INTERNAL' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden animate-fade-in-up">
      <div className="flex-shrink-0 flex justify-between items-end mb-6 px-1">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-2">
            <Shield size={14} /> Trazabilidad Completa
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Auditoría Global</h1>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
         {/* SIDEBAR FILTROS */}
         <aside className="w-64 bg-white border border-slate-200 rounded-xl p-5 overflow-y-auto shrink-0 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
               <Filter size={12}/> Filtros
            </div>
            
            <div className="space-y-4">
               <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Fecha</label>
                  <input type="date" className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
               </div>
               <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Nodo Origen</label>
                  <select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={filter.node} onChange={e => setFilter({...filter, node: e.target.value})}>
                     <option value="">TODOS</option>
                     <option value="SP-HOSP-CENTRAL">SP-HOSP-CENTRAL</option>
                     <option value="RJ-UBS-NORTE">RJ-UBS-NORTE</option>
                  </select>
               </div>
               <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Rol Actor</label>
                  <select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={filter.role} onChange={e => setFilter({...filter, role: e.target.value})}>
                     <option value="">TODOS</option>
                     <option value="NODE_ADMIN">NODE_ADMIN</option>
                     <option value="APS">APS</option>
                     <option value="EXTERNAL">EXTERNAL</option>
                  </select>
               </div>
               <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Resultado</label>
                  <select className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={filter.outcome} onChange={e => setFilter({...filter, outcome: e.target.value})}>
                     <option value="">TODOS</option>
                     <option value="APPROVED">APPROVED</option>
                     <option value="DENIED">DENIED</option>
                  </select>
               </div>
               <button onClick={() => setFilter({ node: '', role: '', outcome: '' })} className="w-full py-2 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-200 mt-4">Limpiar</button>
            </div>
         </aside>

         {/* TABLA PRINCIPAL */}
         <main className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
               <div className="relative w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                  <input className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-slate-900" placeholder="Buscar por ID Paciente, Actor o Hash..." />
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase border border-blue-100">
                  <Database size={12}/> Ledger Sync: OK
               </div>
            </div>

            <div className="flex-1 overflow-auto">
               <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest sticky top-0 z-10 shadow-sm">
                     <tr>
                        <th className="px-6 py-3 border-b border-slate-200">Fecha</th>
                        <th className="px-6 py-3 border-b border-slate-200">Nodo Origen</th>
                        <th className="px-6 py-3 border-b border-slate-200">Actor / Rol</th>
                        <th className="px-6 py-3 border-b border-slate-200">Paciente</th>
                        <th className="px-6 py-3 border-b border-slate-200">Acción</th>
                        <th className="px-6 py-3 border-b border-slate-200">Resultado</th>
                        <th className="px-6 py-3 border-b border-slate-200">Política</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {events.map(ev => (
                        <tr key={ev.id} onClick={() => openDrawer('GlobalEventDetailDrawer', ev)} className="hover:bg-slate-50 cursor-pointer transition-colors group">
                           <td className="px-6 py-3 text-[10px] font-mono text-slate-500">{ev.timestamp}</td>
                           <td className="px-6 py-3 text-[10px] font-bold text-slate-700">{ev.node}</td>
                           <td className="px-6 py-3">
                              <p className="text-[10px] font-bold text-slate-900">{ev.actor}</p>
                              <p className="text-[8px] font-black text-slate-400 uppercase">{ev.role}</p>
                           </td>
                           <td className="px-6 py-3 text-[10px] font-mono text-slate-600">{ev.patient}</td>
                           <td className="px-6 py-3 text-[10px] font-bold text-blue-600 uppercase">{ev.action}</td>
                           <td className="px-6 py-3">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${ev.result === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                 {ev.result}
                              </span>
                           </td>
                           <td className="px-6 py-3 text-[9px] font-mono text-slate-400">{ev.policy}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </main>
      </div>
    </div>
  );
};