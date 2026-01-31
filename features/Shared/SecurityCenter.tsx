import React from 'react';
import { Shield, Key, Smartphone, Lock, LogOut, History, ShieldCheck, Fingerprint, Trash2, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';

export const SecurityCenterPage: React.FC = () => {
  const { openModal, setUser } = useAppStore();
  const navigate = useNavigate();

  const handleLogoutAll = () => {
    if (confirm('Deseja encerrar todas as outras sessões ativas? Sua sessão atual permanecerá conectada.')) {
      alert('Sessões remotas encerradas com sucesso.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cuidi_user_session');
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in-up pb-20">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <Shield size={40} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Centro de Segurança Federado</h1>
        <p className="text-slate-500 text-lg">Proteja sua identidade no SUS e gerencie seus acessos globais.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 space-y-6 shadow-sm group hover:shadow-xl transition-all">
          <h3 className="text-xl font-bold flex items-center gap-2"><Smartphone size={24} className="text-blue-600"/> Verificação em 2 Etapas (MFA)</h3>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">Adicione uma camada extra de segurança usando seu smartphone para validar logins profissionais ou de cidadão.</p>
          <button 
            onClick={() => openModal('MFASetupModal')}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            Ativar MFA CUIDI
          </button>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 space-y-6 shadow-sm group hover:shadow-xl transition-all">
          <h3 className="text-xl font-bold flex items-center gap-2"><Fingerprint size={24} className="text-indigo-600"/> Biometria / Passkeys</h3>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">Utilize o FaceID, TouchID ou chaves USB para um acesso instantâneo e ultra-seguro sem necessidade de senhas.</p>
          <button 
            onClick={() => openModal('PasskeyModal')}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all"
          >
            Registrar Biometria
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold flex items-center gap-2"><History size={20} className="text-blue-600"/> Sessões Ativas</h3>
          <button 
            onClick={handleLogoutAll}
            className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline"
          >
            Encerrar Outros Acessos
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {[
            { device: 'Chrome no MacOS', location: 'São Paulo, Brasil', time: 'Dispositivo Atual', status: 'THIS' },
            { device: 'iPhone 15 Pro', location: 'Rio de Janeiro, Brasil', time: 'Há 2 horas', status: 'OTHER' },
          ].map((s, i) => (
            <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                   {s.device.includes('iPhone') ? <Smartphone size={22}/> : <Lock size={22}/>}
                 </div>
                 <div>
                   <p className="text-base font-black text-slate-900">{s.device}</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.location} • {s.time}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 {s.status === 'OTHER' ? (
                   <button 
                    onClick={() => alert('Sessão encerrada.')}
                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                   >
                    <LogOut size={18}/>
                   </button>
                 ) : (
                   <span className="text-[10px] font-black text-green-600 bg-green-50 px-4 py-1.5 rounded-full border border-green-100 uppercase tracking-widest">Ativo</span>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zona de Perigo */}
      <div className="bg-red-50 rounded-[3rem] border border-red-100 p-10 space-y-6">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
               <AlertTriangle size={24}/>
            </div>
            <div>
               <h3 className="text-lg font-black text-red-900 uppercase">Zona de Perigo</h3>
               <p className="text-xs font-bold text-red-700/70">Ações irreversíveis para sua conta</p>
            </div>
         </div>
         <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white rounded-2xl border border-red-100">
            <div className="space-y-1">
               <p className="text-sm font-black text-slate-900">Excluir minha conta</p>
               <p className="text-xs text-slate-500 font-medium">Isso removerá permanentemente seu acesso ao nó federado.</p>
            </div>
            <button 
               onClick={() => openModal('DeleteAccountModal')}
               className="px-6 py-3 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center gap-2"
            >
               <Trash2 size={14}/> Excluir Conta
            </button>
         </div>
      </div>

      <div className="pt-6 flex justify-center">
         <button 
          onClick={logout}
          className="flex items-center gap-3 px-10 py-5 bg-white text-slate-500 rounded-3xl font-black uppercase text-xs tracking-widest hover:text-slate-900 hover:shadow-lg transition-all border border-slate-200"
         >
           <LogOut size={20} /> Encerrar Sessão no Portal
         </button>
      </div>
    </div>
  );
};