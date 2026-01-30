
import React from 'react';
import { ShieldCheck, QrCode, Globe, Zap, Award } from 'lucide-react';
import { UserSession } from '../../types';
import { CuidiLogo } from './CuidiLogo';

interface ProfessionalBadgeProps {
  user: UserSession;
}

export const ProfessionalBadge: React.FC<ProfessionalBadgeProps> = ({ user }) => {
  return (
    <div className="relative w-full max-w-sm aspect-[1.6/1] bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden group select-none">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-600/20 rounded-full blur-[80px] group-hover:bg-blue-600/30 transition-all duration-700"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-600/10 rounded-full blur-[60px]"></div>

      {/* Top Section */}
      <div className="relative z-10 flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
            <CuidiLogo size={40} inverted />
          </div>
          <div>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] leading-none">CUIDI ID</p>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Soberania Digital SUS</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
          <ShieldCheck size={12} />
          <span className="text-[8px] font-black uppercase tracking-widest">Autenticado</span>
        </div>
      </div>

      {/* Middle Section: User Info */}
      <div className="relative z-10 space-y-1">
        <h3 className="text-xl font-black tracking-tight uppercase leading-none truncate max-w-[200px]">{user.name}</h3>
        <div className="flex items-center gap-2 text-slate-400">
           <p className="text-[9px] font-black uppercase tracking-widest">{user.role.replace('_', ' ')}</p>
           <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
           <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{user.specialty || 'GERAL'}</p>
        </div>
      </div>

      {/* Registry and QR */}
      <div className="relative z-10 flex justify-between items-end mt-8 pt-6 border-t border-white/5">
        <div className="space-y-4">
           <div className="space-y-1">
             <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Registro Profissional</p>
             <p className="font-mono text-sm font-black text-white">{user.registryNumber || 'N/A'}</p>
           </div>
           <div className="space-y-1">
             <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Nó Institucional</p>
             <p className="text-[9px] font-bold text-slate-300 uppercase truncate max-w-[160px]">{user.nodeName}</p>
           </div>
        </div>

        <div className="flex flex-col items-center gap-2">
           <div className="p-2 bg-white rounded-xl shadow-lg group-hover:scale-105 transition-transform">
             <QrCode size={48} className="text-slate-900" />
           </div>
           <p className="text-[6px] font-black text-slate-500 uppercase tracking-widest">Verify Ledger</p>
        </div>
      </div>

      {/* Authenticity Seal */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
        <Award size={140} strokeWidth={1} />
      </div>
    </div>
  );
};
