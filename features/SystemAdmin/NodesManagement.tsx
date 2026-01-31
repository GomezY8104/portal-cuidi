
import React, { useState } from 'react';
import { 
  Server, Plus, Search, Filter, 
  MapPin, Settings, Shield, FileText, 
  MoreHorizontal, Power, Eye
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const NodesManagementPage: React.FC = () => {
  const { openModal, addNotification } = useAppStore(); // Use addNotification
  const [searchTerm, setSearchTerm] = useState('');

  const nodes = [
    { id: '1', name: 'Hospital Central SP', type: 'HOSPITAL', region: 'SP', status: 'ACTIVE', lastAudit: '2024-10-25' },
    { id: '2', name: 'UBS Jardim Norte', type: 'APS', region: 'RJ', status: 'ACTIVE', lastAudit: '2024-10-24' },
    { id: '3', name: 'Lab Estadual MG', type: 'LABORATORIO', region: 'MG', status: 'SUSPENDED', lastAudit: '2024-10-20' },
    { id: '4', name: 'Secretaria de Saúde', type: 'REGULADOR', region: 'SP', status: 'PENDING', lastAudit: '-' },
  ];

  const handleAction = (action: string, node: any) => {
    if (action === 'DETAILS') {
      openModal('NodeDetailModal', node);
    } else if (action === 'SUSPEND') {
      openModal('ConfirmationModal', {
        title: 'Suspender Nó Federado',
        message: `ATENÇÃO: Deseja suspender o nó ${node.name}? Esta ação revoga certificados e interrompe a interoperabilidade imediatamente.`,
        type: 'danger',
        onConfirm: () => {
            // Lógica real de suspensão viria aqui
            addNotification({ type: 'warning', message: `Nó ${node.name} suspenso. Certificados revogados.` });
        }
      });
    } else if (action === 'AUDIT') {
      addNotification({ type: 'info', message: 'Carregando trilha de auditoria filtrada...' });
      // navigate('/system/audit?node=...')
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-20 font-sans text-slate-900">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b-2 border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-800 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
            <Server size={14} /> Infraestrutura Federada
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Gestão de Nós</h1>
        </div>
        <button 
          onClick={() => openModal('RegisterNodeModal')}
          className="px-6 py-3 bg-slate-900 text-white rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus size={14} /> Registrar Novo Nó
        </button>
      </div>

      {/* CONTROLES */}
      <div className="flex gap-4 items-center bg-slate-100 p-4 border border-slate-300">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
            <input 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-sm text-xs font-bold outline-none focus:border-blue-800 uppercase"
              placeholder="BUSCAR POR NOME, CNES OU ID..."
            />
         </div>
         <button className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-sm text-[10px] font-black uppercase flex items-center gap-2 hover:bg-slate-50">
            <Filter size={14}/> Filtros Avançados
         </button>
      </div>

      {/* TABELA PRINCIPAL */}
      <div className="border border-slate-300 bg-white">
        <table className="w-full text-left border-collapse">
           <thead className="bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-300">
              <tr>
                 <th className="px-6 py-4 border-r border-slate-200">Nome do Nó / ID</th>
                 <th className="px-6 py-4 border-r border-slate-200">Tipo</th>
                 <th className="px-6 py-4 border-r border-slate-200">Território</th>
                 <th className="px-6 py-4 border-r border-slate-200 text-center">Status</th>
                 <th className="px-6 py-4 border-r border-slate-200">Última Auditoria</th>
                 <th className="px-6 py-4 text-right">Ações</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-200 text-xs font-bold text-slate-700">
              {nodes.map(node => (
                 <tr key={node.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 border-r border-slate-200">
                       <p className="uppercase text-slate-900">{node.name}</p>
                       <p className="font-mono text-[10px] text-slate-400 mt-1">ID: NODE-{node.id.padStart(3, '0')}</p>
                    </td>
                    <td className="px-6 py-4 border-r border-slate-200 uppercase">{node.type}</td>
                    <td className="px-6 py-4 border-r border-slate-200 uppercase flex items-center gap-2">
                       <MapPin size={12} className="text-slate-400"/> {node.region}
                    </td>
                    <td className="px-6 py-4 border-r border-slate-200 text-center">
                       <span className={`px-2 py-1 border rounded-sm text-[9px] font-black uppercase ${
                          node.status === 'ACTIVE' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                          node.status === 'SUSPENDED' ? 'bg-red-50 border-red-200 text-red-700' :
                          'bg-amber-50 border-amber-200 text-amber-700'
                       }`}>
                          {node.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 border-r border-slate-200 font-mono text-slate-500">{node.lastAudit}</td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                          <button onClick={() => handleAction('DETAILS', node)} className="p-1.5 border border-slate-300 rounded-sm text-slate-500 hover:bg-slate-100 hover:text-blue-800" title="Ver Detalhes">
                             <Eye size={14}/>
                          </button>
                          <button onClick={() => handleAction('SUSPEND', node)} className="p-1.5 border border-slate-300 rounded-sm text-slate-500 hover:bg-red-50 hover:text-red-700 hover:border-red-200" title="Suspender">
                             <Power size={14}/>
                          </button>
                          <button onClick={() => handleAction('AUDIT', node)} className="p-1.5 border border-slate-300 rounded-sm text-slate-500 hover:bg-slate-100" title="Auditoria">
                             <Shield size={14}/>
                          </button>
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
