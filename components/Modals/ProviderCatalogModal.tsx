
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, Search, Filter, Globe, Building2, 
  MapPin, Clock, ArrowRight, CheckCircle,
  Activity, Star, UserCheck, Phone, Navigation,
  ChevronRight, ArrowUpRight
} from 'lucide-react';

export const ProviderCatalogModal: React.FC = () => {
  const { closeModal, modalData } = useAppStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const providers = [
    { id: 'H1', name: 'Hospital Central de Referência', type: 'HOSPITAL', territory: 'ZONA CENTRAL', availability: '12 leitos', load: 85, distance: '1.2km', tmr: '15m' },
    { id: 'H2', name: 'Instituto Dante Pazzanese', type: 'ESPECIALIZADO', territory: 'ZONA SUL', availability: '03 vagas', load: 92, distance: '8.4km', tmr: '12m' },
    { id: 'C1', name: 'Clínica Cardio Care Sul', type: 'AMBULATÓRIO', territory: 'ZONA OESTE', availability: 'Agenda aberta', load: 45, distance: '4.5km', tmr: '45m' },
    { id: 'H3', name: 'Santa Casa Regional', type: 'HOSPITAL', territory: 'ZONA NORTE', availability: 'Lotado (Fila: 2)', load: 100, distance: '12.0km', tmr: '1h' },
  ];

  const filtered = useMemo(() => {
    return providers.filter(p => 
      (search === '' || p.name.toLowerCase().includes(search.toLowerCase())) &&
      (filterType === 'ALL' || p.type === filterType)
    );
  }, [search, filterType]);

  const handleEncaminhar = (provider: any) => {
    alert(`Caso encaminhado com sucesso para ${provider.name}. Protocolo assinado digitalmente na rede federada.`);
    closeModal();
  };

  return (
    <div className="flex flex-col h-[90vh]">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200">
            <Building2 size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Orquestração de Oferta</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Busca de Vagas para: {modalData?.specialty || 'Geral'}</p>
          </div>
        </div>
        <button onClick={closeModal} className="p-3 hover:bg-white rounded-full text-slate-400 transition-all hover:text-slate-900"><X size={24}/></button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        <aside className="w-full md:w-[320px] bg-slate-50 border-r border-slate-100 p-8 space-y-8 overflow-y-auto">
          <div className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Filtro de Unidade</label>
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
                <input 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Nome ou CNES..." 
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 outline-none font-bold text-xs focus:border-blue-500 transition-all shadow-sm" 
                />
             </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tipo de Prestador</label>
             <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'ALL', label: 'Toda a Rede' },
                  { id: 'HOSPITAL', label: 'Hospitalar' },
                  { id: 'ESPECIALIZADO', label: 'Especializado' },
                  { id: 'AMBULATÓRIO', label: 'Ambulatorial' },
                ].map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => setFilterType(cat.id)}
                    className={`p-4 rounded-xl flex items-center justify-between transition-all border-2 text-left ${filterType === cat.id ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-transparent text-slate-500 hover:border-slate-200'}`}
                  >
                     <span className="text-[9px] font-black uppercase tracking-widest">{cat.label}</span>
                     {filterType === cat.id && <CheckCircle size={14} />}
                  </button>
                ))}
             </div>
          </div>

          <div className="p-6 bg-blue-600 text-white rounded-[2rem] space-y-4 shadow-xl shadow-blue-200 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><Globe size={80}/></div>
             <h4 className="font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2"><Navigation size={14}/> Inteligência Territorial</h4>
             <p className="text-[11px] font-medium leading-relaxed opacity-90">A ordenação automática considera o território de abrangência e a taxa de ocupação em tempo real do nó prestador.</p>
          </div>
        </aside>

        <main className="flex-1 p-0 overflow-y-auto bg-white">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Prestador / Tipo</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Ocupação / Carga</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">T.M.R Médio</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Distância</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Direcionar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-blue-50/20 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner border border-slate-200/50">
                          <Building2 size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{p.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.type} • {p.territory}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                       <div className="flex justify-between items-end">
                          <span className={`text-[10px] font-black uppercase ${p.load >= 90 ? 'text-red-600' : 'text-emerald-600'}`}>{p.availability}</span>
                          <span className="text-[9px] font-bold text-slate-300">{p.load}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <div className={`h-full rounded-full transition-all duration-1000 ${p.load >= 90 ? 'bg-red-500' : p.load >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${p.load}%` }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                       <p className="text-sm font-black text-blue-600 tabular-nums">{p.tmr}</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase">Tempo Resposta</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1"><MapPin size={12}/> {p.distance}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleEncaminhar(p)}
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 shadow-lg transition-all flex items-center gap-2 ml-auto active:scale-95"
                    >
                       Confirmar Vaga <ArrowRight size={14}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};
