import React, { useState } from 'react';
import { 
  Lock, Plus, Shield, Search, 
  Info, AlertTriangle, CheckCircle, 
  ChevronRight, Settings2, Filter, Trash2, Edit, PauseCircle
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const LocalPoliciesPage: React.FC = () => {
  const { openDrawer } = useAppStore();
  const [policies, setPolicies] = useState([
    { id: 'POL-01', name: 'Compartilhamento Clínico Padrão', dataType: 'CLINICAL', purpose: 'TREATMENT', recipients: 'ANY_FEDERATED', status: 'ACTIVE', expiry: 'PERMANENT' },
    { id: 'POL-02', name: 'Metadados Administrativos', dataType: 'METADATA', purpose: 'ADMIN', recipients: 'REGULATORS', status: 'ACTIVE', expiry: 'PERMANENT' },
    { id: 'POL-03', name: 'Pesquisa Oncológica 2024', dataType: 'RESTRICTED', purpose: 'RESEARCH', recipients: 'SPECIFIC_NODES', status: 'SUSPENDED', expiry: '31/12/2024' },
  ]);

  const handleCreatePolicy = () => {
    openDrawer('PolicyWizardDrawer', { 
      onComplete: (newPolicy: any) => setPolicies([...policies, { ...newPolicy, id: `POL-0${policies.length + 1}`, status: 'ACTIVE' }]) 
    });
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Políticas de Acesso</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Defina como sua instituição compartilha dados na rede federada.</p>
        </div>
        <button 
          onClick={handleCreatePolicy}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"
        >
           <Plus size={18} /> Nova Política
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute -top-6 -right-6 opacity-10"><Shield size={120} /></div>
            <h3 className="text-lg font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Lock size={18} className="text-blue-400" /> Governança Ativa
            </h3>
            <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">Seu nó está operando em modo <strong>FEDERADO ATIVO</strong>. Todas as políticas são validadas pelo motor nacional.</p>
            <div className="space-y-3">
               <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Ativas</span>
                 <span className="text-sm font-black text-emerald-400">{policies.filter(p => p.status === 'ACTIVE').length}</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Suspensas</span>
                 <span className="text-sm font-black text-amber-400">{policies.filter(p => p.status === 'SUSPENDED').length}</span>
               </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100">
             <div className="flex items-center gap-2 text-amber-700 font-black text-[10px] uppercase tracking-widest mb-4">
                <AlertTriangle size={14} /> Nota de Compliance
             </div>
             <p className="text-xs text-amber-900/70 leading-relaxed font-medium">Políticas de dados "RESTRICTED" exigem aprovação adicional do DPO territorial.</p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-4 rounded-[2rem] border border-slate-200 flex gap-4 shadow-sm">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Filtrar políticas por finalidade..." className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl outline-none font-bold text-xs transition-all focus:bg-white focus:ring-2 focus:ring-blue-100" />
            </div>
            <button className="px-6 py-3 bg-slate-50 rounded-xl text-slate-500 font-bold text-xs flex items-center gap-2 hover:bg-slate-100 transition-colors uppercase tracking-wider">
              <Filter size={16} /> Filtrar
            </button>
          </div>

          <div className="grid gap-4">
            {policies.map((pol) => (
              <div key={pol.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${pol.status === 'ACTIVE' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Settings2 size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${pol.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{pol.status}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">#{pol.id}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{pol.name}</h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-[10px] font-bold text-slate-500 uppercase">
                         <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">Dado: {pol.dataType}</span>
                         <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">Finalidade: {pol.purpose}</span>
                         <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">Validade: {pol.expiry}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Editar"><Edit size={18}/></button>
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all" title="Suspender"><PauseCircle size={18}/></button>
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Revogar"><Trash2 size={18}/></button>
                    <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all ml-2 shadow-lg active:scale-95">
                      Detalhes <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};