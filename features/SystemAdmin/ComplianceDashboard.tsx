import React, { useState } from 'react';
import { Shield, AlertCircle, CheckCircle, Plus, Eye, Pause, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';

export const ComplianceDashboardPage: React.FC = () => {
  const { openModal } = useAppStore();
  const navigate = useNavigate();

  const metrics = [
    { label: 'Accesos sin Consentimiento', value: '3', alert: true, filter: 'no_consent' },
    { label: 'Accesos Fuera de Política', value: '1', alert: false, filter: 'policy_breach' },
    { label: 'Consentimientos Vencidos', value: '42', alert: false, filter: 'expired_consent' },
    { label: 'Políticas Conflictivas', value: '0', alert: false, filter: 'conflict' },
  ];

  const policies = [
    { id: 'GP-01', name: 'Estándar Clínico Nacional', purpose: 'TREATMENT', scope: 'FULL', status: 'ACTIVE' },
    { id: 'GP-02', name: 'Anonimización para Pesquisa', purpose: 'RESEARCH', scope: 'ANONYMIZED', status: 'ACTIVE' },
    { id: 'GP-03', name: 'Bloqueo Administrativo', purpose: 'ADMIN', scope: 'METADATA', status: 'SUSPENDED' },
  ];

  const handleAction = (action: string, id: string) => {
    if (confirm(`¿Confirmar acción: ${action} sobre la política ${id}?`)) {
      alert('Cambio aplicado y auditado.');
    }
  };

  return (
    <div className="space-y-10 animate-fade-in-up pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">
            <Shield size={14} /> Supervisión Global
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Compliance LGPD</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Monitoreo de cumplimiento normativo y definición de reglas globales.
          </p>
        </div>
        <button 
          onClick={() => openModal('GlobalDirectiveModal')}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={16} /> Emitir Directriz Global
        </button>
      </div>

      {/* METRICAS LGPD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {metrics.map((m, i) => (
            <div key={i} className={`p-5 rounded-xl border ${m.alert ? 'bg-red-50 border-red-100' : 'bg-white border-slate-200'} shadow-sm`}>
               <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${m.alert ? 'text-red-600' : 'text-slate-400'}`}>{m.label}</span>
                  {m.alert && <AlertCircle size={16} className="text-red-500"/>}
               </div>
               <p className={`text-3xl font-black ${m.alert ? 'text-red-900' : 'text-slate-900'}`}>{m.value}</p>
               <button onClick={() => navigate(`/system/audit?filter=${m.filter}`)} className={`mt-3 text-[9px] font-bold uppercase hover:underline ${m.alert ? 'text-red-600' : 'text-blue-600'}`}>
                  Ver Auditoría
               </button>
            </div>
         ))}
      </div>

      {/* TABLA POLÍTICAS GLOBALES */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
         <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700">Políticas Globales Vigentes</h3>
         </div>
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Finalidad</th>
                  <th className="px-6 py-3">Alcance</th>
                  <th className="px-6 py-3 text-center">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {policies.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-4">
                        <p className="text-xs font-bold text-slate-900 uppercase">{p.name}</p>
                        <p className="text-[9px] font-mono text-slate-400">ID: {p.id}</p>
                     </td>
                     <td className="px-6 py-4 text-[10px] font-bold text-slate-600 uppercase">{p.purpose}</td>
                     <td className="px-6 py-4 text-[10px] font-bold text-slate-600 uppercase">{p.scope}</td>
                     <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                           {p.status}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button className="p-2 hover:bg-slate-100 rounded text-slate-500" title="Ver Detalle"><Eye size={16}/></button>
                           {p.status === 'ACTIVE' ? (
                              <button onClick={() => handleAction('SUSPENDER', p.id)} className="p-2 hover:bg-amber-50 rounded text-amber-600" title="Suspender"><Pause size={16}/></button>
                           ) : (
                              <button onClick={() => handleAction('REACTIVAR', p.id)} className="p-2 hover:bg-emerald-50 rounded text-emerald-600" title="Reactivar"><CheckCircle size={16}/></button>
                           )}
                           <button onClick={() => handleAction('REVOCAR', p.id)} className="p-2 hover:bg-red-50 rounded text-red-600" title="Revocar"><Trash2 size={16}/></button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};