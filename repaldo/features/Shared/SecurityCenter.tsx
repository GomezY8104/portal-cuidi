
import React from 'react';
import { Shield, Key, Smartphone, Lock, LogOut, History, ShieldCheck } from 'lucide-react';

export const SecurityCenterPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in-up">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <Shield size={40} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Centro de Segurança</h1>
        <p className="text-slate-500 text-lg">Proteja sua identidade federada e gerencie seus acessos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 space-y-6 shadow-sm">
          <h3 className="text-xl font-bold flex items-center gap-2"><Key size={20} className="text-blue-600"/> Autenticação de 2 Fatores</h3>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">Ative o MFA para garantir que apenas você acesse seu perfil, mesmo se sua senha for comprometida.</p>
          <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200">Configurar MFA</button>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 space-y-6 shadow-sm">
          <h3 className="text-xl font-bold flex items-center gap-2"><Smartphone size={20} className="text-blue-600"/> Chaves de Segurança (Passkeys)</h3>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">Utilize biometria ou chaves físicas USB para o nível máximo de segurança assistencial.</p>
          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Registrar Chave</button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2"><History size={20} className="text-blue-600"/> Sessões Ativas</h3>
          <button className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline">Encerrar Todas</button>
        </div>
        <div className="divide-y divide-slate-50">
          {[
            { device: 'Chrome no MacOS', location: 'São Paulo, Brasil', time: 'Atual', status: 'THIS' },
            { device: 'iPhone 15 Pro', location: 'São Paulo, Brasil', time: 'Ontem, 18:42', status: 'OTHER' },
          ].map((s, i) => (
            <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                   {s.device.includes('iPhone') ? <Smartphone size={20}/> : <Lock size={20}/>}
                 </div>
                 <div>
                   <p className="text-sm font-bold text-slate-900">{s.device}</p>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{s.location} • {s.time}</p>
                 </div>
              </div>
              {s.status === 'OTHER' && <button className="p-2 text-slate-400 hover:text-red-600"><LogOut size={20}/></button>}
              {s.status === 'THIS' && <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded">ESTA SESSÃO</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
