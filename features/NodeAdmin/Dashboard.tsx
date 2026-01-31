
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Settings, Server, 
  CheckCircle, AlertTriangle, XCircle,
  FileText, Shield, User, Globe, ArrowRight,
  Database, RefreshCw, Eye, Search, Loader2
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const NodeDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, openDrawer } = useAppStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
      setIsRefreshing(true);
      setTimeout(() => {
          setIsRefreshing(false);
      }, 1000);
  };

  // 1. KPI Data
  const operationalKpis = [
    { id: 1, indicator: 'Solicitações Enviadas', value: '1,204', trend: '+5%', trendType: 'up', action: 'Ver Detalhes', link: '/node-admin/audit-reports?type=case_sent' },
    { id: 2, indicator: 'Solicitações Recebidas', value: '850', trend: '+12%', trendType: 'up', action: 'Ver Detalhes', link: '/node-admin/audit-reports?type=case_received' },
    { id: 3, indicator: 'Documentos Compartilhados', value: '892', trend: '+8%', trendType: 'up', action: 'Auditar', link: '/node-admin/audit-reports?type=doc_shared' },
    { id: 4, indicator: 'Acessos Bloqueados (LGPD)', value: '14', trend: '-2%', trendType: 'down', action: 'Investigar', link: '/node-admin/audit-reports?result=DENIED' },
    { id: 5, indicator: 'Consentimentos Ativos', value: '342', trend: '+15%', trendType: 'up', action: 'Gerenciar', link: '/federation/policies' },
  ];

  // 2. Audit Trail Data
  const auditTrail = [
    { id: 'EV-001', time: '10:45:22', user: 'Dr. Ricardo', role: 'NODE_ADMIN', action: 'READ_DOC', patient: 'Maria Silva', result: 'APPROVED' },
    { id: 'EV-002', time: '10:44:10', user: 'Enf. Carla', role: 'UPA', action: 'WRITE_NOTE', patient: 'João Pedro', result: 'APPROVED' },
    { id: 'EV-003', time: '10:42:05', user: 'Ext. System', role: 'EXTERNAL', action: 'REQ_ACCESS', patient: 'Ana Paula', result: 'DENIED' },
    { id: 'EV-004', time: '10:40:00', user: 'Dr. Ricardo', role: 'PROVIDER', action: 'SEARCH_FED', patient: 'Carlos M.', result: 'APPROVED' },
    { id: 'EV-005', time: '10:35:12', user: 'Reg. Central', role: 'REGULATOR', action: 'CHECK_ELIG', patient: 'Manoel Gomes', result: 'APPROVED' },
  ];

  // 3. System Health Data
  const services = [
    { name: 'API Gateway (Northbound)', status: 'ONLINE', latency: '45ms', lastCheck: 'Há 10s' },
    { name: 'Serviço de Documentos (Blob)', status: 'ONLINE', latency: '120ms', lastCheck: 'Há 30s' },
    { name: 'Serviço de Consentimento', status: 'WARN', latency: '850ms', lastCheck: 'Há 1m' },
    { name: 'Serviço de Auditoria (Ledger)', status: 'ONLINE', latency: '200ms', lastCheck: 'Há 5s' },
  ];

  return (
    <div className="animate-fade-in-up pb-20 max-w-full mx-auto space-y-8 font-sans">
      
      {/* HEADER INSTITUCIONAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Globe size={16} className="text-slate-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Governança Federada</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Dashboard do Nó: {user?.nodeName}</h1>
          <p className="text-slate-500 text-xs font-medium mt-1 font-mono">
            ORG_ID: <span className="text-blue-600">{user?.orgId || 'NODE-SP-01'}</span> • STATUS: <span className="text-emerald-600">ONLINE</span>
          </p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={handleRefresh}
             disabled={isRefreshing}
             className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-600 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-slate-200 flex items-center gap-2 transition-all disabled:opacity-70"
           >
             <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''}/> {isRefreshing ? 'Atualizando...' : 'Atualizar Dados'}
           </button>
        </div>
      </div>

      {/* 1. TABELA DE INDICADORES OPERACIONAIS */}
      <section className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
         <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
               <Activity size={14}/> Indicadores Operacionais (24h)
            </h3>
         </div>
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-white border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-3">Indicador</th>
                  <th className="px-6 py-3">Valor Atual</th>
                  <th className="px-6 py-3">Tendência</th>
                  <th className="px-6 py-3 text-right">Ação</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
               {operationalKpis.map((kpi) => (
                  <tr key={kpi.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-3 font-bold uppercase">{kpi.indicator}</td>
                     <td className="px-6 py-3 font-mono text-sm font-black">{kpi.value}</td>
                     <td className={`px-6 py-3 font-bold ${kpi.trendType === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {kpi.trend}
                     </td>
                     <td className="px-6 py-3 text-right">
                        <button 
                           onClick={() => navigate(kpi.link)}
                           className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center justify-end gap-1 ml-auto"
                        >
                           {kpi.action} <ArrowRight size={12}/>
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </section>

      {/* 2. TRILHA DE AUDITORIA (LIVE) */}
      <section className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
         <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
               <Shield size={14}/> Trilha de Auditoria (Live)
            </h3>
            <button 
               onClick={() => navigate('/node-admin/audit-reports')}
               className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
            >
               Ver Histórico Completo
            </button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-white border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <th className="px-6 py-3">Hora</th>
                     <th className="px-6 py-3">Usuário</th>
                     <th className="px-6 py-3">Papel</th>
                     <th className="px-6 py-3">Ação</th>
                     <th className="px-6 py-3">Paciente (Ref)</th>
                     <th className="px-6 py-3 text-right">Resultado</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {auditTrail.map((log) => (
                     <tr 
                        key={log.id} 
                        className="hover:bg-blue-50/30 cursor-pointer transition-colors"
                        onClick={() => openDrawer('GlobalEventDetailDrawer', { ...log, node: 'LOCAL_NODE' })}
                     >
                        <td className="px-6 py-3 font-mono text-slate-500">{log.time}</td>
                        <td className="px-6 py-3 font-bold">{log.user}</td>
                        <td className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.role}</td>
                        <td className="px-6 py-3 font-mono text-blue-600">{log.action}</td>
                        <td className="px-6 py-3">{log.patient}</td>
                        <td className="px-6 py-3 text-right">
                           <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${log.result === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              {log.result}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>

      {/* 3. SAÚDE DA INTEGRAÇÃO */}
      <section className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
         <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
               <Server size={14}/> Saúde da Integração
            </h3>
         </div>
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-white border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-3">Serviço</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Latência</th>
                  <th className="px-6 py-3">Última Verificação</th>
                  <th className="px-6 py-3 text-right">Ação</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
               {services.map((srv, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-3 font-bold uppercase">{srv.name}</td>
                     <td className="px-6 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${srv.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                           {srv.status}
                        </span>
                     </td>
                     <td className="px-6 py-3 text-center font-mono text-slate-500">{srv.latency}</td>
                     <td className="px-6 py-3 text-slate-500">{srv.lastCheck}</td>
                     <td className="px-6 py-3 text-right">
                        <button 
                           onClick={() => navigate('/node-admin/config')}
                           className="px-3 py-1.5 border border-slate-200 rounded hover:bg-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-600"
                        >
                           Configurar
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </section>

    </div>
  );
};
