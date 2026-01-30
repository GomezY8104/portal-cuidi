import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Users, Search, Filter, MoreVertical, 
  UserCheck, UserX, Mail, Shield, 
  Edit2, Trash2, Eye, Plus, Power,
  CheckCircle, AlertCircle, Clock, MoreHorizontal
} from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const { openModal, openDrawer } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  // MOCK DATA
  const [users, setUsers] = useState([
    { id: '1', name: 'Dra. Beatriz Santos', email: 'beatriz@node.br', role: 'REGULATOR', unit: 'Regulação Central', status: 'ACTIVE', lastAccess: 'Hoje, 10:42' },
    { id: '2', name: 'Marcos Oliveira', email: 'marcos@node.br', role: 'APS', unit: 'UBS Central', status: 'PENDING', lastAccess: '-' },
    { id: '3', name: 'Enf. Carla Lima', email: 'carla@node.br', role: 'UPA', unit: 'UPA Norte', status: 'ACTIVE', lastAccess: 'Ontem, 18:30' },
    { id: '4', name: 'Dr. Roberto Silva', email: 'roberto@node.br', role: 'PROVIDER', unit: 'Hosp. Regional', status: 'INACTIVE', lastAccess: '20 Out 2024' },
    { id: '5', name: 'Admin Técnico', email: 'admin@node.br', role: 'NODE_ADMIN', unit: 'Gestão', status: 'ACTIVE', lastAccess: 'Agora' },
  ]);

  const handleDelete = (userId: string, isPending: boolean) => {
    // Si es Pending, solo revoca. Si es Active, pide confirmación fuerte.
    const msg = isPending 
      ? 'Tem certeza que deseja revogar este convite pendente?' 
      : 'ATENÇÃO: Deseja excluir permanentemente este usuário e revogar todas as credenciais?';
      
    // En un caso real, aquí llamaríamos a openModal('DeleteAccountModal') para usuarios activos
    // Para el ejemplo rápido usamos confirm
    if (confirm(msg)) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleDeactivate = (userId: string) => {
    if (confirm('Deseja desativar o acesso deste usuário?')) {
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'INACTIVE' } : u));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'ALL' || user.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      
      {/* HEADER TÉCNICO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-2">
            <Users size={14} /> Gestão de Identidade
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Equipe Interna</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Controle de acesso e papéis do nó {useAppStore.getState().user?.nodeName || 'Institucional'}.
          </p>
        </div>
        <button 
          onClick={() => openModal('InviteUserModal')}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={16} /> Criar Usuário
        </button>
      </div>

      {/* BARRA DE FERRAMENTAS */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all"
          />
        </div>
        <div className="relative min-w-[200px]">
           <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
           <select 
             value={filterRole}
             onChange={(e) => setFilterRole(e.target.value)}
             className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none appearance-none cursor-pointer hover:bg-slate-100 transition-all"
           >
             <option value="ALL">Todos os Papéis</option>
             <option value="NODE_ADMIN">Administradores</option>
             <option value="REGULATOR">Reguladores</option>
             <option value="APS">Operadores APS</option>
             <option value="UPA">Operadores UPA</option>
             <option value="PROVIDER">Prestadores</option>
           </select>
        </div>
      </div>

      {/* TABELA PRINCIPAL (Data-Dense) */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Nome / Identidade</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Corporativo</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Função (Role)</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Unidade</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Estado</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Último Acesso</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="group hover:bg-blue-50/10 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${user.status === 'ACTIVE' ? 'bg-slate-100 text-slate-600' : 'bg-slate-50 text-slate-300'}`}>
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-slate-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-[11px] font-medium text-slate-500">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span className="text-[9px] font-black bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase tracking-wider">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  {user.unit}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                    user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    user.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                    'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {user.status === 'ACTIVE' && <CheckCircle size={10} />}
                    {user.status === 'PENDING' && <Clock size={10} />}
                    {user.status === 'INACTIVE' && <AlertCircle size={10} />}
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">
                  {user.lastAccess}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Botão Ver Detalhes */}
                    <button 
                      onClick={() => openDrawer('UserDetailDrawer', user)}
                      className="p-2 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors border border-transparent hover:border-slate-200" 
                      title="Ver Detalhes"
                    >
                      <Eye size={16} />
                    </button>
                    
                    {/* Botão Editar */}
                    <button 
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100" 
                      title="Editar Função"
                    >
                      <Edit2 size={16} />
                    </button>

                    {/* Botão Desativar (Solo activos) */}
                    {user.status !== 'INACTIVE' && (
                      <button 
                        onClick={() => handleDeactivate(user.id)}
                        className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors border border-transparent hover:border-amber-100" 
                        title="Desativar Acesso"
                      >
                        <Power size={16} />
                      </button>
                    )}

                    {/* Botão Eliminar (Todos) */}
                    <button 
                      onClick={() => handleDelete(user.id, user.status === 'PENDING')}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-100" 
                      title={user.status === 'PENDING' ? "Revogar Convite" : "Excluir Usuário"}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Nenhum usuário encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};