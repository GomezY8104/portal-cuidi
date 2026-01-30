
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Clock, ShieldCheck, Zap, 
  FileText, Activity, MessageSquare,
  Lock, Save, ArrowRight, User, Eye,
  Hospital, ClipboardCheck, Timer
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ProviderAttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { openDrawer } = useAppStore();

  return (
    <div className="animate-fade-in-up pb-20 space-y-8 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div className="flex items-center gap-6">
           <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-900 hover:text-white transition-all shadow-sm">
             <ArrowLeft size={18}/>
           </button>
           <div>
             <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Atendimento Assistencial em Curso</h1>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
               <ShieldCheck size={12} className="text-emerald-500"/> Sessão Ativa • Paciente: M.G.S (58 anos)
             </p>
           </div>
        </div>
        <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg font-black text-[9px] uppercase tracking-widest flex items-center gap-2 animate-pulse">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Executando Ato Assistencial
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-1 space-y-6">
           <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-widest">Dados Assistenciais</div>
              <div className="p-5 space-y-4">
                 <div>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Protocolo</p>
                   <p className="text-[11px] font-mono font-black text-blue-600 uppercase">#{id || 'UPA-901'}</p>
                 </div>
                 <div>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Profissional Logado</p>
                   <p className="text-[10px] font-black text-slate-700 uppercase">Dr. Alberto Cruz</p>
                 </div>
                 <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                       <p className="text-[7px] font-black text-slate-400 uppercase">Cronômetro Atendimento</p>
                       <p className="text-xs font-mono font-black text-slate-900">00:12:45</p>
                    </div>
                    <Timer size={16} className="text-blue-500" />
                 </div>
              </div>
           </section>

           <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-widest">Documentos Liberados</div>
              <div className="divide-y divide-slate-50">
                 {['ECG Admissão', 'Troponina I'].map((doc, idx) => (
                   <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer group" onClick={() => openDrawer('clinicalDetailDrawer')}>
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-tight">{doc}</span>
                      <Eye size={12} className="text-slate-300 group-hover:text-blue-600" />
                   </div>
                 ))}
              </div>
           </section>
        </div>

        <div className="lg:col-span-3 flex flex-col space-y-6">
           <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[500px]">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><MessageSquare size={14}/> Evolução Clínica em Tempo Real</h3>
                 <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Auto-save Habilitado</span>
              </div>
              <textarea 
                placeholder="Insira as notas assistenciais do procedimento..." 
                className="flex-1 p-10 outline-none text-sm font-medium leading-relaxed bg-slate-50/10 placeholder:text-slate-300 resize-none font-sans"
              />
              <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
                 <button className="px-6 py-2.5 bg-slate-100 text-slate-500 rounded font-black text-[9px] uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200">Suspender Sessão</button>
                 <button 
                  onClick={() => navigate(`/provider/case/${id}/feedback`)}
                  className="px-10 py-3 bg-slate-900 text-white rounded font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95"
                 >
                   Encerrar e Registrar Devolutiva <ArrowRight size={14}/>
                 </button>
              </div>
           </section>
           
           <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl flex gap-4 text-blue-900 items-start">
             <Lock size={20} className="shrink-0 text-blue-600 mt-1" />
             <p className="text-[10px] font-medium leading-relaxed italic">
               "Este ambiente de execução é auditado pelo ledger territorial. Toda alteração clínica é registrada com carimbo de tempo imutável."
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};
