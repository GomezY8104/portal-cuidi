
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, Search, Filter, Globe, Microscope, 
  Image as ImageIcon, Video, Mic, FileText, 
  FileSearch, ChevronDown, Eye, Check, Plus,
  Database, Clock, ShieldCheck, Building2
} from 'lucide-react';

export const FederatedSearchModal: React.FC = () => {
  const { closeModal, modalData, openDrawer } = useAppStore();
  const [filter, setFilter] = useState({ node: 'ALL', spec: 'ALL', category: 'ALL' });

  const federatedLibrary = [
    { id: 'F1', name: 'Tomografia Crânio (S/ Contraste)', node: 'Hosp. Clínicas SP', type: 'IMAGEM', category: 'IMAGEM', date: '12/10/2024', spec: 'NEURO' },
    { id: 'F2', name: 'Troponina I (Dosagem Sérica)', node: 'Lab Central Federado', type: 'LAB', category: 'EXAME', date: 'Hoje, 06:00', spec: 'CARDIO' },
    { id: 'F3', name: 'Ecocardiograma Transtorácico', node: 'Inst. Coração (Incor)', type: 'IMAGEM', category: 'IMAGEM', date: 'Há 2 dias', spec: 'CARDIO' },
    { id: 'F4', name: 'Raio-X Tórax (PA/Lateral)', node: 'Hosp. Regional Norte', type: 'IMAGEM', category: 'IMAGEM', date: '14/10/2024', spec: 'PULMO' },
    { id: 'F5', name: 'Hemograma Completo c/ Plaquetas', node: 'Hosp. Getúlio Vargas', type: 'LAB', category: 'EXAME', date: 'Ontem', spec: 'GERAL' },
    { id: 'F6', name: 'Laudo Biópsia Pulmonar', node: 'A.C. Camargo Cancer', type: 'LAUDO', category: 'LAUDO', date: 'Setembro/24', spec: 'ONCO' },
  ];

  const filtered = useMemo(() => {
    return federatedLibrary.filter(doc => {
      const matchNode = filter.node === 'ALL' || doc.node === filter.node;
      const matchSpec = filter.spec === 'ALL' || doc.spec === filter.spec;
      const matchCategory = filter.category === 'ALL' || doc.category === filter.category;
      return matchNode && matchSpec && matchCategory;
    });
  }, [filter]);

  const handleSelect = (doc: any) => {
    if (modalData?.onSelect) {
      modalData.onSelect(doc);
    }
    closeModal();
  };

  return (
    <div className="flex flex-col h-[85vh]">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
            <Database size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Busca Técnica Federada</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Localização de Documentos Clínicos no Histórico Nacional</p>
          </div>
        </div>
        <button onClick={closeModal} className="p-2 hover:bg-white rounded-full text-slate-400 transition-all hover:text-slate-900"><X size={24}/></button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        <aside className="w-full md:w-[300px] bg-slate-50 border-r border-slate-100 p-8 space-y-6 overflow-y-auto">
          <div className="flex items-center gap-2 text-blue-600 font-black text-[9px] uppercase tracking-[0.3em] mb-4 border-b border-slate-200 pb-4"><Filter size={14}/> Parâmetros de Filtro</div>
          
          <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Nó de Emissão</label>
               <div className="relative">
                  <select value={filter.node} onChange={e => setFilter({...filter, node: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none appearance-none shadow-sm focus:border-blue-500">
                     <option value="ALL">Toda a Federação</option>
                     {Array.from(new Set(federatedLibrary.map(d => d.node))).map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14}/>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Especialidade Clínica</label>
               <div className="relative">
                  <select value={filter.spec} onChange={e => setFilter({...filter, spec: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none appearance-none shadow-sm focus:border-blue-500">
                     <option value="ALL">Todas as Áreas</option>
                     {Array.from(new Set(federatedLibrary.map(d => d.spec))).map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14}/>
               </div>
            </div>

            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Tipologia Documental</label>
               <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { id: 'EXAME', label: 'Laboratorial', icon: <FileSearch size={12}/> },
                    { id: 'LAUDO', label: 'Laudo/Parecer', icon: <FileText size={12}/> },
                    { id: 'IMAGEM', label: 'Imagem (DICOM)', icon: <ImageIcon size={12}/> },
                  ].map(cat => (
                    <button 
                      key={cat.id} 
                      onClick={() => setFilter({...filter, category: filter.category === cat.id ? 'ALL' : cat.id})}
                      className={`p-3 rounded-xl flex items-center gap-3 transition-all text-left border-2 ${filter.category === cat.id ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-transparent text-slate-500 hover:border-slate-200 shadow-sm'}`}
                    >
                       {cat.icon}
                       <span className="text-[9px] font-black uppercase tracking-widest">{cat.label}</span>
                    </button>
                  ))}
               </div>
            </div>
          </div>
          
          <div className="pt-10">
             <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-inner">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={12} className="text-emerald-500"/> Trust Verified</p>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">Os documentos listados possuem integridade garantida pela assinatura digital do nó emissor.</p>
             </div>
          </div>
        </aside>

        <main className="flex-1 p-0 overflow-y-auto bg-white flex flex-col">
          <div className="p-8 border-b border-slate-50 bg-slate-50/20 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
              Documentos Localizados ({filtered.length})
            </h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
               <Clock size={12}/> Última Sincronização: Agora
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {filtered.map(doc => (
              <div key={doc.id} className="p-6 px-10 flex items-center justify-between group hover:bg-blue-50/20 transition-all border-l-4 border-transparent hover:border-blue-600 cursor-pointer">
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-8 flex-1 items-center">
                    <div className="md:col-span-6 flex items-center gap-5">
                        <div className="p-3 bg-white rounded-2xl text-slate-300 group-hover:text-blue-600 shadow-sm border border-slate-100 transition-all">
                           {doc.category === 'IMAGEM' && <ImageIcon size={18}/>}
                           {doc.category === 'EXAME' && <FileSearch size={18}/>}
                           {doc.category === 'LAUDO' && <FileText size={18}/>}
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md w-fit uppercase tracking-widest leading-none mb-1.5 border border-blue-100/50">{doc.spec}</p>
                           <p className="font-black text-slate-900 text-sm uppercase tracking-tight group-hover:text-blue-900 transition-colors truncate">{doc.name}</p>
                        </div>
                    </div>
                    <div className="md:col-span-4">
                       <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Nó Assistencial Emissor</p>
                       <p className="font-black text-slate-700 text-xs uppercase truncate flex items-center gap-2">
                          {/* fix: Added missing Building2 icon to lucide-react imports */}
                          <Building2 size={12} className="text-slate-300"/> {doc.node}
                       </p>
                    </div>
                    <div className="md:col-span-2">
                       <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Data Emissão</p>
                       <p className="font-black text-emerald-600 text-[10px] uppercase">{doc.date}</p>
                    </div>
                 </div>
                 <div className="flex gap-2 ml-10">
                    <button onClick={() => openDrawer('ClinicalDetailDrawer', {...doc, detail: doc.name, hospital: doc.node, hasOriginal: true})} className="p-3 bg-white text-slate-400 hover:text-blue-600 rounded-xl border border-slate-200 transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95"><Eye size={16}/></button>
                    <button onClick={() => handleSelect(doc)} className="p-3 bg-slate-900 text-white hover:bg-blue-600 rounded-xl transition-all shadow-lg hover:shadow-blue-200 hover:scale-105 active:scale-95">
                       <Plus size={16} strokeWidth={3}/>
                    </button>
                 </div>
              </div>
            ))}
          </div>
          
          {filtered.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-4">
               <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200"><Search size={32}/></div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Nenhum documento localizado com os filtros atuais</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
