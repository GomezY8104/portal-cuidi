import React, { useState } from 'react';
import { 
  ArrowLeft, Activity, ShieldCheck, Globe, 
  MessageCircle, Send, FileText, Lock, 
  CheckCircle, Clock, Search, Zap,
  Navigation, ChevronDown, MessageSquareText,
  ExternalLink, Check, X, Building2, UserPlus,
  Trash2, Eye
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const RegulationCaseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { openModal, openDrawer, attachedDocs, removeAttachedDoc, selectedVagas } = useAppStore();
  const { id } = useParams();
  
  const [priority, setPriority] = useState<'ALTA' | 'MÉDIA' | 'BAIXA' | null>(null);
  const [eligibility, setEligibility] = useState<'APTO' | 'INAPTO' | 'PENDENTE' | null>(null);
  const [justification, setJustification] = useState('');
  const [networkAction, setNetworkAction] = useState('');

  const patient = {
    name: 'MANOEL GOMES DA SILVA',
    cpf: '123.456.789-00',
    cns: '700000123456789',
    specialty: 'CARDIOLOGIA',
    clinicalNote: 'Paciente apresenta dor precordial tipo queimação há 3 horas, irradiada para membro superior esquerdo. Troponina positiva no nó de origem. Histórico de HAS e Tabagismo.'
  };

  const handleExecution = () => {
    if (networkAction === 'RETURN') {
      openModal('ReturnCaseModal', { patient: patient.name, id });
      return;
    }
    if (!eligibility) { alert('Selecione um veredito técnico.'); return; }
    if (eligibility === 'INAPTO') {
      openModal('NotificationRecusalModal', { patient: patient.name, id });
    } else if (eligibility === 'PENDENTE') {
      openModal('DocRequestModal', { patient: patient.name, id });
    } else {
      if (selectedVagas.length === 0) { alert('Selecione ao menos uma vaga na orquestração para homologar APTO.'); return; }
      openModal('EligibilityModal', { patient: patient.name, eligibility, priority, justification, vagas: selectedVagas });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in-up pb-10 font-sans">
      <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase leading-none">{patient.name}</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">Protocolo Federado: #{id || 'UPA-901'} • {patient.specialty}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="text-right border-r border-slate-100 pr-6">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">SLA Regulação</p>
              <p className="text-lg font-black text-red-600 tabular-nums leading-none">00:42:15</p>
           </div>
           <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
               <ShieldCheck size={18}/>
             </div>
             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Ledger Sync: OK</p>
           </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl ring-4 ring-blue-500/5">
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
            <Zap size={12} fill="currentColor" className="text-slate-900"/> Matriz de Decisão Assistencial Federada
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px] table-fixed">
            <thead>
              <tr className="bg-slate-50/30 border-b border-slate-100">
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase w-[160px]">01. Veredito</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase w-[150px]">02. Risco</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase text-center w-[70px]">03. Just.</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase w-[240px]">04. Busca Federada</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase w-[260px]">05. Orquestração</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase w-[260px]">06. Ação em Rede</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase text-right w-[90px]">Exec.</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-4 align-top">
                  <select value={eligibility || ''} onChange={e => setEligibility(e.target.value as any)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black uppercase outline-none focus:border-blue-500 shadow-sm">
                    <option value="" disabled>SELECIONAR...</option>
                    <option value="APTO">APTO (ACEITAR)</option>
                    <option value="INAPTO">REJEITAR</option>
                    <option value="PENDENTE">PENDENTE</option>
                  </select>
                </td>
                <td className="px-4 py-4 align-top">
                  <select value={priority || ''} onChange={e => setPriority(e.target.value as any)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black uppercase outline-none focus:border-blue-500 shadow-sm">
                    <option value="" disabled>DEFINIR...</option>
                    <option value="ALTA">ALTA (URGENTE)</option>
                    <option value="MÉDIA">MÉDIA</option>
                    <option value="BAIXA">BAIXA (ROTINA)</option>
                  </select>
                </td>
                <td className="px-4 py-4 text-center align-top">
                  <button onClick={() => openModal('JustificationModal', { text: justification, onSave: setJustification })} className={`p-2 rounded-lg transition-all border ${justification ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-slate-50 text-slate-400 border-slate-100'}`}><MessageSquareText size={18}/></button>
                </td>
                <td className="px-4 py-4 align-top">
                   <button onClick={() => navigate(`/regulator/case/${id}/search`)} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white shadow-sm transition-all text-[10px] font-black uppercase">
                     <Globe size={16}/> Buscar Docs ({attachedDocs.length})
                   </button>
                </td>
                <td className="px-4 py-4 align-top">
                   <button onClick={() => navigate(`/regulator/case/${id}/orchestrate`)} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white shadow-sm transition-all text-[10px] font-black uppercase">
                     <Navigation size={16}/> Orquestrar ({selectedVagas.length})
                   </button>
                </td>
                <td className="px-4 py-4 align-top">
                  <select value={networkAction} onChange={e => setNetworkAction(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 uppercase outline-none focus:border-blue-500 shadow-sm">
                    <option value="">SELECIONAR AÇÃO...</option>
                    <option value="DOCS_PACIENTE">PEDIR DOCS (AO PACIENTE)</option>
                    <option value="TRANSFER_PRESTADOR" disabled={eligibility !== 'APTO' || selectedVagas.length === 0}>TRANSFERIR AO PRESTADOR</option>
                    <option value="RETURN">DEVOLVER ORIGEM (UPA/APS)</option>
                  </select>
                </td>
                <td className="px-4 py-4 text-right align-top">
                  <button onClick={handleExecution} className="w-10 h-10 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center mx-auto"><Zap size={16} fill="currentColor"/></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* DOCUMENTOS ANEXADOS POR BUSCA FEDERADA */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
         <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <FileText size={16} className="text-blue-600"/> Documentação Técnica de Suporte ({attachedDocs.length})
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {attachedDocs.length === 0 && (
              <div className="col-span-full py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Nenhum documento federado anexado ainda.</p>
              </div>
            )}
            {attachedDocs.map(doc => (
              <div key={doc.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between group hover:border-blue-300 transition-all">
                 <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm"><FileText size={14}/></div>
                    <div className="overflow-hidden">
                       <p className="text-[10px] font-black text-slate-900 truncate uppercase leading-tight">{doc.name}</p>
                       <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">{doc.node}</p>
                    </div>
                 </div>
                 <div className="flex gap-1 ml-2">
                    <button onClick={() => openDrawer('ClinicalDetailDrawer', {...doc, detail: doc.name, hospital: doc.node, hasOriginal: true})} className="p-1.5 text-slate-300 hover:text-blue-600"><Eye size={16}/></button>
                    <button onClick={() => removeAttachedDoc(doc.id)} className="p-1.5 text-slate-300 hover:text-red-600"><Trash2 size={16}/></button>
                 </div>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
};