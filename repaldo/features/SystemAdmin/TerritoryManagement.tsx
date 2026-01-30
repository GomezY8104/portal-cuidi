
import React from 'react';
import { Map, Globe, Plus, ChevronRight, Search } from 'lucide-react';

export const TerritoryManagementPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Territórios Federados</h1>
          <p className="text-slate-500 text-lg">Gestão de UFs e Coordenações de Regulação.</p>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
           <Plus size={18} /> Nova Regional
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná'].map((uf, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:shadow-prominent transition-all group">
            <div className="flex justify-between items-start mb-6">
               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">
                 {uf.substring(0,2).toUpperCase()}
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{10 * (i + 1)} Nós</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{uf}</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">Coordenador: Dr. Gestor {i+1}</p>
            <button className="w-full py-4 bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
              Gerenciar UF <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
