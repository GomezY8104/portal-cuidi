
import React from 'react';
import { Settings, Server, Key, Terminal, RefreshCw, CheckCircle, Globe, Shield } from 'lucide-react';

export const TechnicalConfigPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Configurações do Nó</h1>
        <p className="text-slate-500 mt-1 text-lg">Parâmetros técnicos de conectividade e segurança.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Server size={24}/></div>
             <h3 className="text-xl font-bold">API Gateway & Endpoints</h3>
           </div>
           
           <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">Endpoint Produção</label>
                <input readOnly value="https://api.cuidi.sus.gov.br/node-sp-01" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-mono text-xs text-blue-600" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">Status Conexão</label>
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-green-700">ONLINE • Latência 42ms</span>
                  <RefreshCw size={14} className="text-green-600 animate-spin-slow" />
                </div>
              </div>
           </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-8 shadow-2xl">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center"><Key size={24}/></div>
             <h3 className="text-xl font-bold">Credenciais Ledger</h3>
           </div>
           <div className="space-y-4">
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-4">API Key Federada</p>
                <p className="font-mono text-sm break-all">sk_live_cuidi_node_sp_4281923019823091823...</p>
                <button className="mt-4 text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline">Revogar e Regenerar</button>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase">Blockchain Sync</p>
                  <p className="text-sm font-bold">Totalmente Sincronizado</p>
                </div>
                <CheckCircle size={24} className="text-emerald-500" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
