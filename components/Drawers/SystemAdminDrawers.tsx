import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, Server, Globe, Shield, Activity, FileText, Database, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export const SystemAdminDrawers: React.FC = () => {
  const { drawerData, closeDrawer, activeDrawer } = useAppStore();

  if (!['NodeDetailDrawer', 'GlobalEventDetailDrawer', 'TerritoryRulesDrawer'].includes(activeDrawer || '')) return null;

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-sm">
              {activeDrawer === 'NodeDetailDrawer' && <Server size={20} />}
              {activeDrawer === 'GlobalEventDetailDrawer' && <Activity size={20} />}
              {activeDrawer === 'TerritoryRulesDrawer' && <Globe size={20} />}
           </div>
           <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                {activeDrawer === 'NodeDetailDrawer' && 'Detalle Técnico del Nodo'}
                {activeDrawer === 'GlobalEventDetailDrawer' && 'Traza de Auditoría Global'}
                {activeDrawer === 'TerritoryRulesDrawer' && 'Reglas Territoriales'}
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                 ID: {drawerData?.id || 'SYS-UNDEF'}
              </p>
           </div>
        </div>
        <button onClick={closeDrawer} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><X size={20}/></button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
         {activeDrawer === 'NodeDetailDrawer' && (
           <>
             <section className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Estado Operativo</h4>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Latencia Media</p>
                      <p className="text-lg font-black text-slate-900">24ms</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Uptime (30d)</p>
                      <p className="text-lg font-black text-emerald-600">99.98%</p>
                   </div>
                </div>
             </section>

             <section className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Configuración Técnica</h4>
                <table className="w-full text-left text-xs">
                   <tbody>
                      <tr className="border-b border-slate-50"><td className="py-2 font-bold text-slate-500">Endpoint</td><td className="py-2 font-mono text-slate-700">https://api.hosp-central.gov.br/v1</td></tr>
                      <tr className="border-b border-slate-50"><td className="py-2 font-bold text-slate-500">Certificado</td><td className="py-2 font-mono text-green-600">VALID (Exp: 2025)</td></tr>
                      <tr className="border-b border-slate-50"><td className="py-2 font-bold text-slate-500">Versión Protocolo</td><td className="py-2 font-mono text-slate-700">CUIDI v3.1</td></tr>
                   </tbody>
                </table>
             </section>

             <section className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Últimos Errores</h4>
                <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-[10px] text-red-800 font-mono">
                   [2024-10-25 14:02:11] Timeout waiting for Consent Service handshake.
                </div>
             </section>
           </>
         )}

         {activeDrawer === 'GlobalEventDetailDrawer' && (
           <>
             <div className="p-4 bg-slate-900 text-white rounded-lg font-mono text-xs space-y-2">
                <div className="flex justify-between"><span className="text-slate-400">HASH:</span> <span className="text-blue-400 break-all">0x8f2a...91b2</span></div>
                <div className="flex justify-between"><span className="text-slate-400">BLOCK:</span> <span>#12,402,192</span></div>
             </div>

             <section className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Contexto del Evento</h4>
                <div className="grid grid-cols-1 gap-3">
                   <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Actor</span>
                      <span className="text-xs font-black text-slate-900">{drawerData.actor}</span>
                   </div>
                   <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Rol</span>
                      <span className="text-xs font-black text-slate-900">{drawerData.role}</span>
                   </div>
                   <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Nodo Origen</span>
                      <span className="text-xs font-black text-slate-900">{drawerData.node}</span>
                   </div>
                </div>
             </section>

             <section className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Evaluación de Gobernanza</h4>
                <div className={`p-4 rounded-lg border-l-4 ${drawerData.result === 'APPROVED' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
                   <p className="text-xs font-bold uppercase mb-1">{drawerData.result}</p>
                   <p className="text-[10px] leading-relaxed">
                      {drawerData.result === 'APPROVED' 
                        ? 'Acceso validado por política global POL-FED-01. Consentimiento del paciente verificado.' 
                        : 'Acceso denegado. No se encontró consentimiento activo para la finalidad solicitada.'}
                   </p>
                </div>
             </section>
           </>
         )}

         {activeDrawer === 'TerritoryRulesDrawer' && (
           <div className="space-y-4 text-center text-slate-500 text-xs">
              <Globe size={48} className="mx-auto text-slate-300"/>
              <p>Visualización de reglas territoriales en desarrollo.</p>
           </div>
         )}
      </div>

      <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
         <button onClick={closeDrawer} className="px-6 py-3 bg-white border border-slate-300 text-slate-600 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100">Cerrar</button>
         <button className="px-6 py-3 bg-slate-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 flex items-center gap-2">
            <FileText size={14}/> Exportar Detalle
         </button>
      </div>
    </div>
  );
};