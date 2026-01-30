
import React from 'react';
import { 
  FolderOpen, Search, Filter, Plus, 
  FileText, CheckCircle, Clock, 
  ChevronRight, UploadCloud, Trash2, 
  Download, History, AlertCircle, Info
} from 'lucide-react';
import { MOCK_DOC_REQUESTS } from '../../mocks/seed';
import { useAppStore } from '../../store/useAppStore';

export const PatientDocumentsPage: React.FC = () => {
  const { openDrawer } = useAppStore();

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-3">
            <FolderOpen size={16} /> Gestão Documental Federada
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Meus Documentos</h1>
          <p className="text-slate-500 mt-2 text-lg max-w-2xl font-medium">Responda a solicitações de reguladores e organize seus arquivos de saúde para agilizar atendimentos.</p>
        </div>
        <button 
          onClick={() => openDrawer('UploadDocumentDrawer')}
          className="px-10 py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-3"
        >
          <UploadCloud size={20} /> Novo Upload
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-slate-900">Resumo</h3>
            <div className="space-y-4">
              {[
                { label: 'Solicitações Pendentes', value: MOCK_DOC_REQUESTS.length, color: 'amber' },
                { label: 'Arquivos Enviados', value: '12', color: 'blue' },
                { label: 'Documentos Verificados', value: '08', color: 'emerald' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-500">{s.label}</span>
                  <span className={`text-lg font-black text-${s.color}-600`}>{s.value}</span>
                </div>
              ))}
            </div>
            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
               <p className="text-xs font-bold text-blue-900 leading-relaxed flex items-start gap-2">
                 <Info size={16} className="shrink-0" />
                 Arquivos são criptografados e visíveis apenas para nós autorizados com política assistencial ativa.
               </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-10">
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3"><AlertCircle className="text-amber-500" /> Ações Requeridas</h3>
            <div className="grid gap-4">
               {MOCK_DOC_REQUESTS.map((req) => (
                 <div key={req.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:shadow-xl transition-all border-l-8 border-l-amber-400">
                   <div className="flex items-center gap-6">
                     <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                       <FileText size={28} />
                     </div>
                     <div>
                       <h4 className="text-xl font-black text-slate-900">{req.documentType}</h4>
                       <p className="text-sm text-slate-500 font-medium">Para: {req.requester}</p>
                     </div>
                   </div>
                   <button 
                     onClick={() => openDrawer('UploadDocumentDrawer', { requestId: req.id, type: req.documentType })}
                     className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
                   >
                     Anexar Documento
                   </button>
                 </div>
               ))}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3"><History className="text-slate-400" /> Histórico de Envios</h3>
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
               <div className="divide-y divide-slate-50">
                 {[
                   { name: 'RG_Frente_Verso.pdf', date: '14 Out 2024', size: '1.2 MB', status: 'VERIFIED' },
                   { name: 'Comprovante_Residencia.jpg', date: '10 Out 2024', size: '2.4 MB', status: 'VERIFIED' },
                   { name: 'Encaminhamento_Medico.pdf', date: '05 Out 2024', size: '800 KB', status: 'PENDING' },
                 ].map((doc, i) => (
                   <div key={i} className="p-6 px-10 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{doc.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{doc.date} • {doc.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${doc.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {doc.status === 'VERIFIED' ? 'Verificado' : 'Em Análise'}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:text-blue-600 hover:bg-blue-50 transition-all"><Download size={18}/></button>
                          <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:text-red-600 hover:bg-red-50 transition-all"><Trash2 size={18}/></button>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
