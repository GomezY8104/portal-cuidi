import React, { useState } from 'react';
import { 
  Globe, Plus, Search, MapPin, Activity, 
  ShieldCheck, ShieldAlert, MoreVertical, 
  Server, Filter, Power, Eye, FileText
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const NodesManagementPage: React.FC = () => {
  const { openModal, openDrawer } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  // MOCK DATA
  const [nodes, setNodes] = useState([
    { id: '1', name: 'Hospital Central SP', type: 'HOSPITAL', region: 'SP', status: 'ACTIVE', policies: 12, lastContact: 'Hace 2 min' },
    { id: '2', name: 'UBS Jardim Norte', type: 'APS', region: 'RJ', status: 'ACTIVE', policies: 5, lastContact: 'Hace 5 min' },
    { id: '3', name: 'Lab Estadual MG', type: 'LABORATORIO', region: 'MG', status: 'SUSPENDED', policies: 8, lastContact: 'Hace 2 días' },
    { id: '4', name: 'Secretaria de Saúde', type: 'SECRETARIA', region: 'SP', status: 'PENDING', policies: 0, lastContact: '-' },
  ]);

  const handleSuspend = (id: string) => {
    if (confirm('¿Está seguro de suspender este nodo? Se revocará el acceso federado inmediatamente.')) {
      setNodes(nodes.map(n => n.id === id ? { ...n, status: 'SUSPENDED' } : n));
    }
  };

  const handleReactivate = (id: string) => {
    if (confirm('¿Reactivar nodo federado?')) {
      setNodes(nodes.map(n => n.id === id ? { ...n, status: 'ACTIVE' } : n));
    }
  };

  const filtered = nodes.filter(n => n.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">
            <Server size={14} /> Infraestructura Federada
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Gestión de Nodos</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Administración técnica de los puntos de conexión a la red CUIDI.
          </p>
        </div>
        <button 
          onClick={() => openModal('RegisterNodeModal')}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={16} /> Registrar Nuevo Nodo
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex gap-4 bg-slate-50/50">
           <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
              <input 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold outline-none focus:border-slate-900"
                placeholder="Buscar por nombre, ID o región..."
              />
           </div>
           <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50">
              <Filter size={14}/> Filtros
           </button>
        </div>

        <table className="w-full text-left border-collapse">
           <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                 <th className="px-6 py-4">Nombre / ID</th>
                 <th className="px-6 py-4">Tipo</th>
                 <th className="px-6 py-4">Región</th>
                 <th className="px-6 py-4 text-center">Estado Federado</th>
                 <th className="px-6 py-4 text-center">Políticas</th>
                 <th className="px-6 py-4">Último Contacto</th>
                 <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
              {filtered.map(node => (
                 <tr key={node.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                       <p className="text-xs font-bold text-slate-900 uppercase">{node.name}</p>
                       <p className="text-[9px] font-mono text-slate-400">ID: NODE-{node.id.padStart(3, '0')}</p>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-600 uppercase">{node.type}</td>
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1"><MapPin size={12}/> {node.region}</td>
                    <td className="px-6 py-4 text-center">
                       <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                          node.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          node.status === 'SUSPENDED' ? 'bg-red-50 text-red-700 border-red-100' :
                          'bg-amber-50 text-amber-700 border-amber-100'
                       }`}>
                          {node.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-bold text-slate-700">{node.policies}</td>
                    <td className="px-6 py-4 text-[10px] font-mono text-slate-500">{node.lastContact}</td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openDrawer('NodeDetailDrawer', node)} className="p-2 hover:bg-slate-100 rounded text-slate-500" title="Ver Detalle"><Eye size={16}/></button>
                          {node.status === 'ACTIVE' ? (
                             <button onClick={() => handleSuspend(node.id)} className="p-2 hover:bg-red-50 rounded text-red-500" title="Suspender"><Power size={16}/></button>
                          ) : (
                             <button onClick={() => handleReactivate(node.id)} className="p-2 hover:bg-emerald-50 rounded text-emerald-500" title="Reactivar"><Power size={16}/></button>
                          )}
                          <button className="p-2 hover:bg-slate-100 rounded text-slate-500" title="Ver Auditoría"><ShieldCheck size={16}/></button>
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