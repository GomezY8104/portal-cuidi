
import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { UserRole } from '../types';
import { CuidiLogo } from './ui/CuidiLogo';
import { MOCK_PROVIDER_CASES } from '../mocks/seed';
import { 
  Home, Users, Shield, Activity, FileBarChart, 
  Settings, LogOut, Menu, Bell,
  Layers, Lock, Search, FileText, Globe, 
  Monitor, ShieldCheck,
  Video, Plus, Cpu, HelpCircle, History, List
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, sidebarCollapsed, setSidebarCollapsed, openModal } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cuidi_user_session');
    navigate('/login');
  };

  const menuItems = React.useMemo(() => {
    const role = user?.role;
    const items = [];

    if (role === UserRole.SYSTEM_ADMIN) {
      items.push(
        { label: 'Dashboard Global', icon: <Home size={18}/>, path: '/system' },
        { label: 'Gestão de Nós', icon: <Globe size={18}/>, path: '/system/nodes' },
        { label: 'Territórios', icon: <Monitor size={18}/>, path: '/system/territories' },
        { label: 'Compliance LGPD', icon: <ShieldCheck size={18}/>, path: '/system/compliance' },
        { label: 'Auditoria Global', icon: <Shield size={18}/>, path: '/system/audit' },
        { label: 'Auditoria IA', icon: <Cpu size={18}/>, path: '/system/code-audit' },
        { label: 'Relatórios', icon: <FileBarChart size={18}/>, path: '/reports' }
      );
    } else if (role === UserRole.NODE_ADMIN) {
      items.push(
        { label: 'Dashboard do Nó', icon: <Home size={18}/>, path: '/node-admin' },
        { label: 'Equipe', icon: <Users size={18}/>, path: '/node-admin/users' },
        { label: 'Config. Técnica', icon: <Settings size={18}/>, path: '/node-admin/config' },
        { label: 'Políticas Locais', icon: <Lock size={18}/>, path: '/federation/policies' },
        { label: 'Relatórios Auditoria', icon: <FileBarChart size={18}/>, path: '/node-admin/audit-reports' }
      );
    } else if (role === UserRole.PATIENT) {
      items.push(
        { label: 'Meu Portal', icon: <Home size={18}/>, path: '/patient' },
        { label: 'Meus Processos', icon: <Activity size={18}/>, path: '/patient/cases' },
        { label: 'Buscar Prestadores', icon: <Search size={18}/>, path: '/patient/providers' },
        { label: 'Histórico Clínico', icon: <FileText size={18}/>, path: '/patient/history' },
        { label: 'Consentimentos', icon: <ShieldCheck size={18}/>, path: '/patient/consents' },
        { label: 'Suporte', icon: <HelpCircle size={18}/>, path: '/patient/support' }
      );
    } else if (role === UserRole.APS) {
      // --- MENU APS ---
      items.push(
        { label: 'Fila de Encaminhamento', icon: <List size={18}/>, path: '/aps' },
        { label: 'Novo Encaminhamento', icon: <Plus size={18}/>, path: '/aps/new-case' },
        { label: 'Telemedicina', icon: <Video size={18}/>, path: '/telemedicine' },
        { label: 'Suporte', icon: <HelpCircle size={18}/>, path: '/help' }
      );
    } else if (['REGULATOR', 'UPA', 'PROVIDER'].includes(role || '')) {
      const firstCaseId = MOCK_PROVIDER_CASES[0]?.id || 'UPA-901';
      
      // --- MENU UPA/REGULADOR ---
      if (role === 'REGULATOR') {
        items.push(
          { label: 'Fila de Regulação', icon: <Activity size={18}/>, path: '/regulator' },
          { label: 'Telemedicina', icon: <Video size={18}/>, path: '/telemedicine' },
          { label: 'Casos Regulados', icon: <History size={18}/>, path: '/reports' },
          { label: 'Suporte', icon: <HelpCircle size={18}/>, path: '/help' }
        );
      } else {
        items.push(
          { label: role === 'UPA' ? 'Controle de Fluxo' : 'Fila de Trabalho', icon: <Activity size={18}/>, path: role === 'PROVIDER' ? '/provider' : `/${role?.toLowerCase()}` }
        );
      }

      if (role === 'UPA') {
        items.push(
          { label: 'Admissão / Triagem', icon: <Plus size={18}/>, path: '/upa/new-case' },
          { label: 'Telemedicina', icon: <Video size={18}/>, path: '/telemedicine' }
        );
      }

      if (role === 'PROVIDER') {
        items.push(
          { label: 'Fluxo de Regulação', icon: <Layers size={18}/>, path: `/provider/regulation-flow/${firstCaseId}` },
          { label: 'Telemedicina', icon: <Video size={18}/>, path: '/telemedicine' }
        );
      }
    }

    return items;
  }, [user]);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900">
      <aside 
        className={`bg-slate-900 text-white transition-all duration-300 flex flex-col shrink-0 z-20 border-r border-slate-800 ${
          sidebarCollapsed ? 'w-14 min-w-[3.5rem]' : 'w-64 min-w-[16rem]'
        }`}
      >
        <div className="p-3 flex items-center justify-center border-b border-slate-800 h-16 shrink-0">
          <CuidiLogo size={sidebarCollapsed ? 30 : 70} inverted />
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1 mt-2 custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-md transition-all ${location.pathname === item.path ? 'bg-blue-700 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              title={sidebarCollapsed ? item.label : ''}
            >
              <div className="shrink-0">{item.icon}</div>
              {!sidebarCollapsed && <span className="text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-slate-800 space-y-1 shrink-0">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2.5 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-md transition-colors">
            <LogOut size={18} className="shrink-0" />
            {!sidebarCollapsed && <span className="text-xs font-medium whitespace-nowrap">Sair do Sistema</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative z-10 w-0">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-colors">
              <Menu size={20} />
            </button>
            <div className="hidden sm:block pl-2 border-l border-slate-200">
               <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide truncate max-w-[200px]">{user?.nodeName || 'UNIDADE DE SAÚDE'}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/notifications')} className="p-1.5 text-slate-500 hover:text-blue-600 rounded-full transition-all relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors" onClick={() => openModal('EditProfileModal')}>
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-800 leading-none">
                  {user?.name?.split(' ')[0]}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5 uppercase truncate max-w-[100px]">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
              <div className="w-8 h-8 bg-slate-200 rounded flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 custom-scrollbar w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
