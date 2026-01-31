
import React, { useState } from 'react';
import { 
  ArrowLeft, Activity, ShieldCheck, Globe, 
  MessageCircle, FileText, Zap,
  Navigation, MessageSquareText,
  Check, Building2, UserPlus,
  Trash2, Eye, History
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
  
  const patient = {
    name: 'MARIA APARECIDA DA SILVA',
    cpf: '123.456.789-00',
    cns: '700000123456789',
    specialty: 'CARDIOLOGIA',
    clinicalNote: 'Paciente apresenta dor precordial tipo queimação há 3 horas, irradiada para membro superior esquerdo. Troponina positiva no nó de origem. Histórico de HAS e Tabagismo. Solicito vaga para cateterismo.'
  };

  const handleExecution = () => {
    if (!eligibility) { alert('Selecione um veredito técnico (Passo 1).'); return; }
    
    if (eligibility === 'INAPTO') {
      openModal('NotificationRecusalModal', { patient: patient.name, id });
      return;
    } 
    
    if (eligibility === 'PENDENTE') {
      openModal('DocRequestModal', { patient: patient.name, id });
      return;
    }

    // Se APTO
    if (!priority) { alert('Defina a classificação de risco (Passo 2).'); return; }
    if (!justification) { alert('A justificativa técnica é obrigatória (Passo 3).'); return; }
    if (selectedVagas.length === 0) { alert('Selecione ao menos um prestador na Orquestração (Passo 5).'); return; }
    
    openModal('EligibilityModal', { patient: patient.name, eligibility, priority, justification, vagas: selectedVagas });
  };

  // Função auxiliar para abrir chat com contexto correto
  const handleOpenChat = (target: 'ORIGIN' | 'PROVIDER') => {
    openDrawer('CaseSummaryDrawer', { 
        id: id || 'REG-2024-891',
        title: 'Solicitação de Regulação',
        subtitle: patient.specialty,
        entity: target === 'ORIGIN' ? 'UBS JARDIM SUL' : (selectedVagas[0]?.name || 'Prestador'),
        priority: priority || 'A DEFINIR',
        status: eligibility || 'EM ANÁLISE',
        description: patient.clinicalNote, // Passando a descrição para o resumo
        patientName: patient.name, // Dados extras para o resumo
        patientCpf: patient.cpf,
        initialTab: 'CHAT',
        chatTarget: target // Flag para o Drawer saber o título
    });
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-20 font-sans text-slate-900">
      
      {/* HEADER DE CASO */}
      <div className="bg-white px-6 py-4 rounded-sm border border-slate-300 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 border border-slate-200 rounded-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase leading-none">{patient.name}</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase mt-1 tracking-widest">
               Protocolo: <span className="text-blue-700">{id || 'REG-2024-891'}</span> • {patient.specialty}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="text-right border-r border-slate-200 pr-6">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SLA Restante</p>
              <p className="text-lg font-black text-red-600 tabular-nums leading-none">00:42:15</p>
           </div>
           <div className="flex items-center gap-2">
             <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-full">
               <ShieldCheck size={16}/>
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Governança</p>
                <p className="text-[10px] font-bold text-emerald-700 uppercase">Sync OK</p>
             </div>
           </div>
        </div>
      </div>

      {/* CONTEXTO CLÍNICO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-6">
            
            {/* RESUMO CLÍNICO */}
            <section className="bg-slate-50 border border-slate-300 p-6 rounded-sm space-y-2">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14}/> Resumo Clínico (Origem)
               </h3>
               <p className="text-sm font-medium text-slate-800 leading-relaxed bg-white p-4 border border-slate-200 rounded-sm">
                  "{patient.clinicalNote}"
               </p>
            </section>

            {/* MATRIZ DE DECISÃO (GRID LAYOUT - SEM SCROLL) */}
            <section className="bg-white border-2 border-slate-800 rounded-sm overflow-hidden shadow-lg">
               {/* Header Grid */}
               <div className="grid grid-cols-6 bg-slate-100 border-b border-slate-200 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">
                  <div className="py-3 border-r border-slate-200">01. Veredito</div>
                  <div className="py-3 border-r border-slate-200">02. Risco</div>
                  <div className="py-3 border-r border-slate-200">03. Just.</div>
                  <div className="py-3 border-r border-slate-200">04. Busca</div>
                  <div className="py-3 border-r border-slate-200">05. Orquestra</div>
                  <div className="py-3">06. Executar</div>
               </div>

               {/* Body Grid */}
               <div className="grid grid-cols-6 p-2 gap-2 bg-slate-50 items-start">
                  
                  {/* Passo 1: Veredito */}
                  <div className="p-2">
                      <select 
                        value={eligibility || ''} 
                        onChange={e => setEligibility(e.target.value as any)} 
                        className="w-full p-2 border-2 border-slate-300 rounded-sm text-[10px] font-bold uppercase outline-none focus:border-blue-700 bg-white shadow-sm"
                      >
                         <option value="" disabled>SELECIONAR...</option>
                         <option value="APTO">APTO</option>
                         <option value="INAPTO">INAPTO</option>
                         <option value="PENDENTE">PENDENTE</option>
                      </select>
                  </div>

                  {/* Passo 2: Risco */}
                  <div className="p-2">
                      <select 
                        value={priority || ''} 
                        onChange={e => setPriority(e.target.value as any)} 
                        disabled={eligibility !== 'APTO'}
                        className="w-full p-2 border-2 border-slate-300 rounded-sm text-[10px] font-bold uppercase outline-none focus:border-blue-700 bg-white disabled:bg-slate-200 disabled:text-slate-400 shadow-sm"
                      >
                         <option value="" disabled>DEFINIR...</option>
                         <option value="ALTA">ALTA</option>
                         <option value="MÉDIA">MÉDIA</option>
                         <option value="BAIXA">BAIXA</option>
                      </select>
                  </div>

                  {/* Passo 3: Justificativa */}
                  <div className="p-2 flex justify-center">
                      <button 
                        onClick={() => openModal('JustificationModal', { text: justification, onSave: setJustification })} 
                        className={`w-full p-2 border-2 rounded-sm transition-all flex items-center justify-center shadow-sm ${justification ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-400 border-slate-300 hover:border-slate-500'}`}
                        title="Inserir Justificativa"
                      >
                         <MessageSquareText size={16}/>
                      </button>
                  </div>

                  {/* Passo 4: Busca */}
                  <div className="p-2">
                      <button 
                        onClick={() => navigate(`/regulator/case/${id}/search`)} 
                        className="w-full py-2 bg-white border border-slate-300 text-slate-700 font-bold text-[9px] uppercase hover:bg-slate-100 flex items-center justify-center gap-1 rounded-sm shadow-sm"
                      >
                         <Globe size={12}/> Docs ({attachedDocs.length})
                      </button>
                  </div>

                  {/* Passo 5: Orquestração */}
                  <div className="p-2">
                      <button 
                        onClick={() => navigate(`/regulator/case/${id}/orchestrate`)} 
                        disabled={eligibility !== 'APTO'}
                        className={`w-full py-2 border text-slate-700 font-bold text-[9px] uppercase flex items-center justify-center gap-1 rounded-sm shadow-sm transition-all ${
                            eligibility === 'APTO' 
                            ? 'bg-white border-slate-300 hover:bg-slate-100' 
                            : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                         <Navigation size={12}/> Vagas ({selectedVagas.length})
                      </button>
                  </div>

                  {/* Passo 6: Executar */}
                  <div className="p-2">
                      <button 
                        onClick={handleExecution} 
                        className="w-full py-2 bg-slate-900 text-white font-black text-[9px] uppercase hover:bg-blue-700 rounded-sm shadow-md transition-all flex items-center justify-center gap-1"
                      >
                         OK <Check size={12}/>
                      </button>
                  </div>

               </div>
            </section>

            {/* SEÇÃO DOCUMENTOS */}
            <section className="bg-white border border-slate-300 rounded-sm overflow-hidden">
               <div className="bg-slate-100 px-6 py-3 border-b border-slate-300 flex justify-between items-center">
                  <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                     <FileText size={14}/> Documentação do Caso
                  </h3>
               </div>
               <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-[9px] tracking-wider text-slate-500">
                     <tr>
                        <th className="px-6 py-3">Tipo</th>
                        <th className="px-6 py-3">Origem</th>
                        <th className="px-6 py-3">Data</th>
                        <th className="px-6 py-3 text-center">Status</th>
                        <th className="px-6 py-3 text-right">Ação</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                     {attachedDocs.length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400 italic font-medium">Nenhum documento vinculado. Utilize a Busca Federada.</td></tr>
                     )}
                     {attachedDocs.map(doc => (
                        <tr key={doc.id} className="hover:bg-slate-50">
                           <td className="px-6 py-3 font-bold uppercase">{doc.name}</td>
                           <td className="px-6 py-3 uppercase text-[10px]">{doc.node}</td>
                           <td className="px-6 py-3 font-mono text-[10px]">{doc.date}</td>
                           <td className="px-6 py-3 text-center"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-black uppercase">Verificado</span></td>
                           <td className="px-6 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                 <button onClick={() => openDrawer('ClinicalDetailDrawer', {...doc, hasOriginal: true})} className="text-slate-400 hover:text-blue-700"><Eye size={14}/></button>
                                 <button onClick={() => removeAttachedDoc(doc.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={14}/></button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </section>

         </div>

         {/* COLUNA DIREITA: COMUNICAÇÃO & HISTÓRICO */}
         <div className="space-y-6">
            <div className="bg-white border border-slate-300 rounded-sm p-6 space-y-4">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                  <MessageCircle size={14}/> Comunicação Oficial
               </h3>
               <div className="space-y-2">
                  <button onClick={() => handleOpenChat('ORIGIN')} className="w-full py-3 bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs uppercase hover:bg-blue-100 rounded-sm transition-all flex items-center justify-center gap-2">
                     <Building2 size={14}/> Falar com Origem (APS/UPA)
                  </button>
                  <button 
                    onClick={() => handleOpenChat('PROVIDER')} 
                    className="w-full py-3 bg-white text-slate-600 border border-slate-300 font-bold text-xs uppercase hover:bg-slate-50 rounded-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50" 
                    disabled={selectedVagas.length === 0}
                  >
                     <UserPlus size={14}/> Falar com Prestador
                  </button>
               </div>
               <p className="text-[9px] text-slate-400 italic text-center px-2">
                  "Toda mensagem trocada é anexada ao processo regulatório para fins de auditoria."
               </p>
            </div>

            <div className="bg-white border border-slate-300 rounded-sm p-0 overflow-hidden">
               <div className="bg-slate-100 px-6 py-3 border-b border-slate-300">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <History size={14}/> Linha do Tempo
                  </h3>
               </div>
               <div className="p-4 max-h-[300px] overflow-y-auto">
                  <div className="relative pl-4 border-l-2 border-slate-200 space-y-6">
                     <div className="relative">
                        <div className="absolute -left-[21px] top-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                        <p className="text-[10px] font-black text-slate-900 uppercase">Análise Iniciada</p>
                        <p className="text-[9px] font-mono text-slate-400">Agora • Regulador Central</p>
                     </div>
                     <div className="relative">
                        <div className="absolute -left-[21px] top-0 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></div>
                        <p className="text-[10px] font-black text-slate-900 uppercase">Solicitação Criada</p>
                        <p className="text-[9px] font-mono text-slate-400">Ontem, 14:30 • UPA Zona Sul</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
