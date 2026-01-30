import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, ArrowRight, Settings, Server, 
  CheckCircle, AlertTriangle, XCircle, Clock,
  FileText, Shield, User, Zap, ChevronRight,
  BarChart3, Database, Globe, ArrowUpRight,
  Radio, Cpu, Network
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const NodeDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppStore();

  // MOCK DATA - KPIs
  const operationalKpis = [
    { id: 1, label: 'Solicitações Enviadas', value: '1,204', variation: '+5%', actionLink: '/node-admin/audit-reports?type=cases', color: 'text-blue-600' },
    { id: 2, label: 'Solicitações Recebidas', value: '850', variation: '+12%', actionLink: '/node-admin/audit-reports?type=cases', color: 'text-indigo-600' },
    { id: 3, label: 'Docs Compartilhados', value: '892', variation: '+8%', actionLink: '/node-admin/audit-reports?type=documents', color: 'text-emerald-600' },
    { id: 4, label: 'Acessos Bloqueados', value: '14', variation: '-2%', actionLink: '/node-admin/audit-reports?type=security', color: 'text-red-600' },
    { id: 5, label: 'Consentimentos', value: '342', variation: '+15%', actionLink: '/node-admin/audit-reports?type=consents', color: 'text-amber-600' },
  ];

  // MOCK DATA - Activity
  const recentActivity = [
    { id: 'EV-001', date: '10:45', user: 'Dr. Ricardo', role: 'NODE_ADMIN', action: 'READ_DOC', patient: 'Maria Silva', result: 'APPROVED', policy: 'POL-CLIN-01' },
    { id: 'EV-002', date: '09:30', user: 'Enf. Carla', role: 'UPA', action: 'WRITE_NOTE', patient: 'João Pedro', result: 'APPROVED', policy: 'POL-INT-02' },
    { id: 'EV-003', date: 'Ontem', user: 'Sistema Externo', role: 'EXTERNAL', action: 'REQ_ACCESS', patient: 'Ana Paula', result: 'DENIED', policy: 'POL-RESTRICT' },
    { id: 'EV-004', date: 'Ontem', user: 'Dr. Ricardo', role: 'PROVIDER', action: 'SEARCH_FED', patient: 'Carlos M.', result: 'APPROVED', policy: 'POL-FED-01' },
    { id: 'EV-005', date: 'Ontem', user: 'Regulador Central', role: 'REGULATOR', action: 'CHECK_ELIGIBILITY', patient: 'Manoel Gomes', result: 'APPROVED', policy: 'POL-REG-05' },
    { id: 'EV-006', date: 'Ontem', user: 'Auditoria Auto', role: 'SYSTEM', action: 'INTEGRITY_CHECK', patient: 'N/A', result: 'APPROVED', policy: 'SYS-AUDIT' },
  ];

  // MOCK DATA - Services
  const services = [
    { name: 'API Gateway', status: 'ONLINE', latency: '45ms', load: '12%' },
    { name: 'Serviço de Documentos', status: 'ONLINE', latency: '120ms', load: '34%' },
    { name: 'Serviço de Consentimento', status: 'WARN', latency: '850ms', load: '89%' },
    { name: 'Serviço de Auditoria', status: 'ONLINE', latency: '200ms', load: '22%' },
  ];

  return (
    <div className="animate-fade-in-up pb-20 max-w-[1600px] mx-auto">
      
      {/* HEADER TÉCNICO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-slate-900 text-white rounded-lg">
                <Globe size={18} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Federação Nacional</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Monitoramento do Nó</h1>
          <p className="text-slate-500 text-sm font-medium mt-1 font-mono">
            ORG_ID: <span className="text-blue-600">{user?.orgId || 'NODE-SP-01'}</span> • STATUS: <span className="text-emerald-600">ATIVO</span>
          </p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => navigate('/federation/policies')}
             className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
           >
             <Shield size={16}/> Políticas
           </button>
           <button 
             onClick={() => navigate('/node-admin/config')}
             className="px-6 py-3 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg"
           >
             <Settings size={16}/> Configurar Nó
           </button>
        </div>
      </div>

      {/* SEÇÃO 1: BARRA DE KPIs (Divisores em vez de Cards) */}
      <div className="bg-white border border-slate-200 rounded-2xl mb-10 shadow-sm overflow-hidden">
         <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {operationalKpis.map((kpi) => (
               <div key={kpi.id} className="p-6 group hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(kpi.actionLink)}>
                  <div className="flex justify-between items-start mb-2">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">{kpi.label}</p>
                     <ArrowUpRight size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"/>
                  </div>
                  <div className="flex items-end gap-3">
                     <span className={`text-3xl font-black ${kpi.color} tracking-tight`}>{kpi.value}</span>
                     <span className={`text-[10px] font-bold mb-1.5 ${kpi.variation.includes('-') ? 'text-red-500' : 'text-emerald-500'} bg-slate-100 px-1.5 py-0.5 rounded`}>
                        {kpi.variation}
                     </span>
                  </div>
               </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* SEÇÃO 2: ATIVIDADE RECENTE (Tabela Limpa) */}
        <div className="xl:col-span-2 space-y-6">
           <div className="flex justify-between items-center px-1">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                 <Activity size={16} className="text-blue-600"/> Trilha de Auditoria (Live)
              </h3>
              <button onClick={() => navigate('/node-admin/audit-reports')} className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Ver Histórico Completo</button>
           </div>

           <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                       <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Hora</th>
                       <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Ator / Papel</th>
                       <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Ação / Paciente</th>
                       <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Resultado</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {recentActivity.map((act, idx) => (
                       <tr key={idx} className="hover:bg-blue-50/20 transition-colors group cursor-default">
                          <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{act.date}</td>
                          <td className="px-6 py-4">
                             <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900">{act.user}</span>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{act.role}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex flex-col">
                                <span className="text-xs font-bold text-blue-600 uppercase">{act.action}</span>
                                <span className="text-[10px] font-medium text-slate-500">{act.patient}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <span className="font-mono text-[9px] text-slate-300 hidden group-hover:block">{act.policy}</span>
                                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${act.result === 'APPROVED' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                                   {act.result}
                                </span>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* SEÇÃO 3: ESTADO DE SERVIÇOS (Lista Técnica) */}
        <div className="space-y-6">
           <div className="flex justify-between items-center px-1">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                 <Server size={16} className="text-slate-600"/> Saúde da Integração
              </h3>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                 <span className="text-[10px] font-bold text-emerald-600 uppercase">Operational</span>
              </div>
           </div>

           <div className="bg-slate-900 rounded-2xl p-1 overflow-hidden shadow-xl">
              <div className="divide-y divide-white/5 bg-slate-900 rounded-xl">
                 {services.map((srv, idx) => (
                    <div key={idx} className="p-5 flex items-center justify-between group hover:bg-white/5 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${srv.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                             {srv.status === 'ONLINE' ? <CheckCircle size={16}/> : <AlertTriangle size={16}/>}
                          </div>
                          <div>
                             <p className="text-xs font-bold text-slate-200">{srv.name}</p>
                             <p className="text-[9px] font-mono text-slate-500 mt-0.5">Lat: {srv.latency}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Load</p>
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                             <div 
                                className={`h-full rounded-full ${parseInt(srv.load) > 80 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                                style={{ width: srv.load }}
                             ></div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="p-4 bg-slate-800/50 border-t border-white/5 flex justify-between items-center px-6">
                 <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <Database size={12}/> Ledger Sync
                 </div>
                 <span className="font-mono text-[10px] text-emerald-400">BLOQUE #921.402 VÁLIDO</span>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Network size={14}/> Topologia de Rede</h4>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                 <span>Nós Conectados (Peers)</span>
                 <span>14/15</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[94%]"></div>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                 Sua conexão com o backbone nacional está estável. Certificado ICP-Brasil expira em 120 dias.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};