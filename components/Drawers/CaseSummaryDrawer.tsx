
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Activity, User, MapPin, Clock, Building2, 
  MessageSquare, CheckCircle, Send, FileText,
  AlertCircle, X, Calendar, ArrowRight, Phone
} from 'lucide-react';

export const CaseSummaryDrawer: React.FC = () => {
  const { drawerData, closeDrawer } = useAppStore();
  
  // Inicializar pestaña activa basada en la data del drawer o por defecto RESUMO
  const [activeTab, setActiveTab] = useState<'RESUMO' | 'CHAT'>(drawerData?.initialTab || 'RESUMO');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const isScheduled = drawerData?.status === 'AGENDADO' && drawerData?.appointment;

  // Lógica para título dinâmico do Chat
  const getChatTitle = () => {
      if (drawerData?.chatTarget === 'ORIGIN') return 'Fale com a Unidade Solicitante (APS/UPA)';
      if (drawerData?.chatTarget === 'PROVIDER') return 'Fale com o Prestador';
      // Fallback genérico se não especificado (ex: visão do paciente)
      return 'Fale com a Regulação';
  };

  // Cargar historial si existe en los datos
  useEffect(() => {
    if (drawerData?.messages) {
      setChatHistory(drawerData.messages);
    }
    // Si viene la prop initialTab, forzar el cambio
    if (drawerData?.initialTab) {
        setActiveTab(drawerData.initialTab);
    }
  }, [drawerData]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const newMsg = { sender: 'VOCÊ', text: message, time: 'Agora' };
    setChatHistory([...chatHistory, newMsg]);
    setMessage('');
  };

  if (!drawerData) return null;

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      
      {/* Header del Drawer */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 text-white rounded-xl flex items-center justify-center shadow-sm ${isScheduled ? 'bg-emerald-600' : 'bg-slate-900'}`}>
            {isScheduled ? <Calendar size={20}/> : <Activity size={20} />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-none">
                {isScheduled ? 'Agendamento Confirmado' : 'Detalhes do Processo'}
            </h2>
            <p className="text-[10px] font-bold text-slate-500 tracking-wide mt-1 uppercase">Protocolo: #{drawerData.id}</p>
          </div>
        </div>
        <button onClick={closeDrawer} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><X size={20}/></button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('RESUMO')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'RESUMO' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/20' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Status & Resumo
        </button>
        <button 
          onClick={() => setActiveTab('CHAT')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'CHAT' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/20' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          {getChatTitle()}
          {chatHistory.length > 0 && <span className="ml-2 bg-red-500 text-white text-[8px] px-1.5 rounded-full">{chatHistory.length}</span>}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50/30">
        
        {/* CONTENIDO: RESUMO */}
        {activeTab === 'RESUMO' && (
          <div className="p-6 space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
             
             {/* Dados Principais do Proceso */}
             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Procedimento / Motivo</p>
                      <p className="text-sm font-bold text-slate-900">{drawerData.title || drawerData.subtitle || 'Regulação Geral'}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600`}>
                         {drawerData.status}
                      </span>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Unidade Responsável</p>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                         <Building2 size={12} className="text-slate-400"/> {drawerData.entity}
                      </div>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Prioridade</p>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${drawerData.priority === 'ALTA' || drawerData.priority === 'EMERGÊNCIA' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                         {drawerData.priority}
                      </span>
                   </div>
                </div>
             </div>

             {/* Informações do Paciente (Se disponíveis no contexto) */}
             {(drawerData.patientName || drawerData.patient) && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                   <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest px-1">Dados do Paciente</h3>
                   <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                         {(drawerData.patientName || drawerData.patient || 'P').charAt(0)}
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-800 uppercase">{drawerData.patientName || drawerData.patient}</p>
                         <p className="text-[10px] text-slate-500 font-mono">{drawerData.patientCpf || drawerData.cpf || 'CPF Oculto'}</p>
                      </div>
                   </div>
                </div>
             )}

             {/* Descrição Clínica (Se disponível) */}
             {(drawerData.description || drawerData.clinicalNote) && (
                <div className="space-y-2">
                   <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest px-1">Resumo Clínico</h3>
                   <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed font-medium italic shadow-sm">
                      "{drawerData.description || drawerData.clinicalNote}"
                   </div>
                </div>
             )}

             {/* Timeline Visual (Si existe) */}
             {drawerData.timeline && drawerData.timeline.length > 0 && (
               <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest px-1">Linha do Tempo</h3>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative pl-8">
                     <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100"></div>
                     <div className="space-y-6">
                        {drawerData.timeline.map((step: any, idx: number) => (
                           <div key={idx} className="relative flex items-start gap-4">
                              <div className={`absolute -left-[25px] w-4 h-4 rounded-full border-2 flex items-center justify-center bg-white ${step.done ? 'border-blue-600 text-blue-600' : 'border-slate-300 text-transparent'}`}>
                                 {step.done && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                              </div>
                              <div>
                                 <p className={`text-xs font-bold ${step.current ? 'text-blue-700' : 'text-slate-700'}`}>{step.status}</p>
                                 <p className="text-[10px] font-medium text-slate-400 mt-0.5">{step.date}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
             )}
          </div>
        )}

        {/* CONTENIDO: CHAT */}
        {activeTab === 'CHAT' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center mb-6">
                   <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-1">Canal Oficial</p>
                   <p className="text-xs text-blue-600 leading-relaxed">
                      Este canal registra todas as interações no Ledger para fins de auditoria.
                   </p>
                </div>

                {chatHistory.length === 0 && (
                   <div className="text-center py-10 opacity-50">
                      <MessageSquare size={32} className="mx-auto mb-2 text-slate-300"/>
                      <p className="text-xs font-medium text-slate-400">Nenhuma mensagem ainda.</p>
                   </div>
                )}
                {chatHistory.map((msg: any, idx: number) => (
                   <div key={idx} className={`flex flex-col ${msg.sender === 'VOCÊ' || msg.sender === 'PACIENTE' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium shadow-sm leading-relaxed ${msg.sender === 'VOCÊ' || msg.sender === 'PACIENTE' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                         {msg.text}
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 mt-1 px-1 uppercase">{msg.sender === 'PACIENTE' ? 'Você' : msg.sender} • {msg.time}</span>
                   </div>
                ))}
             </div>
             
             <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex gap-2">
                   <input 
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Digite sua resposta..." 
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-blue-500 transition-all"
                   />
                   <button onClick={handleSendMessage} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm active:scale-95">
                      <Send size={16}/>
                   </button>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};
