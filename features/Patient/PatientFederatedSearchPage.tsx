import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, Clock, Star, 
  CheckCircle, ShieldCheck, Phone, Navigation,
  Filter, ArrowRight, X, BarChart3, Users,
  Activity, ArrowUpDown, Building2, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

// DADOS MOCKADOS HÍBRIDOS (Técnico + Logístico)
const PROVIDERS_DATA = [
  { 
    id: 'H1', 
    name: 'Instituto de Cardiologia', 
    specialty: 'CARDIOLOGIA', 
    score: 98, 
    rating: 4.9, 
    reviews: 412,
    distance: '8.2 km', 
    travelTime: '25 min',
    waitTime: '2 dias',
    capacity: 'Alta',
    acceptanceRate: '95%',
    address: 'Av. Brasil, 3000 - São Paulo, SP',
    phone: '(11) 5555-5555',
    badges: ['SUS', 'Convênios', 'Alta Complexidade'],
    isOpen: true,
    coordinates: { lat: -23.58, lng: -46.65 }
  },
  { 
    id: 'H2', 
    name: 'Clínica do Coração SP', 
    specialty: 'CARDIOLOGIA', 
    score: 85, 
    rating: 4.7, 
    reviews: 128,
    distance: '2.3 km', 
    travelTime: '5 min',
    waitTime: '7 dias',
    capacity: 'Média',
    acceptanceRate: '88%',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    phone: '(11) 3333-4444',
    badges: ['SUS', 'Particular'],
    isOpen: true,
    coordinates: { lat: -23.56, lng: -46.65 }
  },
  { 
    id: 'H3', 
    name: 'Hospital Universitário', 
    specialty: 'GERAL', 
    score: 95, 
    rating: 4.8, 
    reviews: 234,
    distance: '12 km', 
    travelTime: '45 min',
    waitTime: '1 dia',
    capacity: 'Muito Alta',
    acceptanceRate: '92%',
    address: 'Cidade Universitária - São Paulo, SP',
    phone: '(11) 2222-1111',
    badges: ['SUS', 'Ensino', 'Referência'],
    isOpen: true,
    coordinates: { lat: -23.55, lng: -46.73 }
  },
  { 
    id: 'H4', 
    name: 'Centro Médico Saúde Total', 
    specialty: 'CARDIOLOGIA', 
    score: 78, 
    rating: 4.5, 
    reviews: 95,
    distance: '3.5 km', 
    travelTime: '7 min',
    waitTime: 'Agenda Livre',
    capacity: 'Baixa',
    acceptanceRate: '100%',
    address: 'Rua das Flores, 300 - São Paulo, SP',
    phone: '(11) 4444-5555',
    badges: ['Particular', 'Convênios'],
    isOpen: false,
    coordinates: { lat: -23.54, lng: -46.64 }
  }
];

