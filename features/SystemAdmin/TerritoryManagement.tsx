
import React from 'react';
import { Map, Plus, Eye, List } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const TerritoryManagementPage: React.FC = () => {
  const { openModal } = useAppStore();

  const territories = [
    { id: 'T1', name: 'Grande São Paulo', uf: 'SP', nodes: 42, regulators: 'Central Estadual SP', time: '12h' },
    { id: 'T2', name: 'Rio Metropolitana', uf: 'RJ', nodes: 28, regulators: 'Complexo Regulador RJ', time: '14h' },
    { id: 'T3', name: 'Belo Horizonte Central', uf: 'MG', nodes: 15, regulators: 'Central BH', time: '8h' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up pb-20 font-sans text-slate-900">
      <div className="flex justify-between items-end border-b-2 border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-800 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
            <Map size={14} /> Governança Geográfica
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Territórios</h1>
        </div>
        <button 
          onClick={() => openModal('CreateTerritoryModal')}
          className="px-6 py-3 bg-slate-900 text-white rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus size={14} /> Criar Território
        </button>
      </div>

      <div className="border border-slate-300 bg-white">
        <table className="w-full text-left border-collapse">
           <thead className="bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-300">
              <tr>
                 <th className="px-6 py-4 border-r border-slate-200">Região / Nome</th>
                 <th className="px-6 py-4 border-r border-slate-200 text-center">Nós Vinculados</th>
                 <th className="px-6 py-4 border-r border-slate-200">Regulador Responsável</th>
                 <th className="px-6 py-4 border-r border-slate-200 text-center">Tempo Médio Regulação</th>
                 <th className="px-6 py-4 text-right">Ação</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-200 text-xs font-bold text-slate-700">
              {territories.map(t => (
                 <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 border-r border-slate-200">
                       <p className="uppercase text-slate-900">{t.name}</p>
                       <p className="font-mono text-[10px] text-slate-400 mt-1">{t.uf} • ID: {t.id}</p>
                    </td>
                    <td className="px-6 py-4 border-r border-slate-200 text-center text-sm font-black">{t.nodes}</td>
                    <td className="px-6 py-4 border-r border-slate-200 uppercase">{t.regulators}</td>
                    <td className="px-6 py-4 border-r border-slate-200 text-center font-mono">{t.time}</td>
                    <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => openModal('TerritoryDetailModal', t)}
                         className="text-[10px] font-black text-blue-700 uppercase hover:underline flex items-center justify-end gap-1"
                       >
                          Ver Detalhes <Eye size={12}/>
                       </button>
                    </td>
                 </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
};
