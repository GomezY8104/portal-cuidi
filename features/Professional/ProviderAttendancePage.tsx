import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Clock, ShieldCheck, Zap, 
  FileText, Activity, MessageSquare,
  Lock, Save, ArrowRight, User, Eye,
  Hospital, ClipboardCheck, Timer, Send,
  AlertCircle, CheckCircle, Database, Network,
  Info
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_PROVIDER_CASES } from '../../mocks/seed';

export const ProviderAttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { openDrawer, attachedDocs, removeAttachedDoc, user } = useAppStore();
  
  // 1. Obtener datos dinámicos del caso
  const caseData = useMemo(() => {
    return MOCK_PROVIDER_CASES.find(c => c.id === id) || {
      id: id || 'N/A',
      patientName: 'PACIENTE NÃO ENCONTRADO',
      age: 0,
      gender: 'N/A',
      specialty: 'GERAL',
      condition: 'N/A',
      priority: 'NORMAL',
      origin: 'DESCONHECIDO',
      description: 'Sem notas disponíveis.'
    };
  }, [id]);

  // 2. Estado del Chat
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'REGULADOR', text: 'Paciente autorizado. Por favor, confirmar admissão e iniciar protocolo clínico.', time: '10:00' },
    { sender: 'SISTEMA', text: 'Vínculo de agendamento confirmado no Ledger.', time: '10:05' }
  ]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatHistory([...chatHistory, { sender: 'VOCÊ', text: chatMessage, time: new Date().toLocaleTimeString().substring(0,5) }]);
    setChatMessage('');
  };

  return (
    <div className="animate-fade-in-up pb-20 space-y-6 max-w-[1600px] mx-auto font-sans text-slate-900">
      
      {/* HEADER DINÁMICO */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-200 pb-6 gap-6">
        <div className="flex items-center gap-6">
           <button onClick={() => navigate(-1)} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 hover:shadow-md transition-all">
             <ArrowLeft size={20}/>
           </button>
           <div>
             <div className="flex items-center gap-3 mb-1">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${caseData.priority === 'EMERGÊNCIA' || caseData.priority === 'ALTA' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                  {caseData.priority}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400">#{caseData.id}</span>
             </div>
             <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">{caseData.patientName}</h1>
             <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 flex items-center gap-2">
               <User size={14}/> {caseData.age} ANOS • {caseData.gender} • {caseData.specialty}
             </p>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="text-right hidden md:block">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tempo de Sala</p>
              <p className="text-xl font-black text-slate-900 font-mono">00:12:45</p>
           </div>
           <div className="px-5 py-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 animate-pulse shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Em Atendimento
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* COLUNA ESQUERDA (2/3): ÁREA CLÍNICA */}
        <div className="xl:col-span-2 space-y-8">
           
           {/* BLOQUE DE CONTEXTO CLÍNICO (NOTA ORIGINAL) */}
           <section className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 space-y-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <Info size={14} className="text-blue-600"/> Motivo do Encaminhamento / Nota de Origem
              </h3>
              <p className="text-sm font-medium text-slate-700 leading-relaxed italic bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                 "{caseData.description}"
              </p>
              <div className="flex gap-4">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg">Condição: {caseData.condition}</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg">Origem: {caseData.origin}</span>
              </div>
           </section>

           {/* 1. DOCUMENTOS ANEXADOS (DA BUSCA FEDERADA) */}
           <section className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="px-8 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={18} className="text-blue-600"/> Documentação Federada ({attachedDocs.length})
                 </h3>
                 <button onClick={() => navigate(`/provider/case/${id}/search`)} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                    <Database size={12}/> Buscar Mais
                 </button>
              </div>
              
              {attachedDocs.length === 0 ? (
                <div className="p-8 text-center">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nenhum documento vinculado à sessão.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                   {attachedDocs.map((doc, idx) => (
                     <div key={doc.id || idx} className="p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer group px-8" onClick={() => openDrawer('ClinicalDetailDrawer', { ...doc, detail: doc.name, hospital: doc.node, hasOriginal: true })}>
                        <div className="flex items-center gap-4">
                           <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                              <FileText size={16}/>
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-900 uppercase">{doc.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{doc.node || 'Rede Federada'} • {doc.date}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-[8px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded uppercase tracking-widest border border-emerald-100">Assinado</span>
                           <Eye size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </section>

           {/* 2. NOVA EVOLUÇÃO CLÍNICA */}
           <section className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 flex flex-col min-h-[500px]">
              <div className="px-8 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare size={18} className="text-emerald-600"/> Nova Evolução Clínica
                 </h3>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Lock size={10}/> Criptografia Ponta-a-Ponta
                 </span>
              </div>
              
              <div className="flex-1 p-8">
                 <textarea 
                   placeholder="Descreva a evolução clínica, procedimentos realizados e conduta..." 
                   className="w-full h-full p-6 outline-none text-sm font-medium leading-relaxed bg-slate-50 border border-slate-100 rounded-2xl placeholder:text-slate-300 resize-none focus:border-emerald-300 focus:bg-white transition-all shadow-inner"
                 />
              </div>

              <div className="p-6 border-t border-slate-100 bg-white flex justify-between items-center px-8">
                 <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-1"><User size={12}/> {user?.name}</span>
                    <span className="flex items-center gap-1"><Hospital size={12}/> {user?.nodeName}</span>
                 </div>
                 <div className="flex gap-3">
                    <button className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-200 transition-all">Salvar Rascunho</button>
                    <button 
                      onClick={() => navigate(`/provider/case/${id}/feedback`)}
                      className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95"
                    >
                      Encerrar Atendimento <ArrowRight size={14}/>
                    </button>
                 </div>
              </div>
           </section>
        </div>

        {/* COLUNA DIREITA (1/3): CHAT E INFO */}
        <div className="space-y-6">
           
           {/* CARD DE COMUNICAÇÃO (CHAT) */}
           <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col h-[600px] overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Network size={150} className="text-white"/></div>
              
              <div className="p-6 border-b border-white/10 bg-slate-950/30 flex justify-between items-center relative z-10">
                 <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                       <Zap size={14} className="text-amber-400 animate-pulse"/> Chat Regulador
                    </h3>
                    <p className="text-[8px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Complexo Regulador Estadual</p>
                 </div>
                 <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
              </div>

              <div className="flex-1 p-5 space-y-4 overflow-y-auto custom-scrollbar relative z-10">
                 {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.sender === 'VOCÊ' ? 'items-end' : 'items-start'}`}>
                       <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm ${
                          msg.sender === 'VOCÊ' 
                             ? 'bg-blue-600 text-white rounded-tr-none' 
                             : 'bg-white/10 text-slate-200 border border-white/5 rounded-tl-none'
                       }`}>
                          {msg.text}
                       </div>
                       <span className="text-[8px] font-black text-slate-500 mt-1 uppercase px-1">{msg.sender} • {msg.time}</span>
                    </div>
                 ))}
              </div>

              <div className="p-4 bg-slate-950/50 border-t border-white/10 relative z-10">
                 <div className="relative">
                    <input 
                      value={chatMessage}
                      onChange={e => setChatMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600" 
                      placeholder="Enviar mensagem..." 
                    />
                    <button onClick={handleSendMessage} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all shadow-lg active:scale-95">
                       <Send size={12}/>
                    </button>
                 </div>
              </div>
           </div>

           {/* INFO CARD */}
           <div className="p-6 bg-blue-50 border border-blue-100 rounded-[2rem] flex gap-4 text-blue-900 shadow-inner">
             <ShieldCheck size={24} className="shrink-0 text-blue-600 mt-1" />
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-blue-600">Auditoria Ativa</p>
                <p className="text-[10px] font-medium leading-relaxed italic opacity-80">
                  "Todo registro clínico nesta sessão é assinado digitalmente pelo seu certificado profissional e sincronizado com o Ledger Nacional."
                </p>
             </div>
           </div>

        </div>
      </div>
    </div>
  );
};