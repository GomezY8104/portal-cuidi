
import React from 'react';
import { 
  Globe, ArrowUpRight, ArrowRight, Activity, 
  Server, Shield, AlertTriangle, FileText, Database 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const GlobalDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useAppStore();

  // 1. Tabela de KPIs
  const kpis = [
    { id: '1', indicator: 'Nós Federados Ativos', value: '1,248', change: '+1.2%', target: '/system/nodes' },
    { id: '2', indicator: 'Solicitações em Curso', value: '42,109', change: '+5.4%', target: '/system/audit?scope=cases' },
    { id: '3', indicator: 'Acessos Negados (Block)', value: '142', change: '-12%', target: '/system/compliance' },
    { id: '4', indicator: 'Políticas de Governança', value: '8,921', change: '+0.5%', target: '/system/compliance' },
    { id: '5', indicator: 'Eventos de Risco LGPD', value: '03', change: '0%', target: '/system/compliance', critical: true },
  ];

  // 2. Atividade Recente
  const activity = [
    { id: 'EV-01', time: '10:42:15', node: 'SP-HOSP-CENTRAL', actor: 'Dr. Ricardo (MED)', action: 'READ_CLINICAL', result: 'APPROVED' },
    { id: 'EV-02', time: '10:41:55', node: 'RJ-UBS-NORTE', actor: 'Enf. Carla (ENF)', action: 'WRITE_NOTE', result: 'APPROVED' },
    { id: 'EV-03', time: '10:40:12', node: 'MG-LAB-EST', actor: 'System (BOT)', action: 'SYNC_LEDGER', result: 'APPROVED' },
    { id: 'EV-04', time: '10:38:45', node: 'EXT-RESEARCH', actor: 'API User (EXT)', action: 'READ_SENSITIVE', result: 'DENIED' },
  ];

  // 3. Saúde da Infraestrutura
  const health = [
    { service: 'API Gateway (Northbound)', status: 'OPERACIONAL', latency: '24ms', lastCheck: 'Agora' },
    { service: 'Serviço de Consentimento', status: 'DEGRADADO', latency: '450ms', lastCheck: 'Há 1 min' },
    { service: 'Ledger Audit Trail', status: 'OPERACIONAL', latency: '120ms', lastCheck: 'Agora' },
    { service: 'Blob Storage (Docs)', status: 'OPERACIONAL', latency: '45ms', lastCheck: 'Agora' },
  ];

  return (
    <div className="space-y-12 animate-fade-in-up pb-20 font-sans text-slate-900">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b-2 border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-800 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
            <Globe size={14} /> Visão Macro da Federação
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Dashboard Global</h1>
        </div>
        <div className="flex gap-2">
           <button onClick={() => window.location.reload()} className="px-6 py-2 bg-slate-100 text-slate-600 border border-slate-300 rounded-sm text-[10px] font-bold uppercase hover:bg-slate-200 transition-all">
             Atualizar Dados
           </button>
        </div>
      </div>

      {/* 1. KPIs GLOBAIS */}
      <section className="space-y-4">
         <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Activity size={16} className="text-slate-500"/>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Indicadores Estratégicos (KPIs)</h3>
         </div>
         <div className="border border-slate-300 bg-white">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-300">
                  <tr>
                     <th className="px-6 py-3 border-r border-slate-200">Indicador</th>
                     <th className="px-6 py-3 border-r border-slate-200">Valor Atual</th>
                     <th className="px-6 py-3 border-r border-slate-200">Variação (24h)</th>
                     <th className="px-6 py-3 text-right">Navegação</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 text-xs font-bold text-slate-700">
                  {kpis.map(k => (
                     <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 border-r border-slate-200 uppercase">{k.indicator}</td>
                        <td className={`px-6 py-3 border-r border-slate-200 font-mono text-sm ${k.critical ? 'text-red-600' : 'text-slate-900'}`}>{k.value}</td>
                        <td className={`px-6 py-3 border-r border-slate-200 ${k.change.includes('+') ? 'text-emerald-600' : 'text-amber-600'}`}>{k.change}</td>
                        <td className="px-6 py-3 text-right">
                           <button onClick={() => navigate(k.target)} className="text-[10px] font-black text-blue-700 uppercase hover:underline flex items-center justify-end gap-1">
                              Ver Detalhe <ArrowRight size={12}/>
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>

      {/* 2. ATIVIDADE RECENTE */}
      <section className="space-y-4">
         <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Database size={16} className="text-slate-500"/>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Atividade Federada Recente</h3>
         </div>
         <div className="border border-slate-300 bg-white">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-300">
                  <tr>
                     <th className="px-6 py-3 border-r border-slate-200">Data / Hora</th>
                     <th className="px-6 py-3 border-r border-slate-200">Nó de Origem</th>
                     <th className="px-6 py-3 border-r border-slate-200">Ator / Papel</th>
                     <th className="px-6 py-3 border-r border-slate-200">Ação Executada</th>
                     <th className="px-6 py-3 border-r border-slate-200">Resultado</th>
                     <th className="px-6 py-3 text-right">Auditoria</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 text-xs font-medium text-slate-700">
                  {activity.map(a => (
                     <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 border-r border-slate-200 font-mono text-slate-500">{a.time}</td>
                        <td className="px-6 py-3 border-r border-slate-200 uppercase font-bold">{a.node}</td>
                        <td className="px-6 py-3 border-r border-slate-200 uppercase">{a.actor}</td>
                        <td className="px-6 py-3 border-r border-slate-200 font-mono text-blue-700">{a.action}</td>
                        <td className="px-6 py-3 border-r border-slate-200">
                           <span className={`px-2 py-0.5 border rounded-sm text-[9px] font-black uppercase ${a.result === 'APPROVED' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                              {a.result}
                           </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                           <button 
                              onClick={() => openModal('AuditTraceModal', a)}
                              className="text-[10px] font-black text-slate-500 uppercase hover:text-slate-900 hover:underline flex items-center justify-end gap-1"
                           >
                              <FileText size={12}/> Detalhes
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>

      {/* 3. SAÚDE DA INFRAESTRUTURA */}
      <section className="space-y-4">
         <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Server size={16} className="text-slate-500"/>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Saúde da Infraestrutura</h3>
         </div>
         <div className="border border-slate-300 bg-white">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-300">
                  <tr>
                     <th className="px-6 py-3 border-r border-slate-200">Serviço Central</th>
                     <th className="px-6 py-3 border-r border-slate-200">Status</th>
                     <th className="px-6 py-3 border-r border-slate-200">Latência</th>
                     <th className="px-6 py-3 border-r border-slate-200">Última Verificação</th>
                     <th className="px-6 py-3 text-right">Logs</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 text-xs font-bold text-slate-700">
                  {health.map((h, i) => (
                     <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 border-r border-slate-200 uppercase">{h.service}</td>
                        <td className="px-6 py-3 border-r border-slate-200">
                           <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${h.status === 'OPERACIONAL' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                              <span className={h.status === 'OPERACIONAL' ? 'text-emerald-700' : 'text-amber-700'}>{h.status}</span>
                           </div>
                        </td>
                        <td className="px-6 py-3 border-r border-slate-200 font-mono">{h.latency}</td>
                        <td className="px-6 py-3 border-r border-slate-200 text-slate-500">{h.lastCheck}</td>
                        <td className="px-6 py-3 text-right">
                           <button onClick={() => navigate('/system/audit')} className="text-[10px] font-black text-slate-500 uppercase hover:text-blue-700 hover:underline">
                              Ver Logs
                           </button>
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
