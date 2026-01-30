import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, ShieldAlert, CheckCircle, Info, ArrowRight, Globe, Lock, Shield } from 'lucide-react';
import { GovernanceDecision } from '../../services/governanceService';

/**
 * Drawer de Governança para registrar e confirmar acessos.
 */
export const GovernanceDecisionDrawer: React.FC = () => {
  const { drawerData, closeDrawer } = useAppStore();
  
  if (!drawerData) return null;

  const decision = drawerData.decision;
  const onConfirm = drawerData.onConfirm;

  return (
    <div className="p-10 h-full flex flex-col space-y-8">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl shadow-lg ${decision.decision === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {decision.decision === 'APPROVED' ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Governança Federada</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">Avaliação em Tempo Real</p>
        </div>
      </div>

      <div className={`p-8 rounded-[2.5rem] border-2 space-y-4 ${decision.decision === 'APPROVED' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-1">
           <Shield size={14} className={decision.decision === 'APPROVED' ? 'text-green-600' : 'text-red-600'} />
           Veredito: {decision.decision}
         </div>
         <p className="text-slate-800 text-sm leading-relaxed font-medium italic">"{decision.justification}"</p>
      </div>

      {/* Información de Nodos Autorizados (Nuevo) */}
      {decision.authorizedNodes && (
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
             <Globe size={14} /> Nodos da Federação com Acesso Ativo
          </h4>
          <div className="flex flex-wrap gap-2">
            {decision.authorizedNodes.map((node: string, idx: number) => (
              <span key={idx} className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-700 shadow-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> {node}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Permisos Granulares (Nuevo) */}
      {decision.userPermissions && (
        <div className="space-y-4">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
             <Lock size={14} /> Privilégios Concedidos
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {decision.userPermissions.map((perm: string, idx: number) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                 <CheckCircle size={14} className="text-emerald-500" />
                 <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tighter">{perm.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {decision.obligations.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
             <Info size={16} className="text-blue-500" /> Obrigações e Compliance
          </h4>
          <ul className="space-y-2">
            {decision.obligations.map((ob: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3 text-xs text-slate-600 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/30">
                <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></div>
                <span className="font-medium">{ob}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {decision.policyId && (
        <div className="p-5 bg-slate-900 rounded-[1.8rem] flex items-center justify-between shadow-xl">
           <div>
             <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Política Ledger Aplicada</p>
             <span className="text-xs font-mono font-bold text-blue-400">{decision.policyId}</span>
           </div>
           <Shield size={24} className="text-white/10" />
        </div>
      )}

      <div className="mt-auto pt-8 space-y-4">
        {decision.decision === 'APPROVED' && onConfirm && (
          <button 
            onClick={() => {
              onConfirm();
              closeDrawer();
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs tracking-widest py-6 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-200 active:scale-95"
          >
            Confirmar Ação Assistencial <ArrowRight size={18} />
          </button>
        )}
        <button 
          onClick={closeDrawer}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-widest py-4 rounded-2xl transition-colors"
        >
          {decision.decision === 'APPROVED' ? 'Cancelar e Bloquear' : 'Fechar Janela'}
        </button>
      </div>
    </div>
  );
};