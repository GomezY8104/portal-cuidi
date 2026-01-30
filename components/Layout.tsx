import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { UserRole } from '../types';
import { CuidiLogo } from './ui/CuidiLogo';
import { MOCK_PROVIDER_CASES } from '../mocks/seed';
import { 
  Home, Users, Database, Shield, Activity, BarChart2, 
  Settings, LogOut, Menu, X, Bell, User as UserIcon,
  Layers, Lock, Search, FileText, Globe, Pill, 
  FileSearch, FileBarChart, Monitor, AlertCircle,
  Video, ShieldCheck, History, Info, UploadCloud, FolderOpen,
  LifeBuoy, GitPullRequest, Plus, Cpu
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, sidebarCollapsed, setSidebarCollapsed, openModal } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = React.useMemo(() => {
    const role = user?.role;
    const items = [];

    if (role === UserRole.SYSTEM_ADMIN) {
      items.push(
        { label: 'Dashboard Global', icon: <Home size={20}/>, path: '/system' },
        { label: 'Gestão de Nós', icon: <Globe size={20}/>, path: '/system/nodes' },
        { label: 'Territórios', icon: <Monitor size={20}/>, path: '/system/territories' },
        { label: 'Compliance LGPD', icon: <ShieldCheck size={20}/>, path: '/system/compliance' },
        { label: 'Auditoria Global', icon: <Shield size={20}/>, path: '/system/audit' },
        { label: 'Auditoria IA', icon: <Cpu size={20}/>, path: '/system/code-audit' }, // Novo Item
        { label: 'Relatórios', icon: <FileBarChart size={20}/>, path: '/reports' }
      );
    } else if (role === UserRole.NODE_ADMIN) {
      items.push(
        { label: 'Dashboard do Nó', icon: <Home size={20}/>, path: '/node-admin' },
        { label: 'Equipe', icon: <Users size={20}/>, path: '/node-admin/users' },
        { label: 'Config. Técnica', icon: <Settings size={20}/>, path: '/node-admin/config' },
        { label: 'Políticas Locais', icon: <Lock size={20}/>, path: '/federation/policies' },
        { label: 'Relatórios Auditoria', icon: <FileBarChart size={20}/>, path: '/node-admin/audit-reports' }
      );
    } else if (role === UserRole.PATIENT) {
      items.push(
        { label: 'Meu Portal', icon: <UserIcon size={20}/>, path: '/patient' },
        { label: 'Meus Processos', icon: <GitPullRequest size={20}/>, path: '/patient/cases' },
        { label: 'Buscar Prestadores', icon: <Globe size={20}/>, path: '/patient/search' },
        { label: 'Histórico Clínico', icon: <Activity size={20}/>, path: '/patient/history' },
        { label: 'Exames', icon: <FileSearch size={20}/>, path: '/patient/exams' },
        { label: 'Consentimentos', icon: <Shield size={20}/>, path: '/patient/consents' },
        { label: 'Segurança', icon: <Lock size={20}/>, path: '/security' }
      );
    } else if (['REGULATOR', 'APS', 'UPA', 'PROVIDER'].includes(role || '')) {
      const firstCaseId = MOCK_PROVIDER_CASES[0]?.id || 'UPA-901';
      items.push(
        { label: 'Fila de Encaminhamento', icon: <Activity size={20}/>, path: role === 'REGULATOR' ? '/regulator' : role === 'PROVIDER' ? '/provider' : `/${role?.toLowerCase()}` }
      );

      if (role === 'APS') {
        items.push({ label: 'Novo Encaminhamento', icon: <Plus size={20}/>, path: '/aps/new-case' });
      } else if (role === 'UPA') {
        items.push({ label: 'Iniciar Regulação', icon: <Plus size={20}/>, path: '/upa/new-case' });
      }

      if (role === 'PROVIDER') {
        items.push({ label: 'Fluxo de Regulação', icon: <Layers size={20}/>, path: `/provider/regulation-flow/${firstCaseId}` });
      }

      items.push({ label: 'Telemedicina', icon: <Video size={20}/>, path: '/telemedicine' });
    }

    return items;
  }, [user]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <aside className={`bg-slate-900 text-white transition-all duration-300 flex flex-col ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4 flex items-center justify-center border-b border-slate-800 h-24">
          <CuidiLogo size={sidebarCollapsed ? 45 : 85} inverted />
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 mt-4 custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${location.pathname === item.path ? 'bg-blue-600 shadow-xl shadow-blue-900/40 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <div className="shrink-0">{item.icon}</div>
              {!sidebarCollapsed && <span className="text-xs font-bold whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-1">
          <button onClick={() => openModal('HelpCenterModal')} className="w-full flex items-center gap-3 p-3 text-slate-400 hover:text-white transition-colors">
            <LifeBuoy size={20} />
            {!sidebarCollapsed && <span className="text-xs font-medium">Suporte</span>}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-red-400 hover:text-red-300 transition-colors">
            <LogOut size={20} />
            {!sidebarCollapsed && <span className="text-xs font-medium">Sair do Portal</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
              <Menu size={22} />
            </button>
            <div className="hidden sm:block">
               <h2 className="text-base font-black text-slate-900 tracking-tight uppercase leading-none">{user?.nodeName}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button onClick={() => navigate('/notifications')} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white shadow-lg"></span>
            </button>
            <div className="flex items-center gap-3 lg:gap-4 pl-4 lg:pl-6 border-l border-slate-100 cursor-pointer group" onClick={() => openModal('EditProfileModal')}>
              <div className="text-right hidden md:block">
                <p className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  {user?.name} {user?.role === 'PROVIDER' && <span className="text-slate-400 font-bold ml-1 text-[10px]">(Prestador)</span>}
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Meu Perfil</p>
              </div>
              <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all font-black shadow-inner text-xs">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};