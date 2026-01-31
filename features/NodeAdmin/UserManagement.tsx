
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Users, Search, Filter, Plus, Eye, Edit2, 
  Trash2, Power, AlertCircle, CheckCircle, Clock, Building2
} from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const { openModal, openDrawer, user: currentUser, addNotification } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  // Recupera o nome do nó do admin logado
  const currentNodeName = currentUser?.nodeName || 'Unidade Local';
  const nodeType = currentNodeName.toUpperCase();

  // GERADOR DE DADOS CONTEXTUAIS (Lógica de Negócio)
  // Gera perfis coerentes com o tipo de instituição do admin logado
  const getContextUsers = () => {
    let team = [];

    // O próprio admin sempre aparece
    team.push({ 
      id: 'adm-01', 
      name: currentUser?.name || 'Administrador Local', 
      email: currentUser?.email || 'admin@saude.gov.br', 
      role: 'NODE_ADMIN', 
      unit: currentNodeName, 
      status: 'ACTIVE', 
      lastAccess: 'Agora' 
    });

    if (nodeType.includes('HOSPITAL') || nodeType.includes('SANTA CASA')) {
       // Perfil Hospitalar: Médicos, Enfermeiros, Auditores
       team.push(
         { id: 'h1', name: 'Dr. Roberto Silva', email: 'roberto.silva@hosp.gov', role: 'PROVIDER', unit: currentNodeName, status: 'ACTIVE', lastAccess: 'Hoje, 07:00' },
         { id: 'h2', name: 'Dra. Amanda Costa', email: 'amanda.costa@hosp.gov', role: 'PROVIDER', unit: currentNodeName, status: 'ACTIVE', lastAccess: 'Ontem, 19:30' },
         { id: 'h3', name: 'Enf. Chefe Julia', email: 'julia.enf@hosp.gov', role: 'PROVIDER', unit: currentNodeName, status: 'ACTIVE', lastAccess: 'Hoje, 08:15' },
         { id: 'h4', name: 'Dr. Paulo (Residente)', email: 'paulo.res@hosp.gov', role: 'PROVIDER', unit: currentNodeName, status: 'PENDING', lastAccess: '-' },
         { id: 'h5', name: 'Auditor Marcos', email: 'marcos.audit@hosp.gov', role: 'AUDITOR', unit: currentNodeName, status: 'ACTIVE', lastAccess: '20/10/2024' }
       );
    } else if (nodeType.includes('UBS') || nodeType.includes('APS') || nodeType.includes('FAMÍLIA')) {
       // Perfil APS: Médicos de Família, Enfermeiros APS, Agentes
       team.push(
         { id: 'u1', name: 'Enf. Marcos Oliveira', email: 'marcos.enf@ubs.gov', role: 'APS', unit: currentNodeName, status: 'ACTIVE', lastAccess: 'Hoje, 08:00' },
         { id: 'u2', name: 'Dra. Elena (Médica Família)', email: 'elena.med@ubs.gov', role: 'APS', unit: currentNodeName, status: 'ACTIVE', lastAccess: 'Hoje, 09:15' },
         { id: 'u3', name: 'Agente Pedro Santos', email: 'pedro.acs@ubs.gov', role: 'APS', unit: currentNodeName, status: 'INACTIVE', lastAccess: '10/10/2024' },
         { id: 'u4', name: 'Dr. João (Clínico)', email: 'joao.clinico@ubs.gov', role: 'APS', unit: currentNodeName, status: 'PENDING', lastAccess: '-' }
       );
    } else if (nodeType.includes('UPA') || nodeType.includes('PRONTO') || nodeType.includes('EMERGÊNCIA')) {
       // Perfil UPA: Plantonistas, Triagem
       team.push(
         { id: 'up1', name: 'Enf. Carla Lima', email: 'carla.triagem@upa.gov', role: 'UPA', unit: currentNodeName, status: 'ACTIVE', lastAccess: 'Hoje, 18:00' },
         { id: 'up2', name: 'Dr. Plantonista João', email: 'joao.plantao@upa.gov', role: 'UPA', unit: currentNodeName, status: 'ACTIVE', lastAccess: 'Agora' },
         { id: 'up3', name: 'Tec. Enfermagem Souza', email: 'souza.tec@upa.gov', role: 'UPA', unit: currentNodeName, status: 'ACTIVE', lastAccess: 'Hoje, 06:00' },
         { id: 'up4', name: 'Dra. Sofia (Pediatra)', email: 'sofia.ped@upa.gov', role: 'UPA', unit: currentNodeName, status: 'PENDING', lastAccess: '-' }
       );
    } else if (nodeType.includes('REGULA') || nodeType.includes('CENTRAL') || nodeType.includes('SECRETARIA')) {
       // Perfil Regulador: Médicos Reguladores
       team.push(
         { id: 'r1', name: 'Dra. Beatriz Santos', email: 'beatriz.reg@saude.gov', role: 'REGULATOR', unit: currentNodeName, status: 'ACTIVE', lastAccess: 'Hoje, 10:00' },
         { id: 'r2', name: 'Regulador Carlos', email: 'carlos.reg@saude.gov', role: 'REGULATOR', unit: currentNodeName, status: 'ACTIVE', lastAccess: 'Ontem, 14:00' },
         { id: 'r3', name: 'Gestor Territorial', email: 'gestor@saude.gov', role: 'MANAGER', unit: currentNodeName, status: 'ACTIVE', lastAccess: 'Hoje, 08:00' }
       );
    } else {
       // Fallback Genérico
       team.push(
         { id: 'g1', name: 'Profissional Padrão', email: 'user@node.gov', role: 'PROVIDER', unit: currentNodeName, status: 'ACTIVE', lastAccess: '-' },
         { id: 'g2', name: 'Assistente Administrativo', email: 'adm@node.gov', role: 'MANAGER', unit: currentNodeName, status: 'PENDING', lastAccess: '-' }
       );
    }
    return team;
  };

  const [users, setUsers] = useState(getContextUsers());

  const handleDelete = (userId: string, isPending: boolean) => {
    const msg = isPending 
      ? 'Tem certeza que deseja revogar este convite pendente?' 
      : 'ATENÇÃO: Deseja excluir permanentemente este usuário e revogar todas as credenciais de acesso ao nó?';
    
    openModal('ConfirmationModal', {
      title: 'Confirmar Exclusão',
      message: msg,
      type: 'danger',
      onConfirm: () => {
        setUsers(users.filter(u => u.id !== userId));
        addNotification({ type: 'success', message: 'Usuário removido com sucesso.' });
      }
    });
  };

  const handleDeactivate = (userId: string) => {
    openModal('ConfirmationModal', {
      title: 'Desativar Acesso',
      message: 'Deseja desativar o acesso deste usuário? O login será bloqueado imediatamente.',
      type: 'warning',
      onConfirm: () => {
        setUsers(users.map(u => u.id === userId ? { ...u, status: 'INACTIVE' } : u));
        addNotification({ type: 'warning', message: 'Acesso desativado.' });
      }
    });
  };

  const handleEditRole = (user: any) => {
      openModal('InputModal', {
        title: 'Editar Papel (Role)',
        label: `Novo Papel para ${user.name}`,
        defaultValue: user.role,
        onConfirm: (newRole: string) => {
          if (newRole && newRole !== user.role) {
            setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole.toUpperCase() } : u));
            addNotification({ type: 'success', message: 'Papel atualizado com sucesso.' });
          }
        }
      });
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'ALL' || user.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6 animate-fade-in-up pb-20 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Building2 size={16} className="text-blue-600" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{currentNodeName}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Gestão da Equipe</h1>
          <p className="text-slate-500 text-xs font-medium mt-1">
            Controle de identidade e acesso (IAM) exclusivo para os colaboradores desta unidade.
          </p>
        </div>
        <button 
          onClick={() => openModal('InviteUserModal')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-md font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95 shadow-sm"
        >
          <Plus size={14} /> Convidar Funcionário
        </button>
      </div>

      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 border border-slate-200 rounded-md shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold outline-none focus:border-slate-500 transition-all"
          />
        </div>
        <div className="relative min-w-[220px]">
           <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
           <select 
             value={filterRole}
             onChange={(e) => setFilterRole(e.target.value)}
             className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold outline-none appearance-none cursor-pointer hover:bg-slate-100 transition-all uppercase"
           >
             <option value="ALL">Todos os Papéis</option>
             <option value="NODE_ADMIN">Administrador</option>
             <option value="PROVIDER">Prestador/Médico</option>
             <option value="APS">Equipe APS</option>
             <option value="UPA">Equipe UPA</option>
             <option value="REGULATOR">Regulador</option>
           </select>
        </div>
      </div>

      {/* TABELA PRINCIPAL */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Colaborador</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Corporativo</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Papel</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Vínculo (Nó)</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Último Acesso</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="group hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 font-bold text-slate-900">{user.name}</td>
                <td className="px-6 py-3 font-mono text-slate-500">{user.email}</td>
                <td className="px-6 py-3">
                  <span className="text-[9px] font-black bg-slate-100 text-slate-600 px-2 py-1 rounded-sm uppercase tracking-wider border border-slate-200">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-3">
                   <div className="flex items-center gap-1.5 text-blue-800">
                      <Building2 size={12} className="text-blue-400"/> 
                      <span className="uppercase text-[10px] font-bold">{user.unit}</span>
                   </div>
                </td>
                <td className="px-6 py-3 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest border ${
                    user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                    user.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {user.status === 'ACTIVE' && <CheckCircle size={10} />}
                    {user.status === 'PENDING' && <Clock size={10} />}
                    {user.status === 'INACTIVE' && <AlertCircle size={10} />}
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-3 font-mono text-[10px] text-slate-500">
                  {user.lastAccess}
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button 
                      onClick={() => openDrawer('UserDetailDrawer', user)}
                      className="p-1.5 hover:bg-slate-200 text-slate-500 rounded transition-colors" 
                      title="Ver Detalhes"
                    >
                      <Eye size={14} />
                    </button>
                    
                    <button 
                      onClick={() => handleEditRole(user)}
                      className="p-1.5 hover:bg-blue-100 text-blue-600 rounded transition-colors" 
                      title="Editar Papel"
                    >
                      <Edit2 size={14} />
                    </button>

                    {user.status !== 'INACTIVE' && (
                      <button 
                        onClick={() => handleDeactivate(user.id)}
                        className="p-1.5 hover:bg-amber-100 text-amber-600 rounded transition-colors" 
                        title="Desativar Acesso"
                      >
                        <Power size={14} />
                      </button>
                    )}

                    <button 
                      onClick={() => handleDelete(user.id, user.status === 'PENDING')}
                      className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors" 
                      title={user.status === 'PENDING' ? "Revogar Convite" : "Excluir Usuário"}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center border-t border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nenhum colaborador encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};