export const PatientFederatedSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [sortOption, setSortOption] = useState('RELEVANCE'); // RELEVANCE, DISTANCE, SCORE, RATING
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // FILTRAGEM
  const filtered = useMemo(() => {
    let list = PROVIDERS_DATA.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSpec = selectedSpecialty === 'ALL' || p.specialty === selectedSpecialty;
      return matchSearch && matchSpec;
    });

    // ORDENAÇÃO
    switch (sortOption) {
      case 'DISTANCE':
        list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      case 'SCORE':
        list.sort((a, b) => b.score - a.score);
        break;
      case 'RATING':
        list.sort((a, b) => b.rating - a.rating);
        break;
      default: // RELEVANCE (Score + Rating weight)
        list.sort((a, b) => (b.score + b.rating * 10) - (a.score + a.rating * 10));
    }

    return list;
  }, [searchTerm, selectedSpecialty, sortOption]);

  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter(item => item !== id));
    } else {
      if (compareList.length >= 3) {
        alert('Máximo de 3 prestadores para comparação.');
        return;
      }
      setCompareList([...compareList, id]);
    }
  };

  const providersToCompare = PROVIDERS_DATA.filter(p => compareList.includes(p.id));

  // ABERTURA DO MODAL DE AGENDAMENTO
  const handleSchedule = (provider: any) => {
    openModal('PatientScheduleModal', provider);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      
      {/* SIDEBAR DE FILTROS (Esquerda - Visual Inspirado na Imagem 1) */}
      <aside className="w-[300px] bg-white border-r border-slate-200 hidden lg:flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
           <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
             <Filter size={18} className="text-blue-600"/> Filtros
           </h2>
        </div>
        
        <div className="p-6 space-y-8">
           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Especialidade</label>
              <select 
                value={selectedSpecialty}
                onChange={e => setSelectedSpecialty(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase outline-none focus:border-blue-500 transition-all cursor-pointer"
              >
                 <option value="ALL">Todas</option>
                 <option value="CARDIOLOGIA">Cardiologia</option>
                 <option value="GERAL">Clínica Geral</option>
                 <option value="ORTOPEDIA">Ortopedia</option>
              </select>
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Distância Máxima</label>
              <input type="range" className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                 <span>1km</span>
                 <span>50km</span>
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Convenções</label>
              <div className="space-y-2">
                 {['Atende SUS', 'Convênios Privados', 'Particular', 'Acessibilidade'].map(opt => (
                   <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">{opt}</span>
                   </label>
                 ))}
              </div>
           </div>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden">
         {/* BARRA SUPERIOR (Search & Sort) */}
         <header className="bg-white border-b border-slate-200 p-6 flex flex-col md:flex-row gap-4 items-center justify-between shrink-0 z-10">
            <div className="relative flex-1 w-full md:w-auto max-w-2xl">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20}/>
               <input 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 placeholder="Pesquisar por nome, especialidade ou procedimento..." 
                 className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 transition-all shadow-inner"
               />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:inline">Ordenar por:</span>
               <div className="relative">
                  <select 
                    value={sortOption}
                    onChange={e => setSortOption(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 pl-4 pr-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest outline-none focus:border-blue-500 shadow-sm cursor-pointer hover:bg-slate-50 min-w-[180px]"
                  >
                     <option value="RELEVANCE">Relevância (Score)</option>
                     <option value="DISTANCE">Mais Próximos</option>
                     <option value="SCORE">Melhor Avaliados</option>
                     <option value="RATING">Estrelas (Usuários)</option>
                  </select>
                  <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14}/>
               </div>
            </div>
         </header>

         {/* LISTA DE RESULTADOS (Scrollable) */}
         <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 custom-scrollbar">
            <div className="flex items-center justify-between mb-2">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{filtered.length} prestadores encontrados</p>
               <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <Globe size={12}/> <span className="text-[9px] font-black uppercase tracking-widest">Rede Federada Ativa</span>
               </div>
            </div>

            {filtered.map(provider => (
               <div key={provider.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                  {/* TAG SCORE ABSOLUTO */}
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-3xl font-black text-xs uppercase tracking-widest shadow-lg z-10">
                     Score: {provider.score}%
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8">
                     
                     {/* COLUNA ESQUERDA: IDENTIDADE E LOGÍSTICA */}
                     <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                           <div>
                              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2 group-hover:text-blue-600 transition-colors">{provider.name}</h3>
                              <div className="flex items-center gap-3 text-sm">
                                 <div className="flex items-center text-amber-500 font-bold">
                                    <Star size={16} fill="currentColor" className="mr-1"/> {provider.rating} <span className="text-slate-400 font-medium text-xs ml-1">({provider.reviews})</span>
                                 </div>
                                 <span className="text-slate-300">•</span>
                                 <span className="text-xs font-bold text-slate-500 uppercase">{provider.specialty}</span>
                              </div>
                           </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                           {provider.badges.map(badge => (
                              <span key={badge} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                                 {badge}
                              </span>
                           ))}
                        </div>

                        <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                           <div className="flex items-center gap-2 text-slate-600">
                              <MapPin size={18} className="text-blue-500"/>
                              <div>
                                 <p className="text-xs font-black uppercase">{provider.distance}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase">Distância</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-2 text-slate-600">
                              <Navigation size={18} className="text-indigo-500"/>
                              <div>
                                 <p className="text-xs font-black uppercase">{provider.travelTime}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase">Tempo Carro</p>
                              </div>
                           </div>
                           <div className={`flex items-center gap-2 ${provider.isOpen ? 'text-emerald-600' : 'text-red-500'}`}>
                              <Clock size={18}/>
                              <div>
                                 <p className="text-xs font-black uppercase">{provider.isOpen ? 'Aberto Agora' : 'Fechado'}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase">Status</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* COLUNA DIREITA: MÉTRICAS TÉCNICAS E AÇÃO */}
                     <div className="lg:w-[400px] bg-slate-50/50 rounded-3xl p-6 border border-slate-100 flex flex-col justify-between space-y-6">
                        {/* METRICS GRID */}
                        <div className="grid grid-cols-3 gap-4 text-center divide-x divide-slate-200">
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Espera</p>
                              <p className="text-base font-black text-slate-900">{provider.waitTime}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacidade</p>
                              <p className="text-base font-black text-emerald-600">{provider.capacity}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Aceite</p>
                              <p className="text-base font-black text-blue-600">{provider.acceptanceRate}</p>
                           </div>
                        </div>

                        <div className="space-y-1">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><MapPin size={10}/> Endereço</p>
                           <p className="text-xs font-medium text-slate-700 truncate">{provider.address}</p>
                        </div>

                        <div className="flex gap-3">
                           <button 
                             onClick={() => handleSchedule(provider)}
                             className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                           >
                              Solicitar Agendamento
                           </button>
                           <label className={`flex items-center gap-2 px-4 rounded-xl border-2 cursor-pointer transition-all select-none ${compareList.includes(provider.id) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300 text-slate-500'}`}>
                              <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={compareList.includes(provider.id)}
                                onChange={() => toggleCompare(provider.id)}
                              />
                              <span className="text-[9px] font-black uppercase tracking-widest">Comparar</span>
                           </label>
                        </div>
                     </div>

                  </div>
               </div>
            ))}
         </div>

         {/* BARRA FLUTUANTE DE COMPARAÇÃO */}
         {compareList.length > 0 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-4 px-8 rounded-full shadow-2xl flex items-center gap-8 animate-in slide-in-from-bottom-10 z-50">
               <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                     {providersToCompare.map(p => (
                        <div key={p.id} className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-xs font-black shadow-md">
                           {p.name.charAt(0)}
                        </div>
                     ))}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">{compareList.length} Selecionados</span>
               </div>
               <button 
                 onClick={() => setShowCompareModal(true)}
                 className="bg-white text-slate-900 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-colors"
               >
                 Comparar Agora
               </button>
               <button 
                 onClick={() => setCompareList([])}
                 className="p-2 hover:bg-white/10 rounded-full transition-colors"
               >
                 <X size={16}/>
               </button>
            </div>
         )}

         {/* MODAL DE COMPARAÇÃO */}
         {showCompareModal && (
            <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
               <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
                  <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Comparativo Lado a Lado</h2>
                     <button onClick={() => setShowCompareModal(false)} className="p-3 bg-white hover:bg-slate-100 rounded-full text-slate-400 transition-colors shadow-sm"><X size={24}/></button>
                  </div>
                  
                  <div className="overflow-x-auto p-10 custom-scrollbar">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr>
                              <th className="p-4 w-[200px]"></th>
                              {providersToCompare.map(p => (
                                 <th key={p.id} className="p-4 min-w-[250px] align-top">
                                    <div className="space-y-2">
                                       <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm"><Building2 size={24}/></div>
                                       <h3 className="text-lg font-black text-slate-900 leading-tight uppercase">{p.name}</h3>
                                       <div className="flex items-center gap-1 text-amber-500 font-bold text-xs"><Star size={12} fill="currentColor"/> {p.rating}</div>
                                    </div>
                                 </th>
                              ))}
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                           <tr>
                              <td className="p-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Score Federado</td>
                              {providersToCompare.map(p => (
                                 <td key={p.id} className="p-4">
                                    <div className="flex items-center gap-2">
                                       <span className="text-2xl font-black text-blue-600">{p.score}</span>
                                       <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                          <div className="h-full bg-blue-600" style={{ width: `${p.score}%` }}></div>
                                       </div>
                                    </div>
                                 </td>
                              ))}
                           </tr>
                           <tr>
                              <td className="p-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Tempo de Espera</td>
                              {providersToCompare.map(p => (
                                 <td key={p.id} className="p-4 font-bold text-slate-700">{p.waitTime}</td>
                              ))}
                           </tr>
                           <tr>
                              <td className="p-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Distância</td>
                              {providersToCompare.map(p => (
                                 <td key={p.id} className="p-4 font-bold text-slate-700">{p.distance} ({p.travelTime})</td>
                              ))}
                           </tr>
                           <tr>
                              <td className="p-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Capacidade Real</td>
                              {providersToCompare.map(p => (
                                 <td key={p.id} className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.capacity === 'Alta' || p.capacity === 'Muito Alta' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                       {p.capacity}
                                    </span>
                                 </td>
                              ))}
                           </tr>
                           <tr>
                              <td className="p-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Serviços</td>
                              {providersToCompare.map(p => (
                                 <td key={p.id} className="p-4">
                                    <div className="flex flex-wrap gap-1">
                                       {p.badges.map(b => <span key={b} className="text-[9px] border border-slate-200 px-2 py-0.5 rounded uppercase text-slate-500 font-bold">{b}</span>)}
                                    </div>
                                 </td>
                              ))}
                           </tr>
                           <tr>
                              <td className="p-4"></td>
                              {providersToCompare.map(p => (
                                 <td key={p.id} className="p-4">
                                    <button 
                                      onClick={() => handleSchedule(p)}
                                      className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                                    >
                                       Escolher Este
                                    </button>
                                 </td>
                              ))}
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         )}

      </main>
    </div>
  );
};


