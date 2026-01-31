
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Terminal, Database, Send, 
  Sparkles, Server, BarChart3, MessageSquare,
  Copy, Check, RefreshCw, HelpCircle, X, ArrowRight
} from 'lucide-react';
import { sendFederationMessage } from '../../services/geminiService';

// Mock de dados do sistema para o Analista de Dados
const MOCK_SYSTEM_SNAPSHOT = {
  kpis: {
    activeNodes: 1248,
    requests24h: 42109,
    avgLatency: "24ms",
    blockedRequests: 142
  },
  recentAlerts: [
    { type: "Security", msg: "Tentativa de acesso sem token no Nó SP-01" },
    { type: "Performance", msg: "Latência alta no serviço de Ledger (120ms)" }
  ],
  topSpecialties: ["Cardiologia", "Ortopedia", "Neurologia"]
};

type AssistantMode = 'API_SUPPORT' | 'DATA_INSIGHTS';

interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  time: string;
}

// Configuração de Ajuda e Prompts (Traduzido para Português)
const HELP_SECTIONS = [
  {
    mode: 'API_SUPPORT',
    title: 'Especialista em Integração & APIs',
    desc: 'Assistência técnica para conectar novos nós, depurar erros HTTP/mTLS e validar esquemas JSON.',
    prompts: [
      "Me dê um exemplo de cURL para o endpoint /v1/connect usando mTLS.",
      "Estou recebendo erro 403 Forbidden ao tentar registrar um log. Quais as causas prováveis?",
      "Gere um esquema JSON válido para um evento de auditoria FHIR R4.",
      "Como configuro os certificados A3 para assinar tokens JWT?"
    ]
  },
  {
    mode: 'DATA_INSIGHTS',
    title: 'Analista de Dados Operacionais',
    desc: 'Interpretação de métricas de desempenho, detecção de anomalias em logs e resumo de KPIs.',
    prompts: [
      "Analise as tendências de latência atuais. Há algum gargalo?",
      "Resuma os alertas de segurança recentes e sugira mitigações.",
      "Qual é a especialidade médica com maior demanda hoje?",
      "Compare o volume de solicitações bloqueadas vs aprovadas."
    ]
  }
];

