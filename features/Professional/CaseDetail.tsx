
import React, { useState } from 'react';
import { 
  ArrowLeft, FileText, Activity, Clock, 
  MessageSquare, History, Shield, Globe, 
  Download, AlertCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const CaseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'RESUMO' | 'DOCS' | 'TRAMITE'>('RESUMO');

  // Dados Mockados para visualização
  const caseData = {
    id: id || 'APS-24-001',
    patient: 'MARIA APARECIDA DA SILVA',
    age: 58,
    cpf: '123.456.789-00',
    spec: 'CARDIOLOGIA',
    cid: 'I20 - ANGINA PECTORIS',
    priority: 'ALTA',
    status: 'DEVOLVIDO',
    date: '25/10/2024',
    history: 'Paciente refere dor precordial tipo aperto aos médios esforços há 2 meses. Hipertensa e diabética. ECG na unidade mostrou isquemia parede inferior.',
    returnMessage: 'Solicito anexar Teste Ergométrico recente ou Ecocardiograma para melhor estratificação de risco antes do agendamento.',
    regulator: 'DR. REGULADOR CENTRAL'
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 font-sans text-slate-900 animate-in fade-in duration-300">
      
      {/* HEADER DE COMANDO */}
      <div className="bg-white border border-slate-300 rounded-sm p-6 mb-6 shadow-sm">
         <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
               <button onClick={() => navigate('/aps')} className="p-2 border border-slate-200 rounded-sm hover:bg-slate-50 text-slate-500"><ArrowLeft size={18}/></button>
               <div>
                  <h1 className="text-xl font-black uppercase text-slate-800 leading-none">{caseData.patient}</h1>
                  <p className="text-xs text-slate-500 font-bold uppercase mt-1">
                     Protocolo: <span className="font-mono text-blue-700">{caseData.id}</span> • {caseData.age} ANOS • CPF {caseData.cpf}
                  </p>
               </div>
            </div>
            <div className="text-right">
               <span className={`inline-block px-3 py-1 border rounded-sm text-xs font-black uppercase tracking-widest ${caseData.status === 'DEVOLVIDO' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-200'}`}>
                  {caseData.status}
               </span>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Prioridade {caseData.priority}</p>
            </div>
         </div>

         {/* ALERTA DE DEVOLUÇÃO (SE HOUVER) */}
         {caseData.status === 'DEVOLVIDO' && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-sm mb-2">
               <div className="flex items-center gap-2 text-amber-800 font-black text-xs uppercase tracking-widest mb-1">
                  <AlertCircle size={14}/> Pendência Regulatória
               </div>
               <p className="text-sm font-medium text-amber-900 leading-relaxed">
                  "{caseData.returnMessage}" — <strong>{caseData.regulator}</strong>
               </p>
               <div className="mt-3">
                  <button className="px-4 py-2 bg-amber-600 text-white font-bold text-xs uppercase rounded-sm hover:bg-amber-700">Responder Pendência</button>
               </div>
            </div>
         )}
      </div>

      {/* ABAS DE NAVEGAÇÃO */}
      <div className="flex border-b border-slate-300 mb-6">
         {[
            { id: 'RESUMO', label: 'Resumo Clínico', icon: <FileText size={16}/> },
            { id: 'DOCS', label: 'Documentos', icon: <Activity size={16}/> },
            { id: 'TRAMITE', label: 'Trâmite & Histórico', icon: <History size={16}/> }
         ].map(tab => (
            <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === tab.id ? 'border-blue-700 text-blue-800 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
            >
               {tab.icon} {tab.label}
            </button>
         ))}
      </div>

      {/* CONTEÚDO DA ABA */}
      <div className="bg-white border border-slate-200 rounded-sm min-h-[400px]">
         
         {activeTab === 'RESUMO' && (
            <div className="p-8 space-y-8">
               <div className="grid grid-cols-2 gap-8 text-sm">
                  <div className="p-4 bg-slate-50 border border-slate-200">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Especialidade Solicitada</p>
                     <p className="font-bold text-slate-900">{caseData.spec}</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Diagnóstico (CID-10)</p>
                     <p className="font-bold text-slate-900">{caseData.cid}</p>
                  </div>
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">História Clínica / Justificativa</p>
                  <div className="p-6 border border-slate-200 rounded-sm bg-white text-slate-700 leading-relaxed font-medium">
                     {caseData.history}
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'DOCS' && (
            <div>
               <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase text-slate-600">Documentos Anexados</h3>
                  <button className="text-[10px] font-bold text-blue-700 uppercase hover:underline flex items-center gap-1">
                     <Globe size={12}/> Buscar na Rede
                  </button>
               </div>
               <table className="w-full text-left text-xs">
                  <thead className="bg-white border-b border-slate-200 text-slate-500 uppercase font-bold text-[9px] tracking-wider">
                     <tr><th className="px-6 py-3">Nome do Arquivo</th><th className="px-6 py-3">Origem</th><th className="px-6 py-3">Data</th><th className="px-6 py-3 text-right">Ação</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                     <tr>
                        <td className="px-6 py-3 font-bold">ECG_ADMISSAO.PDF</td>
                        <td className="px-6 py-3">UBS JARDIM DAS FLORES</td>
                        <td className="px-6 py-3">25/10/2024</td>
                        <td className="px-6 py-3 text-right"><button className="text-blue-600 hover:underline font-bold"><Download size={14}/></button></td>
                     </tr>
                  </tbody>
               </table>
            </div>
         )}

         {activeTab === 'TRAMITE' && (
            <div className="p-8">
               <div className="space-y-6 relative border-l-2 border-slate-200 ml-3 pl-8 py-2">
                  <div className="relative">
                     <div className="absolute -left-[41px] top-0 w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-sm"></div>
                     <p className="text-xs font-black text-slate-900 uppercase">Devolução para Complementação</p>
                     <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Hoje, 10:30 • Dr. Regulador</p>
                     <p className="text-sm bg-amber-50 p-3 border border-amber-100 rounded-sm text-amber-900">"{caseData.returnMessage}"</p>
                  </div>
                  <div className="relative">
                     <div className="absolute -left-[41px] top-0 w-4 h-4 bg-slate-300 rounded-full border-2 border-white"></div>
                     <p className="text-xs font-black text-slate-900 uppercase">Encaminhamento Criado</p>
                     <p className="text-[10px] text-slate-500 uppercase font-bold">25/10/2024 09:00 • Enf. Responsável</p>
                  </div>
               </div>
            </div>
         )}

      </div>
    </div>
  );
};
