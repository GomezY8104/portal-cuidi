
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, FileText, Download, ShieldCheck, ExternalLink, Printer, Info } from 'lucide-react';

export const ExamViewModal: React.FC = () => {
  const { modalData, closeModal } = useAppStore();
  const [loading, setLoading] = useState(false);

  if (!modalData) return null;

  return (
    <div className="flex flex-col h-[85vh] max-h-[800px]">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{modalData.title}</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Emitido por: {modalData.lab}</p>
          </div>
        </div>
        <button onClick={closeModal} className="p-3 hover:bg-white rounded-full transition-colors text-slate-400">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 bg-slate-200 overflow-y-auto p-10 flex flex-col items-center">
         {/* Simulador de PDF / Laudo */}
         <div className="bg-white w-full max-w-2xl min-h-[600px] shadow-2xl rounded-lg p-12 space-y-10 relative">
            <div className="absolute top-8 right-8 text-blue-100"><ShieldCheck size={80} /></div>
            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-8">
               <div className="font-black text-2xl tracking-tighter text-slate-900">LAUDO MÉDICO FEDERADO</div>
               <div className="text-right text-xs font-bold text-slate-400">ID: EX-{Math.floor(Math.random() * 999999)}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 text-sm">
               <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase">Paciente</p>
                 <p className="font-bold text-slate-900">MARIA SILVA</p>
               </div>
               <div className="text-right space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase">Data Coleta</p>
                 <p className="font-bold text-slate-900">{modalData.date}</p>
               </div>
            </div>

            <div className="py-10 space-y-6">
               <p className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Resultados</p>
               <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between border-b border-dashed border-slate-100 pb-2">
                     <span>PARÂMETRO CLÍNICO 01</span>
                     <span className="font-black">NORMAL</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-slate-100 pb-2">
                     <span>REFERÊNCIA CRUZADA</span>
                     <span className="font-black text-emerald-600">VERIFICADO</span>
                  </div>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed italic mt-10">
                 "Laudo gerado e assinado eletronicamente através do Nó de Origem federado à rede CUIDI."
               </p>
            </div>
         </div>
      </div>

      <div className="p-8 border-t border-slate-100 flex gap-4 bg-white">
        <button 
          onClick={() => window.print()}
          className="p-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
        >
          <Printer size={18} /> Imprimir
        </button>
        <button 
          className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all"
        >
          <Download size={20}/> Download Verificado
        </button>
      </div>
    </div>
  );
};
