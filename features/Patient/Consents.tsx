
import React from 'react';
import { 
  ShieldCheck, Plus, Trash2, Edit, CheckCircle, XCircle, FileText, Check, X
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const PatientConsentsPage: React.FC = () => {
  const { 
    openModal, 
    patientConsents, 
    patientRequests, 
    revokeConsent, 
    approveRequest, 
    denyRequest 
  } = useAppStore();

  const handleRevoke = (e: React.MouseEvent, id: string, name: string) => {
      e.stopPropagation();
      openModal('ConfirmationModal', {
          title: 'Revogar Consentimento',
          message: `Tem certeza que deseja revogar o acesso de "${name}"? A instituição perderá o acesso aos dados imediatamente.`,
          type: 'danger',
          onConfirm: () => revokeConsent(id)
      });
  };

  const handleApprove = (e: React.MouseEvent, req: any) => {
      e.stopPropagation();
      approveRequest(req);
  };

  const handleDeny = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      openModal('ConfirmationModal', {
          title: 'Negar Solicitação',
          message: 'Deseja negar esta solicitação de acesso? A instituição será notificada.',
          type: 'warning',
          onConfirm: () => denyRequest(id)
      });
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-20 font-sans">
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
         <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Consentimentos (LGPD)</h1>
            <p className="text-slate-500 text-xs font-medium mt-1">Gerencie quem acessa seus dados e por qual motivo.</p>
         </div>
         <button 
            onClick={() => openModal('NewConsentModal')}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 flex items-center gap-2 shadow-sm active:scale-95"
         >
            <Plus size={14}/> Novo Consentimento
         </button>
      </div>

      {/* TABELA 1: CONSENTIMENTOS ATIVOS */}
      <section className="space-y-4">
         <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600"/> Consentimentos Ativos ({patientConsents.length})
         </h3>
         <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                     <th className="px-6 py-3">Instituição</th>
                     <th className="px-6 py-3">Segmento</th>
                     <th className="px-6 py-3">Dados Compartilhados</th>
                     <th className="px-6 py-3">Finalidade</th>
                     <th className="px-6 py-3">Vigência</th>
                     <th className="px-6 py-3 text-right">Ação</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {patientConsents.map(c => (
                     <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 font-bold text-slate-900">{c.inst}</td>
                        <td className="px-6 py-3"><span className="bg-slate-100 px-2 py-0.5 rounded text-[9px] font-bold uppercase text-slate-500">{c.segment}</span></td>
                        <td className="px-6 py-3 uppercase text-[10px]">{c.types}</td>
                        <td className="px-6 py-3 uppercase text-[10px]">{c.purpose}</td>
                        <td className="px-6 py-3 uppercase text-[10px]">{c.validity}</td>
                        <td className="px-6 py-3 text-right">
                           <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => openModal('EditConsentModal', c)} 
                                className="text-blue-600 hover:underline font-bold uppercase text-[10px]"
                              >
                                Editar
                              </button>
                              <button 
                                onClick={(e) => handleRevoke(e, c.id, c.inst)} 
                                className="text-red-600 hover:underline font-bold uppercase text-[10px] flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 size={12} /> Revogar
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
                  {patientConsents.length === 0 && (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400 italic">Nenhum consentimento ativo no momento.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </section>

      {/* TABELA 2: SOLICITAÇÕES */}
      <section className="space-y-4">
         <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
            <FileText size={16} className="text-amber-600"/> Solicitações de Acesso ({patientRequests.length})
         </h3>
         <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                     <th className="px-6 py-3">Instituição</th>
                     <th className="px-6 py-3">Dados Solicitados</th>
                     <th className="px-6 py-3">Finalidade</th>
                     <th className="px-6 py-3 text-center">Status</th>
                     <th className="px-6 py-3 text-right">Ação</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {patientRequests.map(r => (
                     <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 font-bold text-slate-900">{r.inst}</td>
                        <td className="px-6 py-3">{r.data}</td>
                        <td className="px-6 py-3 uppercase text-[10px]">{r.purpose}</td>
                        <td className="px-6 py-3 text-center"><span className="text-amber-600 font-bold text-[10px] uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{r.status}</span></td>
                        <td className="px-6 py-3 text-right">
                           <div className="flex justify-end gap-2">
                              <button 
                                onClick={(e) => handleApprove(e, r)}
                                className="bg-emerald-600 text-white px-3 py-1.5 rounded text-[9px] font-black uppercase hover:bg-emerald-700 flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                              >
                                <Check size={10} strokeWidth={4}/> Aprovar
                              </button>
                              <button 
                                onClick={(e) => handleDeny(e, r.id)}
                                className="bg-white border border-slate-200 text-slate-500 px-3 py-1.5 rounded text-[9px] font-black uppercase hover:bg-red-50 hover:text-red-600 hover:border-red-200 flex items-center gap-1 transition-all active:scale-95"
                              >
                                <X size={10} strokeWidth={4}/> Negar
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
                  {patientRequests.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400 italic">Nenhuma solicitação pendente.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </section>
    </div>
  );
};