export const CodeAuditPage: React.FC = () => {
  const [mode, setMode] = useState<AssistantMode>('API_SUPPORT');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'AI',
      text: 'Olá, Administrador. Sou o Copiloto da Federação CUIDI. \n\nPosso ajudar com a **Documentação da API de Integração** ou analisar os **Indicadores do Sistema**. O que você precisa?',
      time: new Date().toLocaleTimeString().substring(0, 5)
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'USER',
      text: input,
      time: new Date().toLocaleTimeString().substring(0, 5)
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Seleciona os dados baseados no modo
    const contextData = mode === 'DATA_INSIGHTS' ? MOCK_SYSTEM_SNAPSHOT : null;

    const aiResponseText = await sendFederationMessage(userMsg.text, mode, contextData);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'AI',
      text: aiResponseText || "Não consegui processar sua solicitação.",
      time: new Date().toLocaleTimeString().substring(0, 5)
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleModeSwitch = (newMode: AssistantMode) => {
    setMode(newMode);
    setMessages([{
      id: Date.now().toString(),
      sender: 'AI',
      text: newMode === 'API_SUPPORT' 
        ? "Modo: **Especialista em Integração**. \nPergunte sobre endpoints, autenticação mTLS ou erros de conexão."
        : "Modo: **Analista de Dados**. \nEstou lendo os KPIs em tempo real. Pergunte sobre volume de requisições, segurança ou tendências.",
      time: new Date().toLocaleTimeString().substring(0, 5)
    }]);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-500 gap-6 relative">
      
      {/* HEADER & MODE SWITCHER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Sparkles className="text-indigo-600" /> Copiloto Federado
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Inteligência Artificial para suporte à operação e interoperabilidade.</p>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex bg-slate-200 p-1 rounded-xl">
             <button 
               onClick={() => handleModeSwitch('API_SUPPORT')}
               className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${mode === 'API_SUPPORT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <Terminal size={14} /> Integração & API
             </button>
             <button 
               onClick={() => handleModeSwitch('DATA_INSIGHTS')}
               className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${mode === 'DATA_INSIGHTS' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <BarChart3 size={14} /> Análise de Dados
             </button>
           </div>
           
           <button 
             onClick={() => setShowHelp(true)}
             className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all"
             title="Biblioteca de Prompts"
           >
             <HelpCircle size={20}/>
           </button>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden flex flex-col relative">
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50">
           {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] md:max-w-[60%] flex gap-4 ${msg.sender === 'USER' ? 'flex-row-reverse' : 'flex-row'}`}>
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'USER' ? 'bg-slate-900 text-white' : mode === 'API_SUPPORT' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}`}>
                      {msg.sender === 'USER' ? <MessageSquare size={18}/> : <Bot size={20}/>}
                   </div>
                   
                   <div className={`space-y-1 ${msg.sender === 'USER' ? 'items-end flex flex-col' : 'items-start flex flex-col'}`}>
                      <div className={`p-5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                        msg.sender === 'USER' 
                          ? 'bg-slate-900 text-white rounded-tr-none' 
                          : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                      }`}>
                         {msg.text}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                        {msg.sender === 'USER' ? 'Você' : 'Assistente'} • {msg.time}
                      </span>
                   </div>
                </div>
             </div>
           ))}
           {loading && (
             <div className="flex justify-start">
               <div className="max-w-[60%] flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 animate-pulse ${mode === 'API_SUPPORT' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                     <RefreshCw size={18} className="animate-spin"/>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                     <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                     <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                     <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                  </div>
               </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-100">
           <div className="flex gap-4">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={mode === 'API_SUPPORT' ? "Ex: Como autenticar um novo nó?" : "Ex: Analise o tempo médio de resposta hoje..."}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all shadow-inner"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className={`p-4 rounded-2xl text-white shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${mode === 'API_SUPPORT' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'}`}
              >
                 <Send size={20}/>
              </button>
           </div>
           <div className="mt-3 flex gap-4 justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1"><Server size={10}/> Modelo: Gemini 1.5 Flash</span>
              <span className="flex items-center gap-1"><Database size={10}/> Contexto: {mode === 'API_SUPPORT' ? 'Docs Técnicos v3.1' : 'Live Dashboard Snapshot'}</span>
           </div>
        </div>

        {/* DRAWER DE AJUDA / PROMPTS (TRADUZIDO) */}
        {showHelp && (
          <div className="absolute inset-0 z-50 flex justify-end">
             <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setShowHelp(false)} />
             <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                   <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
                      <HelpCircle size={16}/> Guia de Prompts
                   </div>
                   <button onClick={() => setShowHelp(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"><X size={20}/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                   <p className="text-slate-500 text-xs font-medium leading-relaxed">
                      Utilize estes comandos predefinidos para interagir eficientemente com o modelo de acordo com o contexto ativo. Copie e cole no chat.
                   </p>

                   {HELP_SECTIONS.map((section) => (
                      <div key={section.mode} className={`p-5 rounded-2xl border-2 ${mode === section.mode ? 'bg-slate-50 border-indigo-100' : 'bg-white border-slate-100 opacity-60 hover:opacity-100 transition-opacity'}`}>
                         <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-lg text-white ${section.mode === 'API_SUPPORT' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                               {section.mode === 'API_SUPPORT' ? <Terminal size={16}/> : <BarChart3 size={16}/>}
                            </div>
                            <div>
                               <h3 className="text-xs font-black text-slate-900 uppercase">{section.title}</h3>
                               <p className="text-[10px] text-slate-400 font-bold">Contexto Ativo</p>
                            </div>
                         </div>
                         <p className="text-[10px] text-slate-500 mb-4 leading-relaxed border-b border-slate-200 pb-3">
                            {section.desc}
                         </p>
                         <div className="space-y-2">
                            {section.prompts.map((prompt, idx) => (
                               <button 
                                 key={idx}
                                 onClick={() => handleCopy(prompt)}
                                 className="w-full text-left p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all group relative"
                               >
                                  <p className="text-[10px] font-medium text-slate-700 pr-6 leading-tight">{prompt}</p>
                                  <div className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300 group-hover:text-indigo-600">
                                     {copiedText === prompt ? <Check size={14}/> : <Copy size={14}/>}
                                  </div>
                               </button>
                            ))}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};
