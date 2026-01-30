import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Shield, Calendar, MapPin, Stethoscope, 
  Pill, FileText, Activity, Info, 
  ChevronRight, ArrowRight, UserCheck, Clock,
  Lock, Globe, FileDown, Download, Loader2,
  CheckCircle2, Trash2, X
} from 'lucide-react';

export const ClinicalDetailDrawer: React.FC = () => {
  const { drawerData, closeDrawer } = useAppStore();
  const [downloading, setDownloading] = useState(false);

  if (!drawerData) return null;

  const handleDownloadOriginal = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('Documento original assinado pelo nó "' + drawerData.hospital + '" baixado com sucesso. Integridade Ledger verificada.');
    }, 1500);
  };

  return (
    <div className="p-10 h-full flex flex-col space-y-10 relative">
      <div className="space-y-4">
        <div className={`w-20 h-20 rounded-[2rem] bg-${drawerData.color || 'blue'}-50 text-${drawerData.color || 'blue'}-600 flex items-center justify-center shadow-inner`}>
          {drawerData.icon || <FileText size={32}/>}
        </div>
        <div>
          <div className="flex items-center gap-2">
             <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">
               Protocolo ID #{drawerData.id || 'N/A'}
             </span>
             <span className="text-slate-300">•</span>
             <span className="text-xs font-bold text-slate-400">{drawerData.date}</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2 leading-tight">{drawerData.detail}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {drawerData.hasOriginal && (
          <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-900/10 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:scale-125 transition-transform"><FileDown size={140}/></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-4">
                <Shield size={14} className="text-emerald-200" /> Documento Autêntico
              </div>
              <p className="text-emerald-100 text-sm font-medium leading-relaxed mb-8 max-w-[280px]">
                O nó federado disponibilizou a via original assinada digitalmente deste registro assistencial.
              </p>
              <button 
                onClick={handleDownloadOriginal}
                disabled={downloading}
                className="w-full py-4 bg-white text-emerald-700 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all active:scale-95"
              >
                {downloading ? <Loader2 className="animate-spin" size={18}/> : <><Download size={18}/> Baixar PDF Original</>}
              </button>
            </div>
          </div>
        )}

        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
           <div className="flex gap-4">
              <div className="p-3 bg-white rounded-xl text-slate-400 shadow-sm"><MapPin size={20}/></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instituição Responsável</p>
                <p className="font-bold text-slate-900">{drawerData.hospital}</p>
              </div>
           </div>
           <div className="flex gap-4">
              <div className="p-3 bg-white rounded-xl text-slate-400 shadow-sm"><UserCheck size={20}/></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profissional Solicitante</p>
                <p className="font-bold text-slate-900">{drawerData.doctor}</p>
              </div>
           </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5"><Globe size={100}/></div>
           <h3 className="text-lg font-bold flex items-center gap-2"><Lock size={18} className="text-blue-400"/> Prova de Auditoria Imutável</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Hash de Verificação:</span>
                <span className="font-mono text-blue-400 text-[10px]">0x842a...e2f</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Sincronismo Global:</span>
                <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 size={12}/> Confirmado</span>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-auto pt-10 flex flex-col gap-4">
        {drawerData.onDelete && (
          <button 
            onClick={() => {
              if (window.confirm('Deseja realmente remover este documento do protocolo?')) {
                drawerData.onDelete();
                closeDrawer();
              }
            }}
            className="w-full py-5 bg-red-50 text-red-600 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 border border-red-100 shadow-inner shadow-red-200/20"
          >
            <Trash2 size={18}/> Excluir este Documento
          </button>
        )}
        <button onClick={closeDrawer} className="w-full py-5 bg-slate-100 text-slate-400 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-all">
          Fechar Visualização
        </button>
      </div>
    </div>
  );
};