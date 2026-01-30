
import React, { useState } from 'react';
import { 
  Layers, Search, Plus, ListTree, Tag, 
  ChevronRight, Box, Activity, Stethoscope, 
  Database, Download, Filter
} from 'lucide-react';

/**
 * P8: Catálogos Globais (/system/catalogs)
 * Gestão de terminologias e ofertas assistenciais unificadas.
 */
export const CatalogsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'specialties' | 'procedures' | 'offers'>('specialties');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-2">
            <Layers size={14} /> Padronização de Dados
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Catálogos Unificados</h1>
          <p className="text-slate-500 mt-1 text-lg">Taxonomia nacional para interoperabilidade assistencial.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-4 border border-slate-200 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50">
            <Download size={18} /> Exportar CSV
          </button>
          <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2">
            <Plus size={18} /> Novo Item
          </button>
        </div>
      </div>

      <div className="flex bg-white p-2 rounded-[2rem] border border-slate-200 shadow-sm w-fit">
        {[
          { id: 'specialties', label: 'Especialidades', icon: <Stethoscope size={18} /> },
          { id: 'procedures', label: 'Procedimentos SIGTAP', icon: <Activity size={18} /> },
          { id: 'offers', label: 'Ofertas Federadas', icon: <Box size={18} /> },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-8 py-3 rounded-[1.5rem] font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex gap-4">
           <div className="flex-1 relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input type="text" placeholder="Pesquisar no catálogo..." className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl outline-none border border-transparent focus:border-indigo-100" />
           </div>
           <button className="px-6 py-3 bg-slate-50 rounded-xl text-slate-500 hover:text-slate-900 transition-colors">
              <Filter size={20} />
           </button>
        </div>

        <div className="divide-y divide-slate-50">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="p-6 px-10 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all">
                  <Tag size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none mb-1">CÓD: 03.01.01.007-{i}</p>
                  <p className="text-lg font-bold text-slate-900">Consulta Especializada em {activeTab === 'specialties' ? 'Cardiologia' : 'Ecocardiografia'}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Última Atualização</p>
                  <p className="text-sm font-medium text-slate-600">12 Out 2024</p>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-8 bg-slate-50 text-center">
          <button className="text-sm font-black text-indigo-600 uppercase tracking-widest hover:underline">Ver catálogo completo</button>
        </div>
      </div>
    </div>
  );
};
