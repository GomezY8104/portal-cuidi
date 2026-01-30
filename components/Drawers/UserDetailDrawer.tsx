import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { User, Mail, Shield, Building2, Clock, CheckCircle, AlertCircle, X, Activity } from 'lucide-react';

export const UserDetailDrawer: React.FC = () => {
  const { drawerData, closeDrawer } = useAppStore();

  if (!drawerData) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl">
              {drawerData.name.charAt(0)}
           </div>
           <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{drawerData.name}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {drawerData.id}</p>
           </div>
        </div>
        <button onClick={closeDrawer} className="p-2 text-slate-300 hover:text-slate-500 transition-colors"><X size={24}/></button>
      </div>

      <div className="p-10 flex-1 overflow-y-auto space-y-10">
         <section className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Informações de Acesso</h4>
            <div className="grid grid-cols-1 gap-4">
               <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4">
                  <Mail size={18} className="text-slate-400"/>
                  <div>
                     <p className="text-[9px] font-bold text-slate-400 uppercase">Email Corporativo</p>
                     <p className="text-sm font-bold text-slate-900">{drawerData.email}</p>
                  </div>
               </div>
               <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4">
                  <Shield size={18} className="text-slate-400"/>
                  <div>
                     <p className="text-[9px] font-bold text-slate-400 uppercase">Função (Role)</p>
                     <p className="text-sm font-bold text-blue-600 uppercase">{drawerData.role}</p>
                  </div>
               </div>
               <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4">
                  <Building2 size={18} className="text-slate-400"/>
                  <div>
                     <p className="text-[9px] font-bold text-slate-400 uppercase">Unidade Vinculada</p>
                     <p className="text-sm font-bold text-slate-900 uppercase">{drawerData.unit}</p>
                  </div>
               </div>
            </div>
         </section>

         <section className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Status e Atividade</h4>
            <div className="flex gap-4">
               <div className={`flex-1 p-5 rounded-2xl border flex items-center gap-3 ${drawerData.status === 'ACTIVE' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                  {drawerData.status === 'ACTIVE' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
                  <div>
                     <p className="text-[9px] font-black uppercase tracking-widest">Status da Conta</p>
                     <p className="text-sm font-bold">{drawerData.status}</p>
                  </div>
               </div>
               <div className="flex-1 p-5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3">
                  <Clock size={20} className="text-slate-400"/>
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Último Acesso</p>
                     <p className="text-sm font-bold text-slate-700">{drawerData.lastAccess}</p>
                  </div>
               </div>
            </div>
         </section>

         <section className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2"><Activity size={12}/> Logs Recentes (Audit)</h4>
            <div className="border border-slate-100 rounded-2xl overflow-hidden">
               <div className="p-4 bg-slate-50 text-[10px] font-medium text-slate-500 border-b border-slate-100">
                  LOGIN_SUCCESS • IP 192.168.1.10 • {drawerData.lastAccess}
               </div>
               <div className="p-4 bg-white text-[10px] font-medium text-slate-500 border-b border-slate-100">
                  VIEW_PATIENT_DATA • ID P-901 • Ontem, 14:00
               </div>
               <div className="p-4 bg-slate-50 text-[10px] font-medium text-slate-500">
                  SEARCH_FEDERATED • CARDIOLOGIA • Ontem, 13:45
               </div>
            </div>
         </section>
      </div>

      <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4">
         <button className="flex-1 py-4 bg-slate-200 text-slate-500 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-300 transition-all">Resetar Senha</button>
         <button onClick={closeDrawer} className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all">Fechar</button>
      </div>
    </div>
  );
};