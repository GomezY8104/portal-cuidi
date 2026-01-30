
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { UserRole } from '../../types';
import { 
  Users, Plus, Search, MoreVertical, 
  UserCheck, UserX, Mail, Shield, 
  Filter, ArrowLeft, Edit2, Trash2,
  CheckCircle, Clock, AlertCircle
} from 'lucide-react';

/**
 * P11: Gestão de Funcionários do Nó (/node-admin/users)
 * Permite ao NODE_ADMIN gerenciar os profissionais autorizados em sua unidade.
 */
export const UserManagementPage: React.FC = () => {
  const { openModal, openDrawer } = useAppStore();
  
  // Mock de usuários da unidade
  const [users, setUsers] = useState([
    { id: '1', name: 'Dra. Beatriz Santos', email: 'beatriz@node.br', role: 'REGULATOR', status: 'ACTIVE', lastAccess: 'há 10min' },
    { id: '2', name: 'Marcos Oliveira', email: 'marcos@node.br', role: 'APS', status: 'PENDING', lastAccess: '-' },
    { id: '3', name: 'Enf. Carla Lima', email: 'carla@node.br', role: 'UPA', status: 'ACTIVE', lastAccess: 'há 2h' },
    { id: '4', name: 'Dr. Roberto Silva', email: 'roberto@node.br', role: 'PROVIDER', status: 'INACTIVE', lastAccess: 'há 5 dias' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Cabeçalho Operacional */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Equipe Local</h1>
          <p className="text-slate-500 mt-2 text-lg">Gestão de identidades e privilégios do nó federado.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => openModal('CreateUserModal')}
            className="flex-1 md:flex-none px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Novo Funcionário
          </button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome, e-mail ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 font-bold text-sm flex items-center gap-2 hover:bg-slate-100">
            <Filter size={18} /> Filtrar Papéis
          </button>
        </div>
      </div>

      {/* Tabela de Usuários (DataGrid Mock) */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Funcionário</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Papel Federado</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Último Acesso</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr key={user.id} className="group hover:bg-blue-50/30 transition-colors cursor-pointer" onClick={() => openDrawer('UserQuickViewDrawer', user)}>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 font-black text-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg w-fit">
                    <Shield size={14} className="text-slate-500" />
                    <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{user.role}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                    user.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {user.status === 'ACTIVE' ? <CheckCircle size={10}/> : user.status === 'PENDING' ? <Clock size={10}/> : <AlertCircle size={10}/>}
                    {user.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                  {user.lastAccess}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"><Edit2 size={18} /></button>
                    <button className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    <button className="p-2 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"><MoreVertical size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estado Vazio (Placeholder) */}
      {users.length === 0 && (
        <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300"><Users size={40} /></div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Nenhum funcionário cadastrado</h3>
            <p className="text-slate-500">Comece convidando membros da sua equipe para o nó federado.</p>
          </div>
          <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold">Convidar Agora</button>
        </div>
      )}
    </div>
  );
};
