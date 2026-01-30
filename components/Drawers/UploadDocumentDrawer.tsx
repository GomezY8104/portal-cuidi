
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  UploadCloud, X, FileText, CheckCircle, 
  Loader2, AlertCircle, Trash2, ArrowRight,
  ShieldCheck, Info
} from 'lucide-react';

export const UploadDocumentDrawer: React.FC = () => {
  const { drawerData, closeDrawer } = useAppStore();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    // Simulação de upload seguro para o nó
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
    }, 2000);
  };

  const handleFinish = () => {
    alert('Documento enviado com sucesso para a rede federada!');
    closeDrawer();
  };

  return (
    <div className="p-10 h-full flex flex-col space-y-10">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
            <UploadCloud size={14} /> Upload Seguro CUIDI
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Anexar Documento</h2>
          <p className="text-slate-500 font-medium">Solicitação: <strong className="text-slate-900">{drawerData?.type || 'Documento Geral'}</strong></p>
        </div>
      </div>

      {!success ? (
        <div className="flex-1 flex flex-col space-y-8">
          <div 
            className={`border-4 border-dashed rounded-[3rem] flex-1 flex flex-col items-center justify-center p-10 transition-all cursor-pointer ${file ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'}`}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input 
              type="file" 
              id="fileInput" 
              className="hidden" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <div className="text-center space-y-4 animate-in zoom-in">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                  <FileText size={40} />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-lg">{file.name}</p>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF/JPG/PNG</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline flex items-center gap-1 mx-auto"
                >
                  Remover Arquivo <Trash2 size={12}/>
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-3xl flex items-center justify-center mx-auto">
                  <UploadCloud size={48} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xl">Clique ou arraste o arquivo</p>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">Formatos aceitos: PDF, JPG, PNG. Tamanho máximo: 10MB.</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4 text-blue-900">
             <ShieldCheck size={24} className="shrink-0 text-blue-600" />
             <p className="text-xs font-medium leading-relaxed">
               Este documento será armazenado no nó institucional requisitante com criptografia de ponta-a-ponta e registrado no seu histórico assistencial SUS.
             </p>
          </div>

          <button 
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full py-6 rounded-3xl font-black text-lg uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3 ${!file || uploading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}`}
          >
            {uploading ? (
              <><Loader2 className="animate-spin" size={24}/> Processando...</>
            ) : (
              <>Transmitir Documento <ArrowRight size={24}/></>
            )}
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in">
          <div className="w-32 h-32 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-200">
            <CheckCircle size={64} />
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">Sucesso!</h3>
            <p className="text-slate-500 text-lg font-medium max-w-xs mx-auto">Seu documento foi enviado e o regulador já foi notificado.</p>
          </div>
          <button 
            onClick={handleFinish}
            className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-lg uppercase tracking-widest shadow-xl"
          >
            Concluir Ação
          </button>
        </div>
      )}
    </div>
  );
};
