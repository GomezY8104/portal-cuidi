
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, Search, Filter, Globe, Building2, 
  MapPin, Clock, ArrowRight, CheckCircle,
  Activity, Star, Navigation, ArrowUpRight, 
  ShieldCheck, Zap, Radio, Check
} from 'lucide-react';

export const ProviderCatalogDrawer: React.FC = () => {
  const { closeDrawer, drawerData } = useAppStore();
  const [search, setSearch] = useState('');

  const providers = [
    { id: 'H1', name: 'HOSPITAL CENTRAL DE REFERÊNCIA', type: 'HOSPITAL', territory: 'ZONA CENTRAL', availability: '12 LEITOS', load: 85, distance: '1.2KM', tmr: '15M' },
    { id: 'H2', name: 'INSTITUTO DANTE PAZZANESE', type: 'ESPECIALIZADO', territory: 'ZONA SUL', availability: '03 VAGAS', load: 92, distance: '8.4KM', tmr: '12M' },
    { id: 'C1', name: 'CLÍNICA CARDIO CARE SUL', type: 'AMBULATÓRIO', territory: 'ZONA OESTE', availability: 'ABERTO', load: 45, distance: '4.5KM', tmr: '45M' },
    { id: 'H3', name: 'SANTA CASA REGIONAL', type: 'HOSPITAL', territory: 'ZONA NORTE', availability: 'LOTADO', load: 100, distance: '12.0KM', tmr: '1H' },
  ];

  const filtered = useMemo(() => {
    return providers.filter(p => 
      (search === '' || p.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

  const handleEncaminhar = (provider: any) => {
    alert(`Protocolo de Direcionamento Digital gerado para ${provider.name}. Registro efetuado no Ledger Federado.`);
    closeDrawer();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header - Technical White Style */}
      <div className="p-8 border-b border-slate-100 bg-slate-50/80 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Navigation size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight uppercase leading-none text-slate-900">Orquestração de Oferta</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Inteligência de Vagas • {drawerData?.specialty || 'GERAL'}</p>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Nome da unidade, CNES ou território..." 
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all placeholder:text-slate-400 shadow-sm" 
          />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto bg-white flex flex-col custom-scrollbar p-0">
        <div className="p-6 border-b border-slate-50 bg-white/90 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Candidatos Federados ({filtered.length})</h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase tracking-widest border border-blue-100">
             <Radio size={10} className="animate-pulse"/> Monitoramento Live: On
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30 border-b border-slate-50">
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Unidade / Perfil</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Eficiência (TMR)</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Carga</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Direcionar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-emerald-50/20 transition-all group">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                         <Building2 size={16} />
                      </div>
                      <div className="overflow-hidden max-w-[200px]">
                         <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1 truncate">{p.name}</p>
                         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{p.territory} • {p.distance}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5 text-center">
                   <p className="text-xs font-black text-blue-600 tabular-nums">{p.tmr}</p>
                   <p className="text-[7px] font-bold text-slate-300 uppercase leading-none mt-1">Tempo Resposta</p>
                </td>
                <td className="px-6 py-5">
                   <div className="flex flex-col items-center gap-1.5">
                      <span className={`text-[9px] font-black uppercase ${p.load >= 90 ? 'text-red-600' : 'text-emerald-600'}`}>{p.availability}</span>
                      <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                         <div className={`h-full transition-all duration-1000 ${p.load >= 90 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${p.load}%` }}></div>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5 text-right">
                   <button 
                    onClick={() => handleEncaminhar(p)}
                    disabled={p.availability === 'LOTADO'}
                    className={`p-3 rounded-xl transition-all shadow-sm active:scale-90 ${p.availability === 'LOTADO' ? 'bg-slate-50 text-slate-200 cursor-not-allowed border border-slate-100' : 'bg-slate-900 text-white hover:bg-emerald-600 shadow-emerald-900/10'}`}
                   >
                     <ArrowUpRight size={16}/>
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-4">
             <div className="w-12 h-12 bg-slate-50 text-slate-200 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200"><Search size={24}/></div>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nenhuma unidade disponível</p>
          </div>
        )}
      </main>

      <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-4">
         <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center gap-4 shadow-sm">
            <ShieldCheck size={20} className="text-emerald-600 shrink-0"/>
            <p className="text-[9px] font-medium text-slate-500 leading-relaxed italic">"A seleção de oferta baseia-se no menor TMR (Tempo Médio de Resposta) e proximidade territorial auditada em tempo real."</p>
         </div>
         <button onClick={closeDrawer} className="w-full py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-colors">Cancelar Direcionamento</button>
      </div>
    </div>
  );
};
