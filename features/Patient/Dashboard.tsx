
import React from 'react';
import { 
  Shield, Bell, Activity, 
  ArrowRight, Heart, FileText, Lock,
  ChevronRight, Calendar, Info, FolderPlus,
  AlertTriangle, CheckCircle2, Clock, ShieldCheck,
  AlertCircle, Timer, Globe, Stethoscope, Eye, UploadCloud,
  MessageSquare
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { MOCK_DOC_REQUESTS } from '../../mocks/seed';

export const PatientDashboardPage: React.FC = () => {
  const { user, openDrawer } = useAppStore();
  const navigate = useNavigate();

  // Helper para calcular días restantes (Mock)
  const getDaysLeft = (dateStr: string) => {
    const due = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 0;
  };

  const MOCK_ALERTS = [
    { id: 'AL-01', date: 'Hoje', type: 'EXAME', origin: 'Hospital das Clínicas', desc: 'Resultado de Raio-X disponível' },
    { id: 'AL-02', date: 'Ontem', type: 'ACESSO', origin: 'UBS Jardim Norte', desc: 'Médico acessou histórico clínico' },
    { id: 'AL-03', date: '12/10', type: 'RECEITA', origin: 'Dr. Ricardo', desc: 'Nova prescrição digital emitida' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 font-sans">
      
      {/* 1. PAINEL DE BOAS-VINDAS (CLEAN) */}
      <div className="bg-white border-b border-slate-200 pb-8">
         <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Olá, {user?.name.split(' ')[0]}.</h1>
         <p className="text-slate-500 text-lg">Você controla seus dados e acompanha seu cuidado aqui.</p>
         
         <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={() => navigate('/patient/cases')} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm active:scale-95">Ver Meus Processos</button>
            <button onClick={() => navigate('/patient/history')} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95">Ver Histórico Clínico</button>
            <button onClick={() => navigate('/patient/consents')} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95">Gerenciar Consentimentos</button>
            <button onClick={() => navigate('/patient/emergency')} className="px-5 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all shadow-sm active:scale-95">Perfil de Emergência</button>
         </div>
      </div>

      {/* 2. SOLICITAÇÕES PENDENTES (TABELA) */}
      <section className="space-y-4">
         <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
               <AlertCircle size={16} className="text-amber-500"/> Solicitações Pendentes
            </h3>
         </div>
         
         <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                     <th className="px-6 py-3">Prioridade</th>
                     <th className="px-6 py-3">Documento Solicitado</th>
                     <th className="px-6 py-3">Requisitante</th>
                     <th className="px-6 py-3 text-center">Prazo</th>
                     <th className="px-6 py-3 text-right">Ação</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {MOCK_DOC_REQUESTS.map(req => {
                     const days = getDaysLeft(req.dueDate);
                     const isUrgent = req.priority === 'HIGH' || days <= 3;
                     return (
                        <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-3">
                              <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${isUrgent ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                 {isUrgent ? 'URGENTE' : 'PENDENTE'}
                              </span>
                           </td>
                           <td className="px-6 py-3 font-bold">{req.documentType}</td>
                           <td className="px-6 py-3 uppercase">{req.requester}</td>
                           <td className="px-6 py-3 text-center font-mono">{days} dias</td>
                           <td className="px-6 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                 {/* BOTÓN DE MENSAJE SOLICITADO */}
                                 <button 
                                    onClick={() => openDrawer('CaseSummaryDrawer', { ...req, initialTab: 'CHAT' })}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-all border border-transparent hover:border-blue-100"
                                    title="Falar com Solicitante"
                                 >
                                    <MessageSquare size={16}/>
                                 </button>
                                 <button 
                                    onClick={() => openDrawer('UploadDocumentDrawer', { requestId: req.id, type: req.documentType })}
                                    className="px-3 py-1.5 bg-slate-900 text-white rounded text-[9px] font-bold uppercase tracking-widest hover:bg-slate-700 flex items-center gap-1"
                                 >
                                    <UploadCloud size={10}/> Anexar
                                 </button>
                                 <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100" title="Ver Detalhes">
                                    <Info size={14}/>
                                 </button>
                              </div>
                           </td>
                        </tr>
                     );
                  })}
                  {MOCK_DOC_REQUESTS.length === 0 && (
                     <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400 italic">Nenhuma solicitação pendente.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </section>

      {/* 3. ALERTAS DA REDE (TABELA) */}
      <section className="space-y-4">
         <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
            <Bell size={16} className="text-blue-600"/> Alertas da Rede
         </h3>
         <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                     <th className="px-6 py-3">Data</th>
                     <th className="px-6 py-3">Tipo</th>
                     <th className="px-6 py-3">Origem</th>
                     <th className="px-6 py-3">Descrição</th>
                     <th className="px-6 py-3 text-right">Ação</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {MOCK_ALERTS.map(alert => (
                     <tr key={alert.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 font-mono text-slate-500">{alert.date}</td>
                        <td className="px-6 py-3"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase">{alert.type}</span></td>
                        <td className="px-6 py-3 uppercase">{alert.origin}</td>
                        <td className="px-6 py-3">{alert.desc}</td>
                        <td className="px-6 py-3 text-right">
                           <div className="flex justify-end gap-2">
                              <button onClick={() => navigate('/patient/history')} className="text-blue-600 font-bold hover:underline text-[10px] uppercase">Ir p/ Histórico</button>
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
