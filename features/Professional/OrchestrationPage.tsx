
import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Navigation, Search, Filter, 
  Building2, MapPin, Clock, 
  CheckCircle, Zap, Radio, BarChart3,
  ArrowUpRight, ShieldCheck, Check,
  AlertCircle, Globe, ListChecks, Stethoscope,
  Database, FileText, FileSearch, ImageIcon
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const OrchestrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedVagas, setSelectedVagas } = useAppStore();
  
  // Estados de Filtros (Nodos, Especialidades e Riscos - Mantidos conforme solicitado)
  const [search, setSearch] = useState('');
  const [filterNode, setFilterNode] = useState('ALL');
  const [filterSpec, setFilterSpec] = useState('ALL');
  const [filterRisk, setFilterRisk] = useState('ALL');

  const providers = [
    { id: 'H1', name: 'HOSPITAL CENTRAL DE REFERÊNCIA', node: 'Nó São Paulo', spec: 'CARDIOLOGIA', type: 'HOSPITAL', territory: 'ZONA CENTRAL', availability: '12 LEITOS', load: 85, distance: '1.2KM', tmr: '15M', risk: 'VERMELHO' },
    { id: 'H2', name: 'INSTITUTO DANTE PAZZANESE', node: 'Nó São Paulo', spec: 'CARDIOLOGIA', type: 'ESPECIALIZADO', territory: 'ZONA SUL', availability: '03 VAGAS', load: 92, distance: '8.4KM', tmr: '12M', risk: 'LARANJA' },
    { id: 'C1', name: 'CLÍNICA CARDIO CARE SUL', node: 'Nó Metropolitano', spec: 'CARDIOLOGIA', type: 'AMBULATÓRIO', territory: 'ZONA OESTE', availability: 'ABERTO', load: 45, distance: '4.5KM', tmr: '45M', risk: 'AMARELO' },
    { id: 'H3', name: 'SANTA CASA REGIONAL', node: 'Nó Norte', spec: 'TRAUMA', type: 'HOSPITAL', territory: 'ZONA NORTE', availability: 'LOTADO', load: 100, distance: '12.0KM', tmr: '1H', risk: 'VERMELHO' },
    { id: 'H4', name: 'HOSPITAL INFANTIL FEDERADO', node: 'Nó Estadual', spec: 'PEDIATRIA', type: 'ESPECIALIZADO', territory: 'ZONA LESTE', availability: '05 VAGAS', load: 60, distance: '15.0KM', tmr: '20M', risk: 'VERDE' },
  ];

  const filtered = useMemo(() => {
    return providers.filter(p => {
      const matchSearch = search === '' || p.name.toLowerCase().includes(search.toLowerCase());
      const matchNode = filterNode === 'ALL' || p.node === filterNode;
      const matchSpec = filterSpec === 'ALL' || p.spec === filterSpec;
      const matchRisk = filterRisk === 'ALL' || p.risk === filterRisk;
      
      return matchSearch && matchNode && matchSpec && matchRisk;
    });
  }, [search, filterNode, filterSpec, filterRisk]);

  const toggleVaga = (vaga: any) => {
    if (selectedVagas.find(v => v.id === vaga.id)) {
      setSelectedVagas(selectedVagas.filter(v => v.id !== vaga.id));
    } else {
      setSelectedVagas([...selectedVagas, vaga]);
    }
  };

  const handleSelectAll = () => {
    if (selectedVagas.length === filtered.length) setSelectedVagas([]);
    else setSelectedVagas(filtered);
  };

  const riskColors: Record<string, string> = {
    VERMELHO: 'bg-red-600',
    LARANJA: 'bg-orange-500',
    AMARELO: 'bg-yellow-400',
    VERDE: 'bg-green-500'
  };

  return (
    <div className="space-y-4 animate-fade-in-up pb-10">
      
      {/* Header Profissional - Funcionalidade de Voltar Garantida */}
      <div className="bg-white p-5 rounded-[2.5rem] border border-slate-200 flex flex-col lg:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => navigate(-1)} 
            className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-white hover:shadow-md transition-all active:scale-90"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg">
               <Navigation size={20} />
             </div>
             <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-none">Orquestração de Oferta</h1>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Busca em Nós Federados por Carga e Eficiência</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="CNES, Unidade ou Município..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500 transition-all shadow-inner" 
            />
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all"
          >
             Anexar Seleção ({selectedVagas.length}) <CheckCircle size={14}/>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* SIDEBAR DE FILTROS - 100% DROPDOWN */}
        <aside className="lg:col-span-3 space-y-4">
           <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-emerald-600 font-black text-[8px] uppercase tracking-[0.3em] mb-2 border-b border-slate-100 pb-2">
                 <Filter size={12}/> Painel de Orquestração
              </div>
              
              {/* 1. Nodos da Federação */}
              <div className="space-y-1.5">
                 <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2"><Globe size={10}/> Nós da Federação</label>
                 <select value={filterNode} onChange={e => setFilterNode(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black uppercase outline-none cursor-pointer hover:bg-white transition-colors">
                    <option value="ALL">Todos os Nós Federados</option>
                    <option value="Nó São Paulo">Nó São Paulo (Regional 01)</option>
                    <option value="Nó Metropolitano">Nó Metropolitano</option>
                    <option value="Nó Norte">Nó Regional Norte</option>
                    <option value="Nó Estadual">Nó Estadual Central</option>
                 </select>
              </div>

              {/* 2. Especialidades */}
              <div className="space-y-1.5">
                 <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2"><Stethoscope size={10}/> Especialidade Assistencial</label>
                 <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black uppercase outline-none cursor-pointer hover:bg-white transition-colors">
                    <option value="ALL">Qualquer Especialidade</option>
                    <option value="CARDIOLOGIA">Cardiologia</option>
                    <option value="TRAUMA">Trauma / Ortopedia</option>
                    <option value="PEDIATRIA">Pediatria</option>
                    <option value="NEURO">Neurologia</option>
                 </select>
              </div>

              {/* 3. Riscos */}
              <div className="space-y-1.5">
                 <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2"><AlertCircle size={10}/> Classificação Manchester</label>
                 <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black uppercase outline-none cursor-pointer hover:bg-white transition-colors">
                    <option value="ALL">Todos os Riscos</option>
                    <option value="VERMELHO">Emergência (Vermelho)</option>
                    <option value="LARANJA">Muito Urgente (Laranja)</option>
                    <option value="AMARELO">Urgente (Amarelo)</option>
                    <option value="VERDE">Pouco Urgente (Verde)</option>
                 </select>
              </div>

              <button 
                onClick={() => { setSearch(''); setFilterNode('ALL'); setFilterSpec('ALL'); setFilterRisk('ALL'); }}
                className="w-full py-2 text-[8px] font-black text-slate-300 hover:text-red-500 uppercase tracking-[0.2em] transition-colors pt-4 border-t border-slate-50"
              >
                Limpar Todos os Parâmetros
              </button>
           </div>

           <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><Globe size={80}/></div>
              <h4 className="text-[8px] font-black text-blue-200 uppercase tracking-[0.2em] flex items-center gap-1.5 mb-2"><Zap size={12}/> Algoritmo Territorial</h4>
              <p className="text-[9px] font-medium leading-relaxed opacity-90">A orquestração prioriza prestadores com menor carga assistencial e maior eficiência em **TMR**.</p>
           </div>
        </aside>

        {/* LISTAGEM DE UNIDADES PRESTADORAS */}
        <main className="lg:col-span-9">
           <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                   Prestadores Localizados ({filtered.length})
                 </h3>
                 
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={handleSelectAll} 
                      className="text-[8px] font-black text-blue-600 uppercase tracking-[0.2em] hover:text-blue-800 transition-all flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm"
                    >
                       <ListChecks size={12}/> {selectedVagas.length === filtered.length && filtered.length > 0 ? 'DESMARCAR TODOS' : 'SELECIONAR TODOS OS NÓS'}
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">
                       <Radio size={12} className="animate-pulse text-red-500"/> Live
                    </div>
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                       <tr className="bg-slate-50/30 border-b border-slate-100">
                          <th className="px-6 py-4 w-[60px]">
                             <button onClick={handleSelectAll} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedVagas.length === filtered.length && filtered.length > 0 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200'}`}>
                                {selectedVagas.length === filtered.length && filtered.length > 0 && <Check size={14} strokeWidth={4}/>}
                             </button>
                          </th>
                          <th className="px-3 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Unidade / Perfil</th>
                          <th className="px-3 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Status Vaga</th>
                          <th className="px-3 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Eficiência T.M.R</th>
                          <th className="px-3 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Disponibilidade</th>
                          <th className="px-6 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {filtered.map(p => {
                         const isSelected = !!selectedVagas.find(v => v.id === p.id);
                         return (
                           <tr key={p.id} className={`hover:bg-emerald-50/20 transition-all group ${isSelected ? 'bg-emerald-50/30 border-l-4 border-l-emerald-600' : ''}`}>
                              <td className="px-6 py-4">
                                 <button onClick={() => toggleVaga(p)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' : 'bg-white border-slate-200 group-hover:border-emerald-400'}`}>
                                    {isSelected && <Check size={14} strokeWidth={4}/>}
                                 </button>
                              </td>

                              <td className="px-3 py-4">
                                 <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-lg transition-all shadow-inner border border-slate-200/50 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-600 group-hover:text-white'}`}>
                                       <Building2 size={16}/>
                                    </div>
                                    <div>
                                       <p className="text-[10px] font-black text-slate-900 uppercase leading-none mb-1 truncate max-w-[200px]">{p.name}</p>
                                       <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{p.type} • {p.node}</p>
                                    </div>
                                 </div>
                              </td>

                              <td className="px-3 py-4 text-center">
                                 <span className={`px-2 py-0.5 rounded text-[7px] font-black text-white uppercase shadow-sm ${riskColors[p.risk]}`}>{p.risk}</span>
                              </td>

                              <td className="px-3 py-4 text-center">
                                 <div className="flex flex-col items-center">
                                    <p className="text-xs font-black text-blue-600 tabular-nums leading-none">{p.tmr}</p>
                                    <p className="text-[6px] font-bold text-slate-300 uppercase tracking-widest mt-1">Tempo Resposta</p>
                                 </div>
                              </td>

                              <td className="px-3 py-4">
                                 <div className="flex flex-col items-center gap-1">
                                    <span className={`text-[8px] font-black uppercase ${p.load >= 90 ? 'text-red-600' : 'text-emerald-600'}`}>{p.availability}</span>
                                    <div className="w-14 h-1 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                       <div className={`h-full transition-all duration-1000 ${p.load >= 90 ? 'bg-red-500' : p.load >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${p.load}%` }}></div>
                                    </div>
                                 </div>
                              </td>

                              <td className="px-6 py-4 text-right">
                                 <button 
                                  onClick={() => toggleVaga(p)}
                                  className={`px-4 py-1.5 rounded-lg font-black text-[7px] uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center gap-1.5 ml-auto ${isSelected ? 'bg-emerald-600 text-white shadow-emerald-900/20' : 'bg-slate-900 text-white hover:bg-emerald-600'}`}
                                 >
                                   {isSelected ? 'VINCULADO' : 'VINCULAR'}
                                   {isSelected ? <Check size={12} strokeWidth={4}/> : <ArrowUpRight size={12}/>}
                                 </button>
                              </td>
                           </tr>
                         );
                       })}
                    </tbody>
                 </table>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-600"/>
                    <p className="text-[8px] font-medium text-slate-500 italic">"Seleções múltiplas habilitam fluxos de transferência simultâneos para otimização da rede federada."</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="text-right">
                       <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">Capacidade Regional</p>
                       <p className="text-[10px] font-black text-slate-900 mt-1">72% de Ocupação Federada</p>
                    </div>
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-lg"><BarChart3 size={16}/></div>
                 </div>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
};
