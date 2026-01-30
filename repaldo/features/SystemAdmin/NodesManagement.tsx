
import React, { useState } from 'react';
import { 
  Globe, Plus, Search, MapPin, Activity, 
  ShieldCheck, ShieldAlert, MoreHorizontal, 
  Ticket, Filter, ArrowUpRight, Zap
} from 'lucide-react';
import { MOCK_NODES } from '../../mocks/seed';

/**
 * P7: Gestão de Nós Federados (/system/nodes)
 * Exclusivo para SYSTEM_ADMIN gerenciar a infraestrutura nacional.
 */
export const NodesManagementPage: React.FC = () => {
  const [nodes] = useState(MOCK_NODES);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-2">
            <Globe size={14} /> Infraestrutura Nacional
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Nós Institucionais</h1>
          <p className="text-slate-500 mt-1 text-lg">Monitoramento e provisionamento da rede federada.</p>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2">
          <Ticket size={18} /> Emitir Token de Adesão
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacidade Total</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-slate-900">1.248</span>
            <span className="text-xs font-bold text-green-500 mb-1">+12 este mês</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status da Rede</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xl font-bold text-slate-900">99.9% Operacional</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fluxo Ledger (24h)</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-slate-900">42.1k</span>
            <span className="text-xs font-bold text-blue-500 mb-1">Eventos/dia</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por CNES, Nome ou Território..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
          />
        </div>
        <button className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors">
          <Filter size={18} /> Filtrar Região
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map((node) => (
          <div key={node.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-blue-50 transition-all group">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${node.status === 'ACTIVE' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Zap size={24} />
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${node.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {node.status}
                </span>
              </div>
              
              <h3 className="text-xl font-black text-slate-900 mb-1">{node.name}</h3>
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-6">
                <MapPin size={14} /> {node.territory} • {node.type}
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-widest">Integridade</span>
                  <span className="font-black text-slate-900">100%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-blue-600"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 px-8 flex justify-between items-center">
              <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline flex items-center gap-1">
                Configurar Nó <ArrowUpRight size={12} />
              </button>
              <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
