
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Globe, Search, Filter, Microscope, 
  Image as ImageIcon, FileText, FileSearch, 
  ChevronDown, Eye, Plus, Clock, Database,
  ShieldCheck, Building2, Lock, Video, Mic,
  CheckCircle, Trash2
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ProviderFederatedSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // id será 'new' cuando venga del formulario de nuevo caso
  
  // Conexión con el Store Global para persistencia
  const { openDrawer, attachedDocs, addAttachedDoc, removeAttachedDoc, user } = useAppStore();
  
  const [filter, setFilter] = useState({ node: 'ALL', spec: 'ALL', category: 'ALL' });
  const [search, setSearch] = useState('');

  const isPatient = user?.role === 'PATIENT';

  const federatedLibrary = [
    { id: 'F1', name: 'TOMOGRAFIA COMPUTADORIZADA DE CRÂNIO (SEM CONTRASTE)', node: 'HOSPITAL DAS CLÍNICAS SP', type: 'IMAGEM', category: 'IMAGENS DICOM', date: '12/10/2024', spec: 'NEUROLOGIA' },
    { id: 'F2', name: 'TROPONINA I (DOSAGEM SÉRICA QUANTITATIVA)', node: 'LABORATÓRIO CENTRAL FEDERADO', type: 'LAB', category: 'EXAMES LABORATORIAIS', date: 'HOJE, 06:00', spec: 'CARDIOLOGIA' },
    { id: 'F3', name: 'ECOCARDIOGRAMA TRANSTORÁCICO COMPLETO', node: 'INSTITUTO DO CORAÇÃO (INCOR)', type: 'IMAGEM', category: 'IMAGENS DICOM', date: 'HÁ 2 DIAS', spec: 'CARDIOLOGIA' },
    { id: 'F4', name: 'RAIO-X DE TÓRAX (PA E PERFIL)', node: 'HOSPITAL REGIONAL NORTE', type: 'IMAGEM', category: 'IMAGENS DICOM', date: '14/10/2024', spec: 'PULMONOLOGIA' },
    { id: 'F5', name: 'HEMOGRAMA COMPLETO COM CONTAGEM DE PLAQUETAS', node: 'HOSPITAL GETÚLIO VARGAS', type: 'LAB', category: 'EXAMES LABORATORIAIS', date: 'ONTEM', spec: 'CLÍNICA GERAL' },
    { id: 'F6', name: 'LAUDO DE BIÓPSIA PULMONAR HISTOPATOLÓGICA', node: 'A.C. CAMARGO CANCER CENTER', type: 'LAUDO', category: 'LAUDOS TÉCNICOS', date: 'SETEMBRO/24', spec: 'ONCOLOGIA' },
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

  // Se añade al store global para que sea accesible en ProviderAttendancePage
  const handleToggleDoc = (doc: any) => {
    const isAttached = attachedDocs.find(d => d.id === doc.id);
    if (isAttached) {
      removeAttachedDoc(doc.id);
    } else {
      addAttachedDoc(doc);
    }
  };

  const handleFinish = () => {
    // Lógica de navegación robusta basada en el contexto de la URL
    if (location.pathname.includes('/upa/case/')) {
        // Retornar ao detalhe do caso UPA específico
        if (id === 'new') {
             navigate(-1); 
        } else {
             navigate(`/upa/case/${id}`);
        }
    } else if (location.pathname.includes('/upa/')) {
        // Fallback genérico UPA
        navigate('/upa/new-case');
    } else if (id === 'new') {
        // Novo caso APS
        navigate('/aps/new-case');
    } else if (location.pathname.includes('/patient/')) {
        // Retorno do paciente
        navigate('/patient/documents');
    } else if (location.pathname.includes('/provider/')) {
        navigate(-1);
    } else {
        navigate(-1);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-10 max-w-[1500px] mx-auto">
      
      {/* Header Profissional */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 flex flex-col lg:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-5">
          <button 
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
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">Histórico Digital Nacional • Dossiê Federado</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="w-full lg:w-[400px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar por nome do exame, especialidade ou nó..." 
              className="w-full pl-11 pr-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 transition-all shadow-inner" 
            />
          </div>
          <button 
            onClick={handleFinish}
            className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all"
          >
             {isPatient ? 'Voltar aos Documentos' : `Concluir (${attachedDocs.length})`} <CheckCircle size={16}/>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* FILTROS TÉCNICOS LATERAIS */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.2rem] p-6 shadow-sm">
             <div className="flex items-center gap-2 text-blue-600 font-black text-[9px] uppercase tracking-[0.3em] mb-6 border-b border-slate-100 pb-3">
               <Filter size={14}/> Filtros Assistenciais
             </div>

             <div className="space-y-6 uppercase font-black text-[8px]">
                <div className="space-y-2">
                   <label className="text-slate-400 tracking-widest px-1">Nó de Emissão Nacional</label>
                   <div className="relative">
                      <select value={filter.node} onChange={e => setFilter({...filter, node: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-bold outline-none appearance-none cursor-pointer focus:bg-white focus:border-blue-500 transition-all shadow-sm">
                         <option value="ALL">TODOS OS NÓS DA FEDERAÇÃO</option>
                         {Array.from(new Set(federatedLibrary.map(d => d.node))).map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14}/>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-slate-400 tracking-widest px-1">Especialidade Clínica</label>
                   <div className="relative">
                      <select value={filter.spec} onChange={e => setFilter({...filter, spec: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-bold outline-none appearance-none cursor-pointer focus:bg-white focus:border-blue-500 transition-all shadow-sm">
                         <option value="ALL">TODAS AS ESPECIALIDADES</option>
                         {Array.from(new Set(federatedLibrary.map(d => d.spec))).map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14}/>
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-slate-400 tracking-widest px-1">Tipologia Documental</label>
                   <div className="grid grid-cols-1 gap-1.5">
                      {[
                        { id: 'EXAMES LABORATORIAIS', label: 'EXAMES LABORATORIAIS', icon: <FileSearch size={12}/> },
                        { id: 'LAUDOS TÉCNICOS', label: 'LAUDOS E PARECERES', icon: <FileText size={12}/> },
                        { id: 'IMAGENS DICOM', label: 'EXAMES DE IMAGEM', icon: <ImageIcon size={12}/> },
                      ].map(cat => (
                        <button 
                          key={cat.id} 
                          onClick={() => setFilter({...filter, category: filter.category === cat.id ? 'ALL' : cat.id})}
                          className={`p-3 rounded-xl flex items-center justify-between transition-all border-2 text-left ${filter.category === cat.id ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-transparent text-slate-500 hover:border-slate-200 shadow-sm'}`}
                        >
                           <div className="flex items-center gap-3">
                              {cat.icon}
                              <span className="text-[9px] font-black uppercase tracking-widest">{cat.label}</span>
                           </div>
                           {filter.category === cat.id && <CheckCircle size={14}/>}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-[2.2rem] text-white space-y-4 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5"><Lock size={100}/></div>
             <h4 className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 relative z-10"><ShieldCheck size={14}/> Integridade Federada</h4>
             <p className="text-[10px] font-medium text-slate-400 leading-relaxed relative z-10 italic">"Cada consulta assistencial gera um rastro imutável no ledger nacional SUS."</p>
          </div>
        </div>

        {/* LISTA DE RESULTADOS TÉCNICOS */}
        <div className="lg:col-span-9">
           <div className="bg-white border border-slate-200 rounded-[2.2rem] overflow-hidden shadow-sm flex flex-col min-h-[600px]">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                 <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                   Registros Identificados na Rede ({filtered.length})
                 </h3>
                 <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                    <Clock size={12}/> Auditoria Live: Sincronizada
                 </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
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
                       {filtered.map(doc => {
                         const isAttached = !!attachedDocs.find(d => d.id === doc.id);
                         return (
                           <tr key={doc.id} className={`hover:bg-blue-50/20 transition-all group ${isAttached ? 'bg-blue-50/30' : ''}`}>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-5">
                                    <div className={`p-3 rounded-2xl transition-all shadow-sm border border-slate-100 ${isAttached ? 'bg-blue-600 text-white' : 'bg-white text-slate-300 group-hover:text-blue-600'}`}>
                                       {doc.category === 'IMAGENS DICOM' && <ImageIcon size={20}/>}
                                       {doc.category === 'EXAMES LABORATORIAIS' && <FileSearch size={20}/>}
                                       {doc.category === 'LAUDOS TÉCNICOS' && <FileText size={20}/>}
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
                                      className={`p-3 text-white rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2 group/btn ${isAttached ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-900 hover:bg-emerald-600'}`}
                                    >
                                       {isAttached ? <Trash2 size={20}/> : <Plus size={20} strokeWidth={3}/>}
                                       <span className="text-[9px] font-black uppercase tracking-widest hidden xl:inline">{isAttached ? 'Remover' : (isPatient ? 'Importar' : 'Anexar')}</span>
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         );
                       })}
                    </tbody>
                 </table>
              </div>

              {filtered.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-4">
                   <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center border-4 border-dashed border-slate-200 animate-pulse">
                     <Search size={40}/>
                   </div>
                   <div>
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Nenhum registro localizado</p>
                     <p className="text-[9px] text-slate-300 font-bold uppercase mt-2 tracking-widest">Refine os parâmetros de filtro ao lado</p>
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
