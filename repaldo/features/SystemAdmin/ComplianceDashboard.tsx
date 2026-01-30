
import React from 'react';
import { Shield, AlertCircle, CheckCircle, BarChart, Info, Globe } from 'lucide-react';

export const ComplianceDashboardPage: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-2">
            <Shield size={14} /> Governança de Dados
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Compliance Nacional</h1>
          <p className="text-slate-500 mt-1 text-lg">Visão agregada de conformidade LGPD em toda a federação.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-start">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle size={32}/></div>
            <span className="text-4xl font-black text-slate-900">98%</span>
          </div>
          <h3 className="text-xl font-bold">Nós em Conformidade</h3>
          <p className="text-sm text-slate-500 font-medium">Instituições que aplicaram todas as políticas de soberania do cidadão.</p>
        </div>
        
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-start">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><AlertCircle size={32}/></div>
            <span className="text-4xl font-black text-slate-900">03</span>
          </div>
          <h3 className="text-xl font-bold">Riscos Críticos</h3>
          <p className="text-sm text-slate-500 font-medium">Nós com latência de auditoria acima do limite federado permitido.</p>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl flex flex-col justify-center items-center text-center space-y-6">
           <Globe size={48} className="text-blue-400" />
           <h3 className="text-xl font-bold">Ledger Global Health</h3>
           <p className="text-slate-400 text-sm">Integridade nacional verificada via BlockShare Protocol.</p>
           <button className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest">Executar Auditoria</button>
        </div>
      </div>
    </div>
  );
};
