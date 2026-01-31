
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Globe, Search, Filter, 
  Image as ImageIcon, FileText, FileSearch, 
  ChevronDown, ChevronLeft, ChevronRight, Eye, Plus, Clock, Database,
  ShieldCheck, Building2, Lock, Video, Mic,
  CheckCircle, Trash2, X
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

/**
 * Página de Busca Técnica Federada.
 * Implementa filtrado avanzado multi-criterio, paginação e anexo persistente ao ledger global.
 */
export const FederatedSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { openDrawer, attachedDocs, addAttachedDoc, removeAttachedDoc, updateNewCaseData } = useAppStore();

  // 1. Estados de Filtros
  const [search, setSearch] = useState('');
  const [filterNode, setFilterNode] = useState('ALL');
  const [filterSpec, setFilterSpec] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');

  // 2. Estados de Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 3. Mock Data extendido para la red federada nacional
  const federatedLibrary = [
    { id: 'F1', name: 'TOMOGRAFIA COMPUTADORIZADA DE CRÂNIO (SEM CONTRASTE)', node: 'HOSPITAL DAS CLÍNICAS SP', category: 'EXAMES DE IMAGEM', spec: 'NEUROLOGIA', date: '12/10/2024' },
    { id: 'F2', name: 'TROPONINA I (DOSAGEM SÉRICA QUANTITATIVA)', node: 'LABORATÓRIO CENTRAL FEDERADO', category: 'EXAMES LABORATORIAIS', spec: 'CARDIOLOGIA', date: 'HOJE, 06:00' },
    { id: 'F3', name: 'ECOCARDIOGRAMA TRANSTORÁCICO COMPLETO', node: 'INSTITUTO DO CORAÇÃO (INCOR)', category: 'EXAMES DE IMAGEM', spec: 'CARDIOLOGIA', date: 'HÁ 2 DIAS' },
    { id: 'F4', name: 'RAIO-X DE TÓRAX (PA E PERFIL)', node: 'HOSPITAL REGIONAL NORTE', category: 'EXAMES DE IMAGEM', spec: 'PULMONOLOGIA', date: '14/10/2024' },
    { id: 'F5', name: 'HEMOGRAMA COMPLETO COM CONTAGEM DE PLAQUETAS', node: 'HOSPITAL GETÚLIO VARGAS', category: 'EXAMES LABORATORIAIS', spec: 'CLÍNICA GERAL', date: 'ONTEM' },
    { id: 'F6', name: 'LAUDO DE BIÓPSIA PULMONAR HISTOPATOLÓGICA', node: 'A.C. CAMARGO CANCER CENTER', category: 'LAUDOS TÉCNICOS', spec: 'ONCOLOGIA', date: 'SETEMBRO/24' },
    { id: 'F7', name: 'REGISTRO DE VÍDEO - CIRURGIA CARDÍACA MINIMAMENTE INVASIVA', node: 'INCOR SP', category: 'VÍDEOS E PROCEDIMENTOS', spec: 'CARDIOLOGIA', date: '10/09/2024' },
    { id: 'F8', name: 'GRAVAÇÃO DE TELECONSULTA - AVALIAÇÃO INICIAL', node: 'UBS JARDIM NORTE', category: 'ÁUDIOS E TELECONSULTA', spec: 'CLÍNICA GERAL', date: 'ONTEM, 14:00' },
    { id: 'F9', name: 'RESSONÂNCIA MAGNÉTICA DE JOELHO D', node: 'HOSPITAL ORTOPÉDICO', category: 'EXAMES DE IMAGEM', spec: 'ORTOPEDIA', date: '20/09/2024' },
    { id: 'F10', name: 'CULTURA DE URINA COM ANTIBIOGRAMA', node: 'LABORATÓRIO CENTRAL', category: 'EXAMES LABORATORIAIS', spec: 'UROLOGIA', date: '15/09/2024' },
    { id: 'F11', name: 'PARECER CARDIOLÓGICO PRÉ-OPERATÓRIO', node: 'INSTITUTO DO CORAÇÃO (INCOR)', category: 'LAUDOS TÉCNICOS', spec: 'CARDIOLOGIA', date: '10/09/2024' },
    { id: 'F12', name: 'ULTRASSONOGRAFIA ABDOME TOTAL', node: 'HOSPITAL REGIONAL NORTE', category: 'EXAMES DE IMAGEM', spec: 'GASTROENTEROLOGIA', date: '05/09/2024' },
  ];

  // 4. Lógica de Multifiltro Real (AND Logic)
  const filtered = useMemo(() => {
    return federatedLibrary.filter(doc => {
      const matchSearch = search === '' || doc.name.toLowerCase().includes(search.toLowerCase());
      const matchNode = filterNode === 'ALL' || doc.node === filterNode;
      const matchSpec = filterSpec === 'ALL' || doc.spec === filterSpec;
      const matchCategory = filterCategory === 'ALL' || doc.category === filterCategory;
      
      return matchSearch && matchNode && matchSpec && matchCategory;
    });
  }, [search, filterNode, filterSpec, filterCategory]);

  // Resetar página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterNode, filterSpec, filterCategory]);

  // Lógica de Paginação
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleToggleDoc = (doc: any) => {
    const isAttached = attachedDocs.find(d => d.id === doc.id);
    if (isAttached) {
      removeAttachedDoc(doc.id);
    } else {
      addAttachedDoc(doc);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setFilterNode('ALL');
    setFilterSpec('ALL');
    setFilterCategory('ALL');
  };

  const handleFinish = () => {
    // Si estamos en un flujo de "Nuevo Caso", forzamos el paso 4 (Documentos) en el store
    // para que al volver, la página NewCase.tsx renderice la pestaña correcta.
    if (window.location.hash.includes('/aps/case/new/search')) {
        updateNewCaseData({ step: 4 });
        navigate('/aps/new-case');
    } else {
        navigate(-1);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-10 max-w-[1500px] mx-auto">
      
      {/* HEADER DE BÚSQUEDA */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 flex flex-col xl:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-5">
          <button 
            type="button"
            onClick={handleFinish} 
            className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-md transition-all active:scale-90"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-600 text-white rounded-[1rem] flex items-center justify-center shadow-lg shadow-blue-200">
               <Globe size={24} />
             </div>
             <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">Busca Técnica Federada</h1>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">Histórico Digital Nacional • Ledger de Interoperabilidade</p>
             </div>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-4 w-full xl:max-w-2xl">
           <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar por CID, nome ou profissional..." 
              className="w-full pl-11 pr-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 transition-all shadow-inner" 
            />
          </div>
          <button 
            type="button"
            onClick={handleFinish}
            className="px-10 py-3.5 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-200 flex items-center gap-2 active:scale-95 transition-all hover:bg-blue-600"
          >
             Concluir Análise ({attachedDocs.length}) <CheckCircle size={16}/>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA DE FILTROS (SIDEBAR) */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.2rem] p-6 shadow-sm">
             <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
                <div className="flex items-center gap-2 text-blue-600 font-black text-[9px] uppercase tracking-[0.3em]">
                   <Filter size={14}/> Filtros Assistenciais
                </div>
                {(search || filterNode !== 'ALL' || filterSpec !== 'ALL' || filterCategory !== 'ALL') && (
                  <button onClick={clearFilters} className="text-[8px] font-black text-red-500 uppercase tracking-widest hover:underline flex items-center gap-1">
                    <X size={10}/> Limpar
                  </button>
                )}
             </div>

             <div className="space-y-6 uppercase font-black text-[8px]">
                {/* FILTRO 1: NÓ DE EMISSÃO */}
                <div className="space-y-2">
                   <label className="text-slate-400 tracking-widest px-1">Nó de Emissão Nacional</label>
                   <div className="relative">
                      <select 
                        value={filterNode} 
                        onChange={e => setFilterNode(e.target.value)} 
                        className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-bold outline-none appearance-none cursor-pointer focus:bg-white focus:border-blue-500 transition-all shadow-sm"
                      >
                         <option value="ALL">TODOS OS NÓS DA FEDERAÇÃO</option>
                         {Array.from(new Set(federatedLibrary.map(d => d.node))).map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14}/>
                   </div>
                </div>

                {/* FILTRO 2: ESPECIALIDADE */}
                <div className="space-y-2">
                   <label className="text-slate-400 tracking-widest px-1">Especialidade Clínica</label>
                   <div className="relative">
                      <select 
                        value={filterSpec} 
                        onChange={e => setFilterSpec(e.target.value)} 
                        className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-bold outline-none appearance-none cursor-pointer focus:bg-white focus:border-blue-500 transition-all shadow-sm"
                      >
                         <option value="ALL">TODAS AS ESPECIALIDADES</option>
                         {Array.from(new Set(federatedLibrary.map(d => d.spec))).map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14}/>
                   </div>
                </div>

                {/* FILTRO 3: TIPOLOGIA DOCUMENTAL */}
                <div className="space-y-2">
                   <label className="text-slate-400 tracking-widest px-1">Tipologia Documental</label>
                   <div className="relative">
                      <select 
                        value={filterCategory} 
                        onChange={e => setFilterCategory(e.target.value)} 
                        className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-bold outline-none appearance-none cursor-pointer focus:bg-white focus:border-blue-500 transition-all shadow-sm"
                      >
                         <option value="ALL">TODAS AS TIPOLOGIAS</option>
                         <option value="EXAMES LABORATORIAIS">EXAMES LABORATORIAIS</option>
                         <option value="EXAMES DE IMAGEM">EXAMES DE IMAGEM</option>
                         <option value="LAUDOS TÉCNICOS">LAUDOS E PARECERES</option>
                         <option value="VÍDEOS E PROCEDIMENTOS">VÍDEOS E PROCEDIMENTOS</option>
                         <option value="ÁUDIOS E TELECONSULTA">ÁUDIOS E TELECONSULTA</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14}/>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-[2.2rem] text-white space-y-4 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5"><Lock size={100}/></div>
             <h4 className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 relative z-10"><ShieldCheck size={14}/> Integridade Federada</h4>
             <p className="text-[10px] font-medium text-slate-400 leading-relaxed relative z-10 italic">"Cada consulta assistencial gera um rastro imutável no ledger nacional SUS."</p>
          </div>
        </aside>

        {/* LISTA DE RESULTADOS TÉCNICOS COM PAGINAÇÃO */}
        <div className="lg:col-span-9">
           <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col min-h-[600px]">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                 <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                   Registros Identificados ({filtered.length})
                 </h3>
                 <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                    <Clock size={12}/> Auditoria Live: Sincronizada
                 </div>
              </div>

              <div className="flex-1 overflow-x-auto custom-scrollbar">
                 <table className="w-full text-left border-collapse min-w-[850px] uppercase">
                    <thead>
                       <tr className="bg-slate-50/30 border-b border-slate-100">
                          <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Documento Assistencial</th>
                          <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Unidade Emissora (Nó)</th>
                          <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Data Emissão</th>
                          <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Análise</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {currentItems.map(doc => {
                         const isAttached = !!attachedDocs.find(d => d.id === doc.id);
                         return (
                           <tr key={doc.id} className="hover:bg-blue-50/20 transition-all group">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-5">
                                    <div className={`p-3 rounded-2xl transition-all shadow-sm border border-slate-100 ${isAttached ? 'bg-blue-600 text-white' : 'bg-white text-slate-300 group-hover:text-blue-600'}`}>
                                       {doc.category.includes('IMAGEM') && <ImageIcon size={20}/>}
                                       {doc.category.includes('LABORATORIAIS') && <FileSearch size={20}/>}
                                       {doc.category.includes('LAUDOS') && <FileText size={20}/>}
                                       {doc.category.includes('VÍDEOS') && <Video size={20}/>}
                                       {doc.category.includes('ÁUDIOS') && <Mic size={20}/>}
                                    </div>
                                    <div>
                                       <p className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md w-fit uppercase tracking-widest leading-none mb-2 border border-blue-100/50">{doc.spec}</p>
                                       <p className="font-black text-slate-900 text-sm uppercase tracking-tight group-hover:text-blue-900 transition-colors truncate max-w-[400px]">{doc.name}</p>
                                       <p className="text-[8px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{doc.category}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <p className="text-[10px] font-black text-slate-700 uppercase flex items-center gap-2 truncate max-w-[220px]">
                                    <Building2 size={12} className="text-slate-300"/> {doc.node}
                                 </p>
                              </td>
                              <td className="px-8 py-6">
                                 <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{doc.date}</p>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <div className="flex justify-end gap-2">
                                    <button onClick={() => openDrawer('ClinicalDetailDrawer', {...doc, detail: doc.name, hospital: doc.node, hasOriginal: true})} className="p-3 bg-white text-slate-300 hover:text-blue-600 rounded-xl border border-slate-200 transition-all active:scale-95 shadow-sm hover:shadow-md"><Eye size={20}/></button>
                                    <button 
                                      onClick={() => handleToggleDoc(doc)} 
                                      className={`p-3 rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2 group/btn ${isAttached ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' : 'bg-slate-900 text-white hover:bg-emerald-600'}`}
                                    >
                                       {isAttached ? <Trash2 size={20}/> : <Plus size={20} strokeWidth={3}/>}
                                       <span className="text-[9px] font-black uppercase tracking-widest hidden xl:inline">{isAttached ? 'Remover' : 'Anexar'}</span>
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         );
                       })}
                    </tbody>
                 </table>
              </div>

              {filtered.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-4">
                   <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center border-4 border-dashed border-slate-200 animate-pulse">
                     <Search size={40}/>
                   </div>
                   <div>
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Nenhum registro localizado</p>
                     <p className="text-[9px] text-slate-300 font-bold uppercase mt-2 tracking-widest">Refine os parâmetros de filtro ao lado</p>
                   </div>
                </div>
              ) : (
                /* Paginação */
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Exibindo {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filtered.length)} de {filtered.length} registros
                   </span>
                   <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-sm"
                      >
                        <ChevronLeft size={12}/> Anterior
                      </button>
                      <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-900 shadow-sm">
                         {currentPage} / {totalPages}
                      </div>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-sm"
                      >
                        Próximo <ChevronRight size={12}/>
                      </button>
                   </div>
                </div>
              )}
              
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-4">
                 <Database size={16} className="text-slate-400" />
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Acesso autorizado mediante finalidade assistencial (TRATAMENTO) registrada no ledger territorial.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
