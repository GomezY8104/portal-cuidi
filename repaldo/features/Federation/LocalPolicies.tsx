
import React, { useState } from 'react';
import { 
  Lock, Plus, Shield, Search, 
  Info, AlertTriangle, CheckCircle, 
  ChevronRight, ArrowRight, UserCheck, 
  Settings2, Filter, Trash2, Edit
} from 'lucide-react';
import { MOCK_POLICIES } from '../../mocks/seed';

/**
 * P14: Políticas Locais (/federation/policies)
 * Onde o NODE_ADMIN configura as regras de governança do seu nó.
 */
export const LocalPoliciesPage: React.FC = () => {
  const [policies] = useState(MOCK_POLICIES);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-2">
            <Lock size={14} /> Governança do Nó
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Políticas de Acesso</h1>
          <p className="text-slate-500 mt-1 text-lg">Defina como sua instituição compartilha dados na rede.</p>
        </div>
        <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
           <Plus size={18} /> Nova Política
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute -top-6 -right-6 opacity-10"><Shield size={120} /></div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <UserCheck size={20} className="text-blue-400" />
              Estado Atual
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">Seu nó está operando em modo <strong>FEDERADO ATIVO</strong>. Todas as políticas são validadas pelo motor nacional.</p>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                 <span className="text-xs font-bold text-slate-400">Políticas Ativas</span>
                 <span className="text-sm font-black text-white">{policies.length}</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                 <span className="text-xs font-bold text-slate-400">Última Revisão</span>
                 <span className="text-sm font-black text-white">Há 2 dias</span>
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
          <div className="bg-white p-4 rounded-3xl border border-slate-200 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Filtrar políticas por finalidade..." className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl outline-none" />
            </div>
            <button className="px-6 py-3 bg-slate-50 rounded-xl text-slate-500 hover:text-slate-900 transition-colors">
              <Filter size={20} />
            </button>
          </div>

          <div className="grid gap-4">
            {policies.map((pol) => (
              <div key={pol.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:shadow-xl hover:shadow-blue-50 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Settings2 size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md uppercase tracking-widest">{pol.dataType}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{pol.id}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{pol.name}</h3>
                      <p className="text-slate-500 text-sm mt-1">Finalidade: <strong className="text-slate-700">{pol.purpose}</strong> • Escopo: {pol.scope}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit size={18}/></button>
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
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
