
import React from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, User, Globe } from 'lucide-react';

export const TelemedicinePage: React.FC = () => {
  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Teleconsulta Federada</h1>
          <p className="text-slate-500 font-medium">Paciente: Maria Aparecida • Nó: Hospital das Clínicas</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full font-black text-[10px] uppercase border border-green-100">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Conexão Criptografada
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        <div className="lg:col-span-3 bg-slate-900 rounded-[3rem] relative overflow-hidden flex items-center justify-center shadow-2xl">
           <div className="text-center space-y-4">
             <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center text-slate-600 mx-auto">
               <User size={64} />
             </div>
             <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Aguardando Paciente...</p>
           </div>
           
           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
              <button className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all"><Mic size={24}/></button>
              <button className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all"><Video size={24}/></button>
              <button className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl transition-all shadow-xl shadow-red-900/40"><PhoneOff size={24}/></button>
           </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-200 flex flex-col overflow-hidden shadow-sm">
           <div className="p-6 border-b border-slate-50 font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
             <MessageSquare size={16} /> Chat & Notas
           </div>
           <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div className="bg-slate-50 p-4 rounded-2xl text-xs font-medium text-slate-600">O histórico clínico do paciente foi anexado automaticamente a esta sessão.</div>
           </div>
           <div className="p-6 border-t border-slate-50">
             <input type="text" placeholder="Escreva uma mensagem..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm" />
           </div>
        </div>
      </div>
    </div>
  );
};
