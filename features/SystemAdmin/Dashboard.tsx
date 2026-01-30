import React from 'react';
import { 
  Globe, Activity, Shield, Users, 
  ArrowUpRight, ArrowDownRight, Zap, 
  Database, AlertCircle, CheckCircle2, Server, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const GlobalDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { openDrawer } = useAppStore();

  const kpis = [
    { label: 'Nodos Activos', value: '1,248', change: '+1.2%', link: '/system/nodes' },
    { label: 'Solicitudes en Curso', value: '42,109', change: '+5.4%', link: '/system/audit?scope=cases' },
    { label: 'Accesos DENIED Globales', value: '142', change: '-12%', link: '/system/audit?result=DENIED', alert: true },
    { label: 'Políticas Activas', value: '8,921', change: '+0.5%', link: '/system/compliance' },
    { label: 'Consentimientos Utilizados', value: '315k', change: '+8%', link: '/system/compliance' },
    { label: 'Eventos Riesgo LGPD', value: '03', change: '0%', link: '/system/compliance', critical: true },
  ];

  const recentActivity = [
    { date: 'Hoy, 10:42', node: 'SP-HOSP-CENTRAL', actor: 'Dr. Ricardo', role: 'PROVIDER', action: 'READ_CLINICAL', result: 'APPROVED', policy: 'POL-FED-01' },
    { date: 'Hoy, 10:41', node: 'RJ-UBS-NORTE', actor: 'Enf. Carla', role: 'APS', action: 'WRITE_NOTE', result: 'APPROVED', policy: 'POL-FED-02' },
    { date: 'Hoy, 10:40', node: 'MG-LAB-EST', actor: 'System', role: 'SYSTEM', action: 'SYNC_LEDGER', result: 'APPROVED', policy: 'SYS-INTERNAL' },
    { date: 'Hoy, 10:38', node: 'EXT-RESEARCH', actor: 'API User', role: 'EXTERNAL', action: 'READ_SENSITIVE', result: 'DENIED', policy: 'NO_CONSENT' },
  ];

  const systemHealth = [
    { service: 'API Gateways (North)', status: 'OK', nodesOk: 420, nodesErr: 0 },
    { service: 'Servicios de Documentos (Blob)', status: 'OK', nodesOk: 1240, nodesErr: 2 },
    { service: 'Servicios de Consentimiento', status: 'WARN', nodesOk: 1200, nodesErr: 48 },
    { service: 'Auditoría Federada (Ledger)', status: 'OK', nodesOk: 1248, nodesErr: 0 },
  ];

  return (
    <div className="space-y-10 animate-fade-in-up pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">
            <Globe size={14} /> Vista Central de la Federación
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Dashboard Global</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Estado de la infraestructura, gobernanza y seguridad de toda la red.
          </p>
        </div>
        <div className="flex gap-3">
           <div className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Red Operativa
           </div>
        </div>
      </div>

      {/* KPI GLOBAL TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
           <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700">Indicadores Clave de Desempeño (KPI)</h3>
        </div>
        <table className="w-full text-left border-collapse">
           <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <th className="px-6 py-3">Indicador</th>
                 <th className="px-6 py-3">Valor Actual</th>
                 <th className="px-6 py-3">Variación (7d)</th>
                 <th className="px-6 py-3 text-right">Acción</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-50">
              {kpis.map((k, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-700 uppercase">{k.label}</td>
                    <td className={`px-6 py-4 text-sm font-black ${k.critical ? 'text-red-600' : 'text-slate-900'}`}>{k.value}</td>
                    <td className={`px-6 py-4 text-xs font-bold ${k.change.includes('-') ? 'text-red-500' : 'text-emerald-500'}`}>{k.change}</td>
                    <td className="px-6 py-4 text-right">
                       <button onClick={() => navigate(k.link)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center justify-end gap-1">
                          Ver Detalle <ArrowUpRight size={12}/>
                       </button>
                    </td>
                 </tr>
              ))}
           </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* ACTIVIDAD RECIENTE */}
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
               <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700">Actividad Federada Reciente</h3>
               <button onClick={() => navigate('/system/audit')} className="text-[9px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Ver Todo</button>
            </div>
            <div className="flex-1 overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white">
                        <th className="px-6 py-3">Fecha</th>
                        <th className="px-6 py-3">Nodo</th>
                        <th className="px-6 py-3">Actor / Rol</th>
                        <th className="px-6 py-3">Acción</th>
                        <th className="px-6 py-3 text-right">Resultado</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {recentActivity.map((act, i) => (
                        <tr key={i} onClick={() => openDrawer('GlobalEventDetailDrawer', act)} className="hover:bg-blue-50/30 transition-colors cursor-pointer group">
                           <td className="px-6 py-3 text-[10px] font-bold text-slate-500">{act.date}</td>
                           <td className="px-6 py-3 text-[10px] font-bold text-slate-700 uppercase">{act.node}</td>
                           <td className="px-6 py-3">
                              <p className="text-[10px] font-bold text-slate-900">{act.actor}</p>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">{act.role}</p>
                           </td>
                           <td className="px-6 py-3 text-[10px] font-mono text-slate-600 uppercase">{act.action}</td>
                           <td className="px-6 py-3 text-right">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${act.result === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                 {act.result}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* SALUD DEL ECOSISTEMA */}
         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
               <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700">Salud del Ecosistema</h3>
            </div>
            <div className="flex-1 p-0">
               <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-slate-50">
                     {systemHealth.map((srv, i) => (
                        <tr key={i} className="group hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4">
                              <div className="flex justify-between items-start mb-1">
                                 <span className="text-[10px] font-bold text-slate-700 uppercase">{srv.service}</span>
                                 <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${srv.status === 'OK' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{srv.status}</span>
                              </div>
                              <div className="flex gap-4 text-[9px] font-medium text-slate-500 mt-2">
                                 <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-emerald-500"/> {srv.nodesOk} OK</span>
                                 {srv.nodesErr > 0 && <span className="flex items-center gap-1 text-red-500"><AlertCircle size={10}/> {srv.nodesErr} Err</span>}
                              </div>
                              {srv.nodesErr > 0 && (
                                 <button onClick={() => navigate('/system/nodes?status=error')} className="mt-2 text-[9px] font-black text-blue-600 uppercase hover:underline">Ver nodos afectados</button>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
};