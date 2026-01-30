import React, { useState } from 'react';
import { Map, Plus, Search, Edit, List } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const TerritoryManagementPage: React.FC = () => {
  const { openModal, openDrawer } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const territories = [
    { id: 'T1', name: 'Grande São Paulo', uf: 'SP', nodes: 42, regulators: 'Central Estadual SP', rules: 3 },
    { id: 'T2', name: 'Rio Metropolitana', uf: 'RJ', nodes: 28, regulators: 'Complexo Regulador RJ', rules: 1 },
    { id: 'T3', name: 'Belo Horizonte Central', uf: 'MG', nodes: 15, regulators: 'Central BH', rules: 0 },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">
            <Map size={14} /> Gobernanza Geográfica
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Territorios</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Definición de regiones de regulación y reglas territoriales.
          </p>
        </div>
        <button 
          onClick={() => openModal('CreateTerritoryModal')}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={16} /> Crear Territorio
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
           <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                 <th className="px-6 py-4">Región / Nombre</th>
                 <th className="px-6 py-4 text-center">Nodos Asignados</th>
                 <th className="px-6 py-4">Reguladores Responsables</th>
                 <th className="px-6 py-4 text-center">Reglas Especiales</th>
                 <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
              {territories.map(t => (
                 <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                       <p className="text-xs font-bold text-slate-900 uppercase">{t.name}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">{t.uf}</p>
                    </td>
                    <td className="px-6 py-4 text-center font-black text-slate-700">{t.nodes}</td>
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-600 uppercase">{t.regulators}</td>
                    <td className="px-6 py-4 text-center">
                       {t.rules > 0 ? (
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase">{t.rules} Activas</span>
                       ) : (
                          <span className="text-[9px] text-slate-300 font-bold uppercase">Ninguna</span>
                       )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openModal('CreateTerritoryModal')} className="p-2 hover:bg-slate-100 rounded text-slate-500" title="Editar"><Edit size={16}/></button>
                          <button className="p-2 hover:bg-slate-100 rounded text-slate-500" title="Ver Nodos"><List size={16}/></button>
                          <button onClick={() => openDrawer('TerritoryRulesDrawer', t)} className="p-2 hover:bg-slate-100 rounded text-slate-500" title="Ver Reglas"><Map size={16}/></button>
                       </div>
                    </td>
                 </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
};