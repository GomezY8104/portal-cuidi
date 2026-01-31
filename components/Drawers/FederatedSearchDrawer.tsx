
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, Search, Filter, Globe, Microscope, 
  Image as ImageIcon, Video, Mic, FileText, 
  FileSearch, ChevronDown, Eye, Plus,
  Database, Clock, ShieldCheck, Building2,
  Lock, ArrowRight, Zap, Check, Download
} from 'lucide-react';

export const FederatedSearchDrawer: React.FC = () => {
  const { closeDrawer, openDrawer, user, addAttachedDoc, addNotification } = useAppStore();
  const [filter, setFilter] = useState({ node: 'ALL', spec: 'ALL', category: 'ALL' });
  const [search, setSearch] = useState('');

  // Identificar si es un paciente
  const isPatient = user?.role === 'PATIENT';

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
      const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase());
      const matchNode = filter.node === 'ALL' || doc.node === filter.node;
      const matchSpec = filter.spec === 'ALL' || doc.spec === filter.spec;
      const matchCategory = filter.category === 'ALL' || doc.category === filter.category;
      return matchSearch && matchNode && matchSpec && matchCategory;
    });
  }, [filter, search]);

  const handleAction = (doc: any) => {
    if (isPatient) {
        addNotification({ type: 'success', message: 'Documento solicitado para importação ao seu Portal Pessoal. O nó de origem será notificado.' });
    } else {
        // Lógica de profissional (anexar ao store global)
        addAttachedDoc(doc);
        addNotification({ type: 'info', message: `Documento "${doc.name}" anexado ao prontuário.` });
    }
    closeDrawer();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Drawer Header - Technical White Style */}
      <div className="p-8 border-b border-slate-100 bg-slate-50/80 space-y-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${isPatient ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'}`}>
            <Globe size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight uppercase leading-none text-slate-900">
                {isPatient ? 'Minha Rede Federada' : 'Busca Federada de Histórico'}
            </h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                {isPatient ? 'Localize seus dados em qualquer hospital do SUS' : 'Acesso Seguro a Dados Assistenciais em Rede'}
            </p>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Nome do registro, tipo ou CID..." 
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 transition-all placeholder:text-slate-400 shadow-sm" 
          />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto bg-white flex flex-col custom-scrollbar p-0">
        <div className="p-6 border-b border-slate-50 bg-white/90 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Registros Localizados ({filtered.length})</h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded text-[8px] font-black uppercase tracking-widest border border-emerald-100">
             <Clock size={10}/> Sync: Agora
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30 border-b border-slate-50">
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Documento / Especialidade</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Origem / Nó</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(doc => (
              <tr key={doc.id} className="hover:bg-blue-50/20 transition-all group">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded text-slate-400 group-hover:text-blue-600 transition-colors">
                         {doc.category === 'IMAGEM' && <ImageIcon size={14}/>}
                         {doc.category === 'EXAME' && <FileSearch size={14}/>}
                         {doc.category === 'LAUDO' && <FileText size={14}/>}
                      </div>
                      <div className="overflow-hidden max-w-[200px]">
                         <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1 truncate">{doc.name}</p>
                         <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{doc.spec} • {doc.date}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 truncate max-w-[150px]">
                      <Building2 size={12} className="text-slate-300"/> {doc.node}
                   </p>
                </td>
                <td className="px-6 py-5 text-right">
                   <div className="flex justify-end gap-1">
                      <button onClick={() => openDrawer('ClinicalDetailDrawer', {...doc, detail: doc.name, hospital: doc.node, hasOriginal: true})} className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><Eye size={16}/></button>
                      <button 
                        onClick={() => handleAction(doc)} 
                        className={`p-2 rounded-lg transition-all shadow-sm active:scale-90 text-white ${isPatient ? 'bg-slate-900 hover:bg-slate-800' : 'bg-blue-600 hover:bg-blue-700'}`}
                        title={isPatient ? "Importar para Meu Portal" : "Anexar ao Caso"}
                      >
                         {isPatient ? <Download size={16} /> : <Plus size={16} strokeWidth={3}/>}
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-4">
             <div className="w-12 h-12 bg-slate-50 text-slate-200 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200"><Search size={24}/></div>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nenhum registro localizado</p>
          </div>
        )}
      </main>

      <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-4">
         <div className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <Lock size={18} className="text-slate-400 shrink-0 mt-0.5"/>
            <p className="text-[9px] font-medium text-slate-500 leading-relaxed italic">
                {isPatient 
                    ? "Ao importar um documento, você autoriza o nó de origem a compartilhar esta informação específica com seu repositório pessoal." 
                    : "O acesso a documentos federados gera um evento de auditoria prioritária notificado ao paciente em tempo real."}
            </p>
         </div>
         <button onClick={closeDrawer} className="w-full py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-colors">Fechar Painel</button>
      </div>
    </div>
  );
};
