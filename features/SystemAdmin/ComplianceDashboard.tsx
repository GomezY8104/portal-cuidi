
import React from 'react';
import { Shield, AlertCircle, FileText, Lock, Plus, Search, Eye, Pause, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';

export const ComplianceDashboardPage: React.FC = () => {
  const { openModal } = useAppStore();
  const navigate = useNavigate();

  const alerts = [
    { id: 'AL-01', type: 'ACESSO SEM CONSENTIMENTO', node: 'EXT-RESEARCH', date: 'Hoje, 10:00', severity: 'CRÍTICA', status: 'ABERTO' },
    { id: 'AL-02', type: 'RETENÇÃO EXCESSIVA', node: 'SP-HOSP-CENTRAL', date: 'Ontem', severity: 'MÉDIA', status: 'RESOLVIDO' },
  ];

  const policies = [
    { id: 'POL-01', name: 'Padrão Clínico Nacional', purpose: 'TRATAMENTO', segments: 'TODOS', data: 'CLÍNICO', status: 'ATIVA' },
    { id: 'POL-02', name: 'Pesquisa Anonimizada', purpose: 'PESQUISA', segments: 'UNIVERSIDADES', data: 'ANONIMIZADO', status: 'ATIVA' },
    { id: 'POL-03', name: 'Bloqueio Administrativo', purpose: 'ADMIN', segments: 'TODOS', data: 'METADADOS', status: 'SUSPENSA' },
  ];

  return (
    <div className="space-y-12 animate-fade-in-up pb-20 font-sans text-slate-900">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b-2 border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-800 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
            <Shield size={14} /> Governança & LGPD
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Compliance Global</h1>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => openModal('PolicyEditorModal')}
             className="px-6 py-2 bg-slate-900 text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 flex items-center gap-2"
           >
             <Plus size={12}/> Nova Política Global
           </button>
        </div>
      </div>

      {/* 1. ALERTAS DE COMPLIANCE */}
      <section className="space-y-4">
         <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <AlertCircle size={16} className="text-red-600"/>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Alertas de Incidente LGPD</h3>
         </div>
         <div className="border border-slate-300 bg-white">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-300">
                  <tr>
                     <th className="px-6 py-3 border-r border-slate-200">Tipo Incidente</th>
                     <th className="px-6 py-3 border-r border-slate-200">Nó Envolvido</th>
                     <th className="px-6 py-3 border-r border-slate-200">Data</th>
                     <th className="px-6 py-3 border-r border-slate-200 text-center">Gravidade</th>
                     <th className="px-6 py-3 border-r border-slate-200 text-center">Status</th>
                     <th className="px-6 py-3 text-right">Ação</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 text-xs font-bold text-slate-700">
                  {alerts.map(a => (
                     <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 border-r border-slate-200 uppercase text-slate-900">{a.type}</td>
                        <td className="px-6 py-3 border-r border-slate-200 uppercase">{a.node}</td>
                        <td className="px-6 py-3 border-r border-slate-200 font-mono text-slate-500">{a.date}</td>
                        <td className="px-6 py-3 border-r border-slate-200 text-center">
                           <span className={`text-[9px] font-black uppercase ${a.severity === 'CRÍTICA' ? 'text-red-600' : 'text-amber-600'}`}>{a.severity}</span>
                        </td>
                        <td className="px-6 py-3 border-r border-slate-200 text-center uppercase">{a.status}</td>
                        <td className="px-6 py-3 text-right">
                           <button onClick={() => navigate('/system/audit')} className="text-[10px] font-black text-blue-700 uppercase hover:underline">Ver Auditoria</button>
                        </td>
                     </tr>
                  ))}
                  {alerts.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-slate-400 font-medium">Nenhum alerta pendente.</td></tr>}
               </tbody>
            </table>
         </div>
      </section>

      {/* 2. POLÍTICAS GLOBAIS */}
      <section className="space-y-4">
         <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Lock size={16} className="text-slate-500"/>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Políticas de Acesso Vigentes</h3>
         </div>
         <div className="border border-slate-300 bg-white">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-300">
                  <tr>
                     <th className="px-6 py-3 border-r border-slate-200">Nome da Política</th>
                     <th className="px-6 py-3 border-r border-slate-200">Finalidade</th>
                     <th className="px-6 py-3 border-r border-slate-200">Segmentos</th>
                     <th className="px-6 py-3 border-r border-slate-200">Tipo de Dado</th>
                     <th className="px-6 py-3 border-r border-slate-200 text-center">Status</th>
                     <th className="px-6 py-3 text-right">Ações</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 text-xs font-bold text-slate-700">
                  {policies.map(p => (
                     <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 border-r border-slate-200">
                           <p className="uppercase text-slate-900">{p.name}</p>
                           <p className="font-mono text-[9px] text-slate-400 mt-0.5">ID: {p.id}</p>
                        </td>
                        <td className="px-6 py-3 border-r border-slate-200 uppercase">{p.purpose}</td>
                        <td className="px-6 py-3 border-r border-slate-200 uppercase">{p.segments}</td>
                        <td className="px-6 py-3 border-r border-slate-200 uppercase">{p.data}</td>
                        <td className="px-6 py-3 border-r border-slate-200 text-center">
                           <span className={`px-2 py-0.5 border rounded-sm text-[9px] font-black uppercase ${p.status === 'ATIVA' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                              {p.status}
                           </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                           <div className="flex justify-end gap-2">
                              <button onClick={() => openModal('PolicyEditorModal', p)} className="p-1.5 border border-slate-300 rounded-sm text-slate-500 hover:bg-slate-100 hover:text-blue-800"><Eye size={14}/></button>
                              {p.status === 'ATIVA' ? (
                                 <button className="p-1.5 border border-slate-300 rounded-sm text-slate-500 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"><Pause size={14}/></button>
                              ) : (
                                 <button className="p-1.5 border border-slate-300 rounded-sm text-slate-500 hover:text-red-700 hover:border-red-200"><Trash2 size={14}/></button>
                              )}
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>

    </div>
  );
};
